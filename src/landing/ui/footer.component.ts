import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-black border-t border-zinc-900 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-3">
            <!-- Logo Icon -->
            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 flex items-center justify-center shadow-lg">
               <span class="font-serif text-black font-bold text-xs italic">H</span>
            </div>
            <span class="font-medium text-sm text-zinc-400">HumanZate</span>
          </div>
          
          <div class="flex gap-8 text-sm text-zinc-500">
            <a href="#" class="hover:text-white transition-colors">Privacy</a>
            <a href="#" class="hover:text-white transition-colors">Terms</a>
            <a href="#" class="hover:text-white transition-colors">Twitter</a>
          </div>
          
          <div class="text-sm text-zinc-600">
            © 2024 HumanZate AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}