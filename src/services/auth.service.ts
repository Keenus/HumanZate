import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simple token simulation
  private token = signal<string | null>(localStorage.getItem('auth_token'));
  
  isAuthenticated = computed(() => !!this.token());

  currentUser = signal<User | null>(null);

  constructor() {
    if (this.token()) {
      // Simulate restoring user session
      this.currentUser.set({
        id: '1',
        email: 'user@example.com',
        name: 'Demo User'
      });
    }
  }

  login(email: string): boolean {
    // MVP: Accept any valid looking email
    if (!email.includes('@')) return false;
    
    const mockToken = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));
    localStorage.setItem('auth_token', mockToken);
    this.token.set(mockToken);
    this.currentUser.set({
      id: '1',
      email,
      name: email.split('@')[0]
    });
    return true;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.token.set(null);
    this.currentUser.set(null);
  }
}
