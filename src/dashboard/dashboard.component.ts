import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RateLimitService } from '../services/rate-limit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-full w-full bg-zinc-950 overflow-y-auto p-6 md:p-12">
      <div class="max-w-5xl mx-auto">
        
        <!-- Welcome Section -->
        <div class="mb-12">
          <h1 class="text-3xl font-semibold text-white mb-3">Welcome to HumanZate</h1>
          <p class="text-zinc-400 text-lg max-w-2xl mb-6">
            Select a tool below to enhance your communication, generate content, or refine your professional presence.
          </p>
          
          <!-- Usage Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Daily Limit</span>
                <span class="text-xs font-mono" [class.text-zinc-400]="rateLimit.remainingDaily() > 0" [class.text-yellow-400]="rateLimit.remainingDaily() <= 3 && rateLimit.remainingDaily() > 0" [class.text-red-400]="rateLimit.remainingDaily() === 0">
                  {{ rateLimit.remainingDaily() }}/{{ rateLimit.getStats().daily.limit }}
                </span>
              </div>
              <div class="w-full bg-zinc-800 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full transition-all" [style.width.%]="(rateLimit.remainingDaily() / rateLimit.getStats().daily.limit) * 100"></div>
              </div>
            </div>
            
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Weekly Limit</span>
                <span class="text-xs font-mono text-zinc-400">
                  {{ rateLimit.remainingWeekly() }}/{{ rateLimit.getStats().weekly.limit }}
                </span>
              </div>
              <div class="w-full bg-zinc-800 rounded-full h-2">
                <div class="bg-emerald-500 h-2 rounded-full transition-all" [style.width.%]="(rateLimit.remainingWeekly() / rateLimit.getStats().weekly.limit) * 100"></div>
              </div>
            </div>
            
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-zinc-500 uppercase tracking-wide">Monthly Limit</span>
                <span class="text-xs font-mono text-zinc-400">
                  {{ rateLimit.remainingMonthly() }}/{{ rateLimit.getStats().monthly.limit }}
                </span>
              </div>
              <div class="w-full bg-zinc-800 rounded-full h-2">
                <div class="bg-amber-500 h-2 rounded-full transition-all" [style.width.%]="(rateLimit.remainingMonthly() / rateLimit.getStats().monthly.limit) * 100"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Card 1: Humanize -->
          <a routerLink="/app/tool/humanize" class="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Humanize Text</h3>
            <p class="text-sm text-zinc-500 leading-relaxed">Rewrites AI-generated content to sound natural, human, and undetectable.</p>
          </a>

          <!-- Card 2: Improve Product -->
          <a routerLink="/app/tool/product" class="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="m12 9 5 9H7l5-9Z"/></svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Product Polisher</h3>
            <p class="text-sm text-zinc-500 leading-relaxed">Transform boring specs into persuasive, benefit-driven product descriptions.</p>
          </a>

          <!-- Card 3: Offer Creator -->
          <a routerLink="/app/tool/offer" class="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-100 mb-2">Offer Generator</h3>
            <p class="text-sm text-zinc-500 leading-relaxed">Turn client briefs into professional, structured business proposals instantly.</p>
          </a>

           <!-- Card 4: Emails (Disabled) -->
          <div class="group block bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 opacity-60 cursor-not-allowed relative overflow-hidden">
            <div class="absolute top-3 right-3 bg-zinc-800 text-zinc-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Coming Soon</div>
            <div class="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center mb-4 grayscale">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 class="text-lg font-medium text-zinc-500 mb-2">Business Email</h3>
            <p class="text-sm text-zinc-600 leading-relaxed">Draft professional cold outreach or follow-up emails in seconds.</p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  rateLimit = inject(RateLimitService);
}