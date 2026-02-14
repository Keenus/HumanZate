import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroComponent } from './ui/hero.component';
import { FeaturesComponent } from './ui/features.component';
import { HowItWorksComponent } from './ui/how-it-works.component';
import { PricingComponent } from './ui/pricing.component';
import { FooterComponent } from './ui/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    FeaturesComponent,
    HowItWorksComponent,
    PricingComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      
      <!-- Navigation -->
      <nav class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/">
            <!-- Logo Icon -->
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
               <span class="font-serif text-black font-bold text-lg italic">H</span>
            </div>
            <span class="font-medium text-sm tracking-tight text-zinc-100">HumanZate</span>
          </div>
          <div class="flex items-center gap-6">
            <a routerLink="/auth" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</a>
            <a routerLink="/auth" class="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">Get Started</a>
          </div>
        </div>
      </nav>

      <main>
        <!-- Hero Section (Immediate Load) -->
        <app-hero />

        <!-- Lazy Loaded Sections -->
        @defer (on viewport) {
          <app-features />
        } @placeholder {
          <div class="h-96 w-full bg-zinc-950 flex items-center justify-center">
             <div class="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-zinc-500 animate-spin"></div>
          </div>
        }

        @defer (on viewport) {
          <app-how-it-works />
        } @placeholder {
          <div class="h-96 w-full bg-zinc-950"></div>
        }

        @defer (on viewport) {
          <app-pricing />
        } @placeholder {
          <div class="h-96 w-full bg-zinc-950"></div>
        }
      </main>

      <app-footer />
    </div>
  `
})
export class LandingComponent {}