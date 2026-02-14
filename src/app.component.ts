import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="flex flex-col min-h-screen bg-black">
      
      <!-- Apple-style Glassmorphism Header -->
      <header class="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/">
            <!-- Logo Icon -->
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
               <span class="font-serif text-black font-bold text-lg italic">H</span>
            </div>
            <span class="font-medium text-sm tracking-tight text-zinc-100">HumanZate</span>
          </div>
          
          <div class="flex items-center gap-4">
            @if (auth.isAuthenticated()) {
              <a routerLink="/app" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</a>
              <button 
                (click)="logout()" 
                class="px-4 py-1.5 rounded-full bg-zinc-800/50 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-all">
                Sign out
              </button>
            } @else {
               <a routerLink="/auth" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</a>
            }
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <!-- Removed overflow-hidden to allow page scrolling -->
      <main class="flex-1 w-full">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}