// ============================================================
// ARIDHU — Admin Auth Guard
// Placeholder — allows all access for now.
// When ready: check JWT token in localStorage/session
// ============================================================

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // TODO: Replace with real JWT check:
    // const token = localStorage.getItem('aridhu_admin_token');
    // if (!token || isTokenExpired(token)) {
    //   this.router.navigate(['/admin/login']);
    //   return false;
    // }
    // return true;

    // For now, always allow access to admin
    return true;
  }
}
