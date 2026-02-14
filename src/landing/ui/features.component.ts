import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <!-- Partners Strip -->
    <div class="w-full border-y border-zinc-900 bg-zinc-950/50 py-10 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
         <!-- Simple Text Logos for MVP -->
         <span class="text-xl font-bold text-zinc-500">ACME Corp</span>
         <span class="text-xl font-bold text-zinc-500">Stripe</span>
         <span class="text-xl font-bold text-zinc-500">Vercel</span>
         <span class="text-xl font-bold text-zinc-500">Linear</span>
         <span class="text-xl font-bold text-zinc-500">Raycast</span>
      </div>
    </div>

    <!-- Benefits Grid -->
    <section class="py-24 bg-zinc-950">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">Why rewrite your content?</h2>
          <p class="text-zinc-400">Stop sounding like a bot. Start connecting with humans.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Benefit 1 -->
          <div class="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div class="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Undetectable Quality</h3>
            <p class="text-zinc-400 leading-relaxed">
              Our advanced prompts strip away the "AI accent" from your text, making it pass as 100% human-written content.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 text-emerald-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Tone Perfect</h3>
            <p class="text-zinc-400 leading-relaxed">
              Whether you need a casual email or a strict legal proposal, our specialized agents adapt the voice instantly.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div class="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 text-amber-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p class="text-zinc-400 leading-relaxed">
              Paste your raw thoughts or AI draft, and get a polished, ready-to-send version in under 2 seconds.
            </p>
          </div>

        </div>
      </div>
    </section>
  `
})
export class FeaturesComponent {}