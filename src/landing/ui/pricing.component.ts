import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-24 bg-zinc-950 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p class="text-zinc-400">Start for free, upgrade when you scale.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <!-- Free Tier -->
          <div class="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col">
            <h3 class="text-lg font-medium text-white mb-2">Starter</h3>
            <div class="text-4xl font-bold text-white mb-6">$0</div>
            <p class="text-zinc-400 text-sm mb-8">Perfect for testing the waters.</p>
            <ul class="space-y-4 mb-8 flex-1">
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> 5 rewrites per day
              </li>
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> Basic Humanizer
              </li>
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> Standard speed
              </li>
            </ul>
            <a routerLink="/auth" class="w-full py-3 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors text-center">Get Started</a>
          </div>

          <!-- Pro Tier (Highlighted) -->
          <div class="p-8 rounded-2xl bg-zinc-900 border border-indigo-500/50 relative flex flex-col shadow-2xl shadow-indigo-500/10">
            <div class="absolute top-0 right-0 -mt-3 mr-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Popular</div>
            <h3 class="text-lg font-medium text-white mb-2">Pro</h3>
            <div class="text-4xl font-bold text-white mb-6">$19<span class="text-lg font-normal text-zinc-500">/mo</span></div>
            <p class="text-zinc-400 text-sm mb-8">For serious freelancers & agencies.</p>
            <ul class="space-y-4 mb-8 flex-1">
              <li class="flex items-center gap-3 text-sm text-white">
                <span class="text-indigo-400">✓</span> Unlimited rewrites
              </li>
              <li class="flex items-center gap-3 text-sm text-white">
                <span class="text-indigo-400">✓</span> Access all tools (Offers, Product)
              </li>
              <li class="flex items-center gap-3 text-sm text-white">
                <span class="text-indigo-400">✓</span> Priority support
              </li>
            </ul>
            <a routerLink="/auth" class="w-full py-3 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors text-center">Start Pro Trial</a>
          </div>

          <!-- Enterprise Tier -->
          <div class="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col">
            <h3 class="text-lg font-medium text-white mb-2">Team</h3>
            <div class="text-4xl font-bold text-white mb-6">$49<span class="text-lg font-normal text-zinc-500">/mo</span></div>
            <p class="text-zinc-400 text-sm mb-8">Collaborative features for teams.</p>
            <ul class="space-y-4 mb-8 flex-1">
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> Everything in Pro
              </li>
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> 5 Team seats
              </li>
              <li class="flex items-center gap-3 text-sm text-zinc-300">
                <span class="text-zinc-600">✓</span> Shared workspace
              </li>
            </ul>
            <a routerLink="/auth" class="w-full py-3 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors text-center">Contact Sales</a>
          </div>

        </div>
      </div>
    </section>
  `
})
export class PricingComponent {}