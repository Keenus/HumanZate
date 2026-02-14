import { Component, input, computed, signal, effect, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CharacterPose = 'idle' | 'thinking' | 'success';
export type CharacterPosition = 'bottom-right' | 'bottom-left' | 'center' | 'hero';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-float {
      animation: float 5s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }
    .animate-pulse-glow {
      animation: pulse-glow 4s ease-in-out infinite;
    }

    /* Message Bubble Entry */
    @keyframes messagePop {
      0% { opacity: 0; transform: scale(0.9) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-message {
      animation: messagePop 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }

    .slide-in-bottom { animation: slideInBottom 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideInBottom { from { transform: translate(-50%, 120%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

    .slide-in-left { animation: slideInLeft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideInLeft { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* Writing animation */
    @keyframes write {
      0% { stroke-dashoffset: 100; opacity: 0; }
      50% { opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 1; }
    }
    .animate-write {
      stroke-dasharray: 100;
      animation: write 2s ease-in-out infinite;
    }

    @keyframes textTransform {
      0% { opacity: 0.3; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1); }
      100% { opacity: 0.3; transform: scale(0.95); }
    }
    .animate-text-transform {
      animation: textTransform 2s ease-in-out infinite;
    }

    @keyframes penMove {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(15px) translateY(-2px); }
      50% { transform: translateX(30px) translateY(2px); }
      75% { transform: translateX(15px) translateY(4px); }
    }
    .animate-pen {
      animation: penMove 2s ease-in-out infinite;
    }

    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
  template: `
    <div class="pointer-events-none z-50 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]" [ngClass]="containerClasses()">
      
      <!-- Professional HUD Speech Bubble -->
      <!-- Hide bubble when compact unless there is a specific message forcing attention -->
      <div 
        class="mb-2 relative origin-bottom-right transition-all duration-500"
        [class.opacity-0]="isCompact() && !message()" 
        [class.translate-y-4]="isCompact() && !message()"
        [class.pointer-events-none]="isCompact() && !message()"
      >
        @if (message()) {
          <div class="bg-zinc-950/90 backdrop-blur-xl text-zinc-100 px-6 py-4 rounded-2xl border border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[280px] md:max-w-md relative overflow-hidden animate-message">
            <!-- Tech accents -->
            <div class="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div class="absolute top-0 right-0 w-[100px] h-[100px] bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"></div>

            <div class="flex items-center gap-2 mb-1.5 opacity-60">
               <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
               <span class="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">System.AI</span>
            </div>
            
            <p class="text-sm md:text-base font-light leading-relaxed tracking-wide text-zinc-200">
              {{ message() }}
            </p>
          </div>
        }
      </div>

      <!-- Character Container -->
      <div 
        class="relative transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-auto cursor-pointer group"
        [ngClass]="sizeClasses()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
        (click)="onClick()"
      >
        
        <!-- Holographic Glow behind -->
        <div class="absolute inset-4 bg-indigo-600/20 blur-[40px] rounded-full animate-pulse-glow transition-opacity duration-500"
             [class.opacity-0]="isCompact()"></div>
        
        <!-- Typing Animation Container -->
        <div class="w-full h-full relative z-10 flex items-center justify-center">
          
          <!-- Compact Logo (when collapsed) -->
          @if (isCompact()) {
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 flex items-center justify-center shadow-lg transition-all duration-300">
              <span class="font-serif text-black font-bold text-lg italic">H</span>
            </div>
          }
          
          <!-- Expanded View with Typing Animation -->
          @if (!isCompact()) {
            <div class="flex flex-col items-center justify-center gap-4 w-full h-full">
              
              <!-- IDLE STATE: Simple H letter -->
              @if (pose() === 'idle') {
                <div class="relative">
                  <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 flex items-center justify-center shadow-lg">
                    <span class="font-serif text-black font-bold text-5xl italic">H</span>
                  </div>
                  <div class="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse"></div>
                </div>
              }
              
              <!-- THINKING STATE: Typing animation with transformation -->
              @if (pose() === 'thinking') {
                <div class="flex flex-col items-center gap-3 min-w-[200px] relative">
                  <!-- Typewriter effect container -->
                  <div class="relative bg-zinc-900/90 backdrop-blur-md border border-indigo-500/30 rounded-xl px-8 py-5 shadow-2xl overflow-hidden">
                    <!-- Animated background gradient -->
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-500/5 animate-pulse"></div>
                    
                    <!-- Content -->
                    <div class="relative z-10">
                      <!-- AI text being deleted -->
                      <div class="text-center mb-3 transition-opacity duration-700" 
                           [style.opacity]="aiTextOpacity()">
                        <span class="text-zinc-400 font-mono text-sm tracking-wider">
                          AI
                          <span class="inline-block w-0.5 h-4 bg-zinc-400 ml-1.5 animate-[blink_1s_infinite]"></span>
                        </span>
                      </div>
                      
                      <!-- Transformation arrow -->
                      <div class="flex justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" class="text-indigo-400">
                          <path d="M 12 6 L 12 18 M 6 12 L 12 18 L 18 12" 
                                stroke="currentColor" 
                                stroke-width="2.5" 
                                fill="none" 
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                opacity="0.7">
                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite" />
                            <animateTransform attributeName="transform" type="translate" values="0,0;0,2;0,0" dur="1.8s" repeatCount="indefinite" />
                          </path>
                        </svg>
                      </div>
                      
                      <!-- Human text being typed -->
                      <div class="text-center">
                        <span class="text-indigo-300 font-serif text-xl font-bold tracking-wide">
                          {{ humanText() }}
                          <span class="inline-block w-1 h-6 bg-indigo-400 ml-1.5 animate-[blink_0.8s_infinite]"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Subtle glow effect -->
                  <div class="absolute -inset-8 bg-indigo-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
                </div>
              }
              
              <!-- SUCCESS STATE: Checkmark with H -->
              @if (pose() === 'success') {
                <div class="relative">
                  <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-200 to-emerald-400 flex items-center justify-center shadow-lg">
                    <svg width="40" height="40" viewBox="0 0 40 40" class="text-emerald-700">
                      <path d="M 10 20 L 18 28 L 30 12" 
                            stroke="currentColor" 
                            stroke-width="4" 
                            fill="none" 
                            stroke-linecap="round" 
                            stroke-linejoin="round"
                            class="animate-[fadeIn_0.3s_ease-out]">
                        <animate attributeName="stroke-dashoffset" values="30;0" dur="0.5s" fill="freeze" />
                        <animate attributeName="stroke-dasharray" values="30;30" dur="0.5s" fill="freeze" />
                      </path>
                    </svg>
                  </div>
                  <div class="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                </div>
              }
            </div>
          }
        </div>

      </div>
    </div>
  `
})
export class CharacterComponent implements OnDestroy {
  pose = input<CharacterPose>('idle');
  position = input<CharacterPosition>('bottom-right');
  message = input<string | null>(null);

  clicked = output<void>();

  isCompact = signal(false);
  private compactTimer: any;
  
  humanText = signal('');
  aiTextOpacity = signal(1);
  private typingInterval: any;
  private typingIndex = 0;
  private readonly humanWord = 'Human';

  constructor() {
    effect(() => {
      // Whenever input changes, react
      const currentPose = this.pose();
      const currentMessage = this.message();
      const currentPos = this.position();

      // Handle typing animation for thinking state
      if (currentPose === 'thinking') {
        this.startTypingAnimation();
      } else {
        this.stopTypingAnimation();
        if (currentPose === 'idle') {
          this.humanText.set('');
          this.aiTextOpacity.set(1);
        }
      }

      // If we are doing something active (thinking/success/message/center), expand immediately
      if (currentPose !== 'idle' || currentMessage || currentPos === 'center' || currentPos === 'hero') {
        this.expand(false); // keep expanded
      } else {
        // Otherwise, schedule auto-shrink
        this.scheduleCompact();
      }
    }, { allowSignalWrites: true });
  }

  private startTypingAnimation() {
    this.stopTypingAnimation();
    this.typingIndex = 0;
    this.humanText.set('');
    this.aiTextOpacity.set(1);
    
    const cycle = () => {
      // Fade out AI text
      setTimeout(() => {
        this.aiTextOpacity.set(0);
      }, 600);
      
      // Start typing Human after AI fades
      setTimeout(() => {
        this.typingIndex = 0;
        this.humanText.set('');
        
        this.typingInterval = setInterval(() => {
          if (this.typingIndex < this.humanWord.length) {
            this.humanText.set(this.humanWord.substring(0, this.typingIndex + 1));
            this.typingIndex++;
          } else {
            // Wait, then reset cycle
            clearInterval(this.typingInterval);
            setTimeout(() => {
              this.humanText.set('');
              this.aiTextOpacity.set(1);
              cycle(); // Restart cycle
            }, 800);
          }
        }, 120); // Type speed
      }, 800);
    };
    
    cycle();
  }

  private stopTypingAnimation() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
  }

  containerClasses = computed(() => {
    switch (this.position()) {
      case 'bottom-left': return 'fixed bottom-4 left-4 md:left-8 flex flex-col items-start slide-in-left z-50 pb-0';
      case 'center': return 'fixed bottom-0 left-1/2 flex flex-col items-center slide-in-bottom z-50 pb-0'; 
      case 'hero': return 'relative flex flex-col items-center';
      case 'bottom-right': 
      default: return 'fixed bottom-4 right-4 md:right-8 flex flex-col items-end slide-in-right z-50 pb-0';
    }
  });

  sizeClasses = computed(() => {
    const pos = this.position();
    
    // Always full size in hero or center
    if (pos === 'hero') return 'w-72 h-72 md:w-96 md:h-96';
    if (pos === 'center') return 'w-64 h-64 md:w-80 md:h-80';

    // Corner positioning logic
    if (this.isCompact()) {
      // Very small, unobtrusive size when idle
      return 'w-16 h-16 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-300';
    } else {
      // Expanded size
      return 'w-64 h-64 md:w-72 md:h-72';
    }
  });

  onMouseEnter() {
    // Expand on hover
    if (this.position() !== 'hero' && this.position() !== 'center') {
      this.expand(true); // temporary expand
    }
  }

  onMouseLeave() {
    // Resume shrinkage timer on leave
    this.scheduleCompact();
  }

  onClick() {
    this.expand(false); // Expand fully
    this.clicked.emit();
  }

  private expand(autoShrink = true) {
    this.isCompact.set(false);
    if (this.compactTimer) clearTimeout(this.compactTimer);
    
    if (autoShrink) {
      this.scheduleCompact();
    }
  }

  private scheduleCompact() {
    if (this.compactTimer) clearTimeout(this.compactTimer);

    // Only compact if corner position
    if (this.position() === 'hero' || this.position() === 'center') return;

    // Shrink after 3 seconds of inactivity
    this.compactTimer = setTimeout(() => {
      // Only shrink if still idle and no message
      if (this.pose() === 'idle' && !this.message()) {
        this.isCompact.set(true);
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.compactTimer) clearTimeout(this.compactTimer);
    this.stopTypingAnimation();
  }
}