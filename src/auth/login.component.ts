import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="h-full w-full flex items-center justify-center bg-zinc-950 p-4">
      <div class="w-full max-w-sm">
        <div class="mb-8 text-center">
          <div class="w-8 h-8 rounded-full bg-white mx-auto mb-4"></div>
          <h1 class="text-xl font-medium text-white mb-2">Welcome back</h1>
          <p class="text-zinc-500 text-sm">Enter your credentials to continue</p>
        </div>

        <form (submit)="onSubmit($event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Email address</label>
            <input 
              type="email" 
              name="email"
              [(ngModel)]="email"
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              [(ngModel)]="password"
              class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            [disabled]="loading()"
            class="w-full bg-white hover:bg-zinc-200 text-black font-medium text-sm py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
            @if (loading()) {
              Signing in...
            } @else {
              Sign in
            }
          </button>

          <div class="text-center mt-6">
             <p class="text-xs text-zinc-600">
               Demo Mode: Any email works.
             </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  
  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    this.loading.set(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = this.auth.login(this.email);
      if (success) {
        this.router.navigate(['/app']);
      }
      this.loading.set(false);
    }, 800);
  }
}
