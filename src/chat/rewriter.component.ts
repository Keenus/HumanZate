import { Component, inject, signal, input, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService, ToolType, RateLimitError } from '../services/gemini.service';
import { RateLimitService } from '../services/rate-limit.service';
import { RouterLink } from '@angular/router';
import { CharacterComponent, CharacterPose, CharacterPosition } from '../shared/character.component';

interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

@Component({
  selector: 'app-rewriter',
  standalone: true,
  imports: [FormsModule, RouterLink, CharacterComponent],
  template: `
    <!-- Main App Container: Fixed height to feel like a "Tool" -->
    <div class="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row bg-black relative overflow-hidden">
      
      <!-- Character Overlay -->
      <app-character 
        [pose]="characterPose()" 
        [position]="characterPosition()" 
        [message]="characterMessage()"
        (clicked)="onCharacterClick()"
      />

      <!-- Chat Popup -->
      @if (showChatInput()) {
        <div class="fixed bottom-24 right-4 md:right-8 z-[60] w-72 md:w-96 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div class="bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl p-4 relative backdrop-blur-xl">
              <button (click)="closeChatInput()" class="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 border border-zinc-700 hover:bg-zinc-700 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              
              <p class="text-xs font-medium text-blue-400 mb-2 uppercase tracking-wide">Refine Result</p>
              <div class="flex gap-2">
                 <input 
                   type="text" 
                   [(ngModel)]="chatInputText"
                   (keyup.enter)="sendFollowUp()"
                   [disabled]="isProcessing()"
                   placeholder="Make it shorter..."
                   class="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
                   autoFocus
                 />
                 <button 
                   (click)="sendFollowUp()"
                   [disabled]="!chatInputText() || isProcessing()"
                   class="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                 </button>
              </div>
           </div>
        </div>
      }

      <!-- INPUT PANEL (Left) -->
      <div class="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 h-1/2 lg:h-full z-10 bg-black">
        
        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between">
           <div class="flex items-center gap-2">
              <a routerLink="/app" class="text-zinc-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </a>
              <span class="text-xs font-bold tracking-widest text-zinc-500 uppercase">{{ config().title }}</span>
           </div>
           <div class="flex items-center gap-3">
              <div class="text-xs text-zinc-500 font-mono">
                <span class="text-zinc-600">{{ inputText().length }}</span> chars
              </div>
              <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900/50 border border-zinc-800">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400">
                   <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                 </svg>
                 <span class="text-xs font-medium" [class.text-zinc-400]="rateLimit.remainingDaily() > 0" [class.text-yellow-400]="rateLimit.remainingDaily() <= 3 && rateLimit.remainingDaily() > 0" [class.text-red-400]="rateLimit.remainingDaily() === 0">
                   {{ rateLimit.remainingDaily() }}/{{ rateLimit.getStats().daily.limit }}
                 </span>
              </div>
           </div>
        </div>

        <!-- Brief Section -->
        <div class="px-6 pt-4 pb-2 border-b border-white/5">
          <label class="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">Brief (opcjonalnie)</label>
          <select 
            [(ngModel)]="selectedBrief"
            [disabled]="isProcessing()"
            class="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Wybierz brief...</option>
            @for (brief of briefOptions(); track brief.value) {
              <option [value]="brief.value">{{ brief.label }}</option>
            }
          </select>
          @if (selectedBrief() && selectedBrief() !== '') {
            <p class="text-xs text-zinc-500 mt-1.5">{{ getBriefDescription(selectedBrief()!) }}</p>
          }
        </div>

        <!-- Editor Area -->
        <div class="flex-1 relative group">
          <textarea
            [(ngModel)]="inputText"
            (focus)="onInputFocus()"
            [disabled]="isProcessing()"
            [placeholder]="config().placeholder"
            class="w-full h-full bg-transparent resize-none border-0 focus:ring-0 p-6 md:p-8 text-base md:text-lg leading-relaxed text-zinc-300 placeholder-zinc-700 focus:outline-none font-sans"
          ></textarea>
        </div>
        
        <!-- Action Bar -->
        <div class="p-4 flex flex-col gap-2">
           @if (rateLimitError()) {
             <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
               <p class="text-xs text-red-400 font-medium mb-1">Limit przekroczony</p>
               <p class="text-xs text-red-500/80">{{ rateLimitError() }}</p>
             </div>
           }
           <div class="flex justify-end">
              <button
                 (click)="rewrite()"
                 [disabled]="!inputText() || isProcessing() || !rateLimit.canUse()"
                 class="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
               >
                 @if (isProcessing()) {
                   <span class="animate-pulse">Processing...</span>
                 } @else if (!rateLimit.canUse()) {
                   Limit przekroczony
                 } @else {
                   {{ config().buttonLabel }}
                 }
               </button>
           </div>
        </div>
      </div>

      <!-- OUTPUT PANEL (Right) -->
      <div class="flex-1 flex flex-col h-1/2 lg:h-full z-10 bg-[#0c0c0e]">
        <div class="px-6 py-4 flex items-center justify-between border-b border-white/5 lg:border-none">
           <span class="text-xs font-bold tracking-widest text-blue-500 uppercase">Humanized Output</span>
           @if (outputText()) {
             <button (click)="copyToClipboard()" class="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                {{ copyLabel() }}
             </button>
           }
        </div>
        
        <div class="flex-1 relative overflow-hidden">
          @if (outputText()) {
            <div class="absolute inset-0 overflow-y-auto p-6 md:p-8 custom-scrollbar">
               <!-- Serif font for the "Human" feel -->
               <p class="text-lg md:text-xl leading-8 text-zinc-100 whitespace-pre-wrap animate-in fade-in duration-700 font-serif">
                 {{ outputText() }}
               </p>
               
               <div class="mt-12 flex justify-center">
                  <button (click)="onCharacterClick()" class="px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center gap-2">
                     Refine this result
                  </button>
               </div>
            </div>
          } @else if (isProcessing()) {
            <div class="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
               <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                 <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               </div>
               <p class="text-sm font-light font-serif italic">Translating to human...</p>
            </div>
          } @else {
             <div class="h-full flex flex-col items-center justify-center text-zinc-800 select-none">
               <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 opacity-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
               </div>
               <p class="text-sm font-medium text-zinc-700">Waiting for input</p>
             </div>
          }
        </div>
      </div>

    </div>
  `
})
export class RewriterComponent {
  private gemini = inject(GeminiService);
  rateLimit = inject(RateLimitService);
  type = input<ToolType>('humanize');

  inputText = signal('');
  outputText = signal('');
  isProcessing = signal(false);
  copyLabel = signal('Copy');
  rateLimitError = signal<string | null>(null);
  selectedBrief = signal<string>('');

  characterPose = signal<CharacterPose>('idle');
  characterPosition = signal<CharacterPosition>('bottom-right');
  characterMessage = signal<string | null>(null);

  showChatInput = signal(false);
  chatInputText = signal('');
  chatHistory: ChatMessage[] = [];

  config = computed(() => {
    switch(this.type()) {
      case 'product': return { title: 'Product Polisher', placeholder: 'Paste specs here...', buttonLabel: 'Polish', inputLabel: '' };
      case 'offer': return { title: 'Offer Generator', placeholder: 'Client details...', buttonLabel: 'Generate', inputLabel: '' };
      case 'humanize': default: return { title: 'Humanize Text', placeholder: 'Paste AI text here...', buttonLabel: 'Humanize', inputLabel: '' };
    }
  });

  briefOptions = computed(() => {
    switch(this.type()) {
      case 'humanize':
        return [
          { value: 'casual', label: 'Casual & Conversational' },
          { value: 'professional', label: 'Professional & Formal' },
          { value: 'creative', label: 'Creative & Engaging' },
          { value: 'concise', label: 'Concise & Direct' }
        ];
      case 'product':
        return [
          { value: 'benefits', label: 'Focus on Benefits' },
          { value: 'features', label: 'Highlight Features' },
          { value: 'emotional', label: 'Emotional Appeal' },
          { value: 'technical', label: 'Technical Details' }
        ];
      case 'offer':
        return [
          { value: 'value', label: 'Emphasize Value' },
          { value: 'urgency', label: 'Create Urgency' },
          { value: 'trust', label: 'Build Trust' },
          { value: 'custom', label: 'Custom Solution' }
        ];
      default:
        return [];
    }
  });

  constructor() {
    effect(() => {
      this.type();
      this.inputText.set('');
      this.outputText.set('');
      this.selectedBrief.set('');
      this.isProcessing.set(false);
      this.chatHistory = [];
      this.showChatInput.set(false);
      this.resetCharacter();
    });
  }

  getBriefDescription(briefValue: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      humanize: {
        'casual': 'Tekst będzie brzmiał swobodnie i naturalnie, jak rozmowa z przyjacielem.',
        'professional': 'Tekst będzie profesjonalny i formalny, odpowiedni do biznesu.',
        'creative': 'Tekst będzie kreatywny i angażujący, z żywym językiem.',
        'concise': 'Tekst będzie zwięzły i bezpośredni, bez zbędnych słów.'
      },
      product: {
        'benefits': 'Opis skupi się na korzyściach dla klienta, nie tylko na cechach.',
        'features': 'Opis podkreśli konkretne funkcje i specyfikacje produktu.',
        'emotional': 'Opis będzie budował emocjonalne połączenie z klientem.',
        'technical': 'Opis będzie zawierał szczegóły techniczne i dane.'
      },
      offer: {
        'value': 'Oferta podkreśli wartość i ROI dla klienta.',
        'urgency': 'Oferta stworzy poczucie pilności i ograniczonej dostępności.',
        'trust': 'Oferta zbuduje zaufanie poprzez referencje i gwarancje.',
        'custom': 'Oferta będzie podkreślać indywidualne podejście i personalizację.'
      }
    };
    return descriptions[this.type()]?.[briefValue] || '';
  }

  resetCharacter() {
    this.characterPose.set('idle');
    this.characterPosition.set('bottom-right');
  }

  onInputFocus() {
    if (this.characterPosition() !== 'bottom-left') {
      this.characterPosition.set('bottom-left');
    }
  }

  onCharacterClick() {
    if (this.outputText()) {
      this.showChatInput.set(!this.showChatInput());
    }
  }

  closeChatInput() {
    this.showChatInput.set(false);
  }

  async rewrite() {
    if (!this.inputText()) return;
    this.rateLimitError.set(null);
    this.startProcessing('center', 'thinking', "Reading...");
    this.chatHistory = [];
    try {
      const result = await this.gemini.rewriteText(
        this.inputText(), 
        this.type(), 
        [],
        this.selectedBrief() ? this.selectedBrief() : undefined
      );
      this.outputText.set(result);
      this.chatHistory.push({ role: 'user', parts: [{ text: this.inputText() }] });
      this.chatHistory.push({ role: 'model', parts: [{ text: result }] });
      this.finishProcessing('bottom-right', 'success', "Done.");
    } catch (err) { 
      if (err instanceof RateLimitError) {
        this.handleRateLimitError(err);
      } else {
        this.handleError();
      }
    }
  }

  async sendFollowUp() {
    if (!this.chatInputText()) return;
    this.rateLimitError.set(null);
    const request = this.chatInputText();
    this.chatInputText.set('');
    this.showChatInput.set(false);
    this.startProcessing('center', 'thinking', "Refining...");
    this.chatHistory.push({ role: 'user', parts: [{ text: request }] });
    try {
      const result = await this.gemini.rewriteText(
        request, 
        this.type(), 
        this.chatHistory,
        this.selectedBrief() ? this.selectedBrief() : undefined
      );
      this.outputText.set(result);
      this.chatHistory.push({ role: 'model', parts: [{ text: result }] });
      this.finishProcessing('bottom-right', 'success', "Updated.");
    } catch (err) { 
      if (err instanceof RateLimitError) {
        this.handleRateLimitError(err);
      } else {
        this.handleError();
      }
    }
  }

  private startProcessing(pos: CharacterPosition, pose: CharacterPose, msg: string) {
    this.isProcessing.set(true);
    this.characterPosition.set(pos);
    this.characterPose.set(pose);
    this.characterMessage.set(msg);
  }

  private finishProcessing(pos: CharacterPosition, pose: CharacterPose, msg: string) {
    this.isProcessing.set(false);
    this.characterPosition.set(pos);
    this.characterPose.set(pose);
    this.characterMessage.set(msg);
    setTimeout(() => { this.characterPose.set('idle'); this.characterMessage.set(null); }, 3000);
  }

  private handleError() {
    this.outputText.set('Error processing text.');
    this.isProcessing.set(false);
    this.characterMessage.set("Error.");
    setTimeout(() => this.characterMessage.set(null), 3000);
  }

  private handleRateLimitError(err: RateLimitError) {
    this.rateLimitError.set(err.reason);
    this.isProcessing.set(false);
    this.characterMessage.set("Limit reached.");
    setTimeout(() => this.characterMessage.set(null), 3000);
  }

  copyToClipboard() {
    if (!this.outputText()) return;
    navigator.clipboard.writeText(this.outputText());
    this.copyLabel.set('Copied');
    setTimeout(() => this.copyLabel.set('Copy'), 2000);
  }
}