import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid',         route: '/admin/dashboard' },
    { label: 'Products',  icon: 'package',       route: '/admin/products' },
    { label: 'Orders',    icon: 'shopping-bag',  route: '/admin/orders',   badge: 2 },
    { label: 'Combos',    icon: 'layers',        route: '/admin/combos' },
    { label: 'Categories',icon: 'tag',           route: '/admin/categories' },
    { label: 'Settings',  icon: 'settings',      route: '/admin/settings' },
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  goToStore(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    // TODO: Clear JWT token and redirect
    // localStorage.removeItem('aridhu_admin_token');
    this.router.navigate(['/admin/login']);
  }
}
