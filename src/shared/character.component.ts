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
        
        <!-- Inline SVG Avatar -->
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-full relative z-10 animate-float drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">
          <defs>
             <linearGradient id="gradBody" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" style="stop-color:#27272a;stop-opacity:1" /> <!-- zinc-800 -->
               <stop offset="100%" style="stop-color:#09090b;stop-opacity:1" /> <!-- zinc-950 -->
             </linearGradient>
             <linearGradient id="gradVisor" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" style="stop-color:#312e81;stop-opacity:1" />
               <stop offset="50%" style="stop-color:#4338ca;stop-opacity:1" />
               <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
             </linearGradient>
          </defs>

          <!-- Outer Ring (Rotating) -->
          <g transform-origin="200 200" class="animate-[spin_12s_linear_infinite] opacity-40">
             <circle cx="200" cy="200" r="140" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="10 30" />
             <circle cx="200" cy="200" r="130" fill="none" stroke="#818cf8" stroke-width="2" stroke-dasharray="60 200" />
          </g>

          <!-- Inner Ring (Counter-Rotating) -->
          <g transform-origin="200 200" class="animate-[spin_6s_linear_infinite_reverse] opacity-60">
             <path d="M 200 80 A 120 120 0 0 1 200 320" fill="none" stroke="#6366f1" stroke-width="1.5" />
          </g>

          <!-- Main Head Group -->
          <g transform="translate(100, 100)">
             <!-- Antenna -->
             <path d="M100 20 L100 50" stroke="#52525b" stroke-width="4" />
             <circle cx="100" cy="20" r="4" fill="#ef4444" class="animate-pulse">
                @if(pose() === 'success') { <set attributeName="fill" to="#10b981" /> }
             </circle>

             <!-- Head Shape -->
             <path d="M50 160 L150 160 L160 140 L160 80 L130 50 L70 50 L40 80 L40 140 Z" fill="url(#gradBody)" stroke="#3f3f46" stroke-width="2" />
             
             <!-- Visor Area (The "Eyes") -->
             <g transform="translate(50, 80)">
                <path d="M0 20 L10 50 L90 50 L100 20 L90 0 L10 0 Z" fill="url(#gradVisor)" stroke="#4f46e5" stroke-width="1" />
                
                <!-- IDLE STATE: Blue pulsing eyes -->
                @if (pose() === 'idle') {
                  <rect x="25" y="20" width="15" height="8" rx="2" fill="#818cf8" class="animate-pulse" />
                  <rect x="60" y="20" width="15" height="8" rx="2" fill="#818cf8" class="animate-pulse" />
                }
                
                <!-- THINKING STATE: Writing animation - transformation from AI to Human -->
                @if (pose() === 'thinking') {
                   <!-- Background for text area -->
                   <rect x="10" y="15" width="80" height="30" rx="3" fill="#1e1b4b" opacity="0.5" />
                   
                   <!-- AI text (robotic, fading out) -->
                   <text x="50" y="28" text-anchor="middle" font-size="9" fill="#71717a" font-family="monospace" opacity="0.4">
                     <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                     <tspan x="50" dy="0">AI</tspan>
                   </text>
                   
                   <!-- Transformation arrow -->
                   <path d="M 50 32 L 50 38" stroke="#818cf8" stroke-width="1.5" fill="none" opacity="0.6">
                     <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
                   </path>
                   <path d="M 45 36 L 50 38 L 55 36" stroke="#818cf8" stroke-width="1.5" fill="none" opacity="0.6">
                     <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
                   </path>
                   
                   <!-- Human text (H letter being written) -->
                   <g transform="translate(50, 42)">
                     <!-- H letter being drawn with writing animation -->
                     <!-- Left vertical line -->
                     <path d="M -8 0 L -8 -10" 
                           stroke="#818cf8" 
                           stroke-width="2.5" 
                           fill="none" 
                           stroke-linecap="round"
                           stroke-dasharray="12"
                           opacity="0.9">
                       <animate attributeName="stroke-dashoffset" values="12;0" dur="0.7s" repeatCount="indefinite" />
                     </path>
                     
                     <!-- Horizontal line -->
                     <path d="M -8 -5 L 0 -5" 
                           stroke="#818cf8" 
                           stroke-width="2.5" 
                           fill="none" 
                           stroke-linecap="round"
                           stroke-dasharray="10"
                           opacity="0.9">
                       <animate attributeName="stroke-dashoffset" values="10;0" dur="0.5s" begin="0.35s" repeatCount="indefinite" />
                     </path>
                     
                     <!-- Right vertical line -->
                     <path d="M 0 0 L 0 -10" 
                           stroke="#818cf8" 
                           stroke-width="2.5" 
                           fill="none" 
                           stroke-linecap="round"
                           stroke-dasharray="12"
                           opacity="0.9">
                       <animate attributeName="stroke-dashoffset" values="12;0" dur="0.7s" begin="0.5s" repeatCount="indefinite" />
                     </path>
                     
                     <!-- Pen/cursor dot following the writing path -->
                     <circle cx="-8" cy="0" r="2.5" fill="#fbbf24" opacity="0.9">
                       <animate attributeName="cy" values="0;-10;-10;-5;-5;0;0;-10" dur="2s" repeatCount="indefinite" />
                       <animate attributeName="cx" values="-8;-8;-8;-8;0;0;0;0" dur="2s" repeatCount="indefinite" />
                       <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
                     </circle>
                   </g>
                   
                   <!-- Subtle glow effect -->
                   <ellipse cx="50" cy="42" rx="15" ry="8" fill="#818cf8" opacity="0.1">
                     <animate attributeName="opacity" values="0.05;0.15;0.05" dur="2s" repeatCount="indefinite" />
                   </ellipse>
                }
                
                <!-- SUCCESS STATE: Green check/smile -->
                @if (pose() === 'success') {
                   <path d="M 30 25 L 45 35 L 70 15" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                }
             </g>

             <!-- Mouth/Speaker Grill -->
             <g transform="translate(75, 140)" class="opacity-50">
                <rect x="0" y="0" width="50" height="2" fill="#52525b" />
                <rect x="5" y="5" width="40" height="2" fill="#52525b" />
                <rect x="10" y="10" width="30" height="2" fill="#52525b" />
             </g>
          </g>
        </svg>

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

  constructor() {
    effect(() => {
      // Whenever input changes, react
      const currentPose = this.pose();
      const currentMessage = this.message();
      const currentPos = this.position();

      // If we are doing something active (thinking/success/message/center), expand immediately
      if (currentPose !== 'idle' || currentMessage || currentPos === 'center' || currentPos === 'hero') {
        this.expand(false); // keep expanded
      } else {
        // Otherwise, schedule auto-shrink
        this.scheduleCompact();
      }
    }, { allowSignalWrites: true });
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
  }
}