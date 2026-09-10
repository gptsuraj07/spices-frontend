import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  template: `
    <app-header></app-header>
    <main class="main-content" id="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-toast-container></app-toast-container>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 72px);
    }
  `]
})
export class MainLayoutComponent {}
