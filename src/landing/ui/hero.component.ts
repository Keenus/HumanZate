import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden">
      
      <!-- Elegant Background -->
      <div class="absolute inset-0 w-full h-full bg-black">
        <!-- Subtle noise texture overlay if possible, otherwise clean gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-black"></div>
        <!-- Very subtle spotlight -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div class="container max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 animate-fade-in">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
          <span class="text-xs font-medium text-zinc-300 tracking-wide uppercase">Linguistic Engine v2.0</span>
        </div>

        <!-- Headline: Serif Font for "Human" feel -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 tracking-tight leading-[1.1] animate-fade-in delay-100">
          <span class="italic text-zinc-400">Restoring</span> the <br />
          <span class="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400">Human Touch.</span>
        </h1>

        <!-- Subtext -->
        <p class="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed font-light animate-fade-in delay-200">
          AI writes code. Humans write stories. 
          We translate robotic output into language that breathes, connects, and feels authentic.
        </p>

        <!-- Buttons: Apple Style -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in delay-300">
          <a routerLink="/auth" class="min-w-[180px] px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_-15px_rgba(255,255,255,0.3)]">
            Start Writing
          </a>
          
          <a routerLink="/auth" class="min-w-[180px] px-8 py-4 bg-zinc-900/50 text-white border border-white/10 font-medium rounded-full hover:bg-zinc-800 transition-colors backdrop-blur-md">
            See the Difference
          </a>
        </div>

        <!-- Editorial visual element instead of 3D character -->
        <div class="mt-24 relative max-w-3xl mx-auto animate-fade-in delay-500">
           <div class="absolute -inset-1 bg-gradient-to-b from-white/20 to-transparent opacity-20 blur-xl rounded-2xl"></div>
           <div class="relative bg-[#1c1c1e] border border-white/10 rounded-2xl p-8 md:p-12 text-left shadow-2xl">
              <div class="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                 <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                 <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
                 <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
                 <span class="ml-auto text-xs text-zinc-600 font-mono">input.txt</span>
              </div>
              <div class="font-serif text-xl md:text-2xl text-zinc-300 leading-relaxed opacity-90">
                 "It is imperative to leverage synergistic strategies..." 
                 <span class="text-zinc-600 mx-2">→</span> 
                 <span class="text-white italic">"We need to work better together."</span>
              </div>
           </div>
        </div>

      </div>
    </section>
  `
})
export class HeroComponent {}