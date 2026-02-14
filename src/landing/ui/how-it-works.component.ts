import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-up-fade {
      animation: slideUpFade 0.4s cubic-bezier(0.2, 0.0, 0.2, 1) forwards;
    }
    @keyframes loadingBar {
      0% { width: 0%; margin-left: 0; }
      50% { width: 50%; margin-left: 25%; }
      100% { width: 100%; margin-left: 0; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `],
  template: `
    <section class="py-24 bg-zinc-925 relative overflow-hidden border-y border-zinc-900">
      <!-- Background Grid/Pattern for texture -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <!-- Left: Text Content & Steps -->
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">See it in action.</h2>
            <p class="text-zinc-400 text-lg mb-10 leading-relaxed">
              Watch how HumanZate takes raw, messy input and transforms it into gold.
            </p>

            <div class="space-y-4">
              
              <!-- Step 1 -->
              <div 
                (click)="setStep(0)"
                class="group flex gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent"
                [class.bg-zinc-900]="activeStep() === 0"
                [class.border-zinc-800]="activeStep() === 0"
                [class.shadow-lg]="activeStep() === 0">
                <div class="relative flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-bold transition-all duration-500"
                     [class.bg-indigo-500]="activeStep() === 0" 
                     [class.border-indigo-500]="activeStep() === 0" 
                     [class.text-white]="activeStep() === 0" 
                     [class.text-zinc-500]="activeStep() !== 0"
                     [class.scale-110]="activeStep() === 0">
                  @if(activeStep() === 0) {
                    <div class="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
                  }
                  1
                </div>
                <div>
                  <h3 class="font-medium mb-1 transition-colors" [class.text-white]="activeStep() === 0" [class.text-zinc-300]="activeStep() !== 0">Paste Raw Input</h3>
                  <p class="text-sm transition-colors duration-300" [class.text-zinc-400]="activeStep() === 0" [class.text-zinc-500]="activeStep() !== 0">
                    Paste text from ChatGPT, a messy client brief, or your own draft.
                  </p>
                </div>
              </div>

              <!-- Step 2 -->
              <div 
                (click)="setStep(1)"
                class="group flex gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent"
                [class.bg-zinc-900]="activeStep() === 1"
                [class.border-zinc-800]="activeStep() === 1"
                [class.shadow-lg]="activeStep() === 1">
                <div class="relative flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-bold transition-all duration-500"
                     [class.bg-indigo-500]="activeStep() === 1" 
                     [class.border-indigo-500]="activeStep() === 1" 
                     [class.text-white]="activeStep() === 1" 
                     [class.text-zinc-500]="activeStep() !== 1"
                     [class.scale-110]="activeStep() === 1">
                   @if(activeStep() === 1) {
                    <div class="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
                  }
                  2
                </div>
                <div>
                  <h3 class="font-medium mb-1 transition-colors" [class.text-white]="activeStep() === 1" [class.text-zinc-300]="activeStep() !== 1">Select Tool</h3>
                  <p class="text-sm transition-colors duration-300" [class.text-zinc-400]="activeStep() === 1" [class.text-zinc-500]="activeStep() !== 1">
                    Choose Humanize, Product Improver, or Offer Generator.
                  </p>
                </div>
              </div>

              <!-- Step 3 -->
              <div 
                (click)="setStep(2)"
                class="group flex gap-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent"
                [class.bg-zinc-900]="activeStep() === 2"
                [class.border-zinc-800]="activeStep() === 2"
                [class.shadow-lg]="activeStep() === 2">
                <div class="relative flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-bold transition-all duration-500"
                     [class.bg-indigo-500]="activeStep() === 2" 
                     [class.border-indigo-500]="activeStep() === 2" 
                     [class.text-white]="activeStep() === 2" 
                     [class.text-zinc-500]="activeStep() !== 2"
                     [class.scale-110]="activeStep() === 2">
                  @if(activeStep() === 2) {
                    <div class="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></div>
                  }
                  3
                </div>
                <div>
                  <h3 class="font-medium mb-1 transition-colors" [class.text-white]="activeStep() === 2" [class.text-zinc-300]="activeStep() !== 2">Get Polished Result</h3>
                  <p class="text-sm transition-colors duration-300" [class.text-zinc-400]="activeStep() === 2" [class.text-zinc-500]="activeStep() !== 2">
                    Receive text that connects, persuades, and converts.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <!-- Right: Interactive Window -->
          <div class="relative group perspective-1000">
            <!-- Glow Effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
            
            <div class="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-h-[420px] flex flex-col transform transition-transform duration-500 hover:scale-[1.01]">
              <!-- Window Header -->
              <div class="h-10 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 flex items-center px-4 gap-2">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500/20 hover:bg-amber-500/40 transition-colors"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors"></div>
                </div>
                <div class="ml-auto flex items-center gap-2">
                   <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <div class="text-xs text-zinc-500 font-mono">humanzate-core v2.1</div>
                </div>
              </div>

              <!-- Window Content -->
              <div class="p-6 flex-1 flex flex-col font-mono text-sm relative bg-[#09090b]">
                
                @if (activeStep() === 0) {
                  <div class="animate-slide-up-fade absolute inset-6">
                    <div class="flex items-center gap-2 text-zinc-500 mb-4 text-xs uppercase tracking-widest font-semibold">
                       <span>Input Source</span>
                       <div class="h-px bg-zinc-800 flex-1"></div>
                    </div>
                    <div class="text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mb-4 leading-relaxed">
                      "It is important to note that our comprehensive solution offers a wide array of benefits. In today's fast-paced world, optimizing workflow is key to success."
                    </div>
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 text-zinc-400 rounded-md text-xs border border-zinc-700/50">
                      <span class="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
                      Waiting for user action...
                    </div>
                  </div>
                }

                @if (activeStep() === 1) {
                  <div class="animate-slide-up-fade absolute inset-6">
                     <div class="flex items-center gap-2 text-indigo-400 mb-4 text-xs uppercase tracking-widest font-semibold">
                       <span>System Processing</span>
                       <div class="h-px bg-indigo-500/20 flex-1"></div>
                    </div>
                     
                     <!-- Terminal-like activity -->
                     <div class="space-y-2 mb-6 font-mono text-xs">
                        <div class="text-zinc-500">> Analyzing semantic structure... <span class="text-green-500">OK</span></div>
                        <div class="text-zinc-500">> Detecting corporate jargon... <span class="text-amber-500">FOUND (4)</span></div>
                        <div class="text-zinc-500">> Loading 'Casual Professional' persona... <span class="text-green-500">LOADED</span></div>
                     </div>

                     <div class="relative pt-2">
                       <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                         <div class="h-full bg-indigo-500 w-2/3 animate-[loadingBar_1.5s_ease-in-out_infinite] rounded-full relative overflow-hidden">
                           <div class="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]"></div>
                         </div>
                       </div>
                       <div class="flex justify-between mt-2 text-xs text-zinc-500">
                         <span>Optimizing flow...</span>
                         <span>78%</span>
                       </div>
                     </div>
                  </div>
                }

                @if (activeStep() === 2) {
                  <div class="animate-slide-up-fade absolute inset-6">
                    <div class="flex items-center gap-2 text-emerald-500 mb-4 text-xs uppercase tracking-widest font-semibold">
                       <span>Final Output</span>
                       <div class="h-px bg-emerald-500/20 flex-1"></div>
                    </div>
                    
                    <div class="text-zinc-100 leading-relaxed p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 relative group/text">
                      <div class="absolute top-2 right-2 opacity-0 group-hover/text:opacity-100 transition-opacity">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      "Our tool handles the heavy lifting so you don't have to. You'll save hours every week and finally get your workflow under control."
                    </div>

                    <div class="mt-auto pt-6 flex items-center gap-3">
                      <button class="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">Copy Text</button>
                      <button class="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs hover:bg-zinc-700 transition-colors border border-zinc-700">Try Again</button>
                    </div>
                  </div>
                }

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {
  activeStep = signal(0);

  setStep(index: number) {
    this.activeStep.set(index);
  }
}