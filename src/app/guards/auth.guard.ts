import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // const logged = localStorage.getItem('isLoggedIn') === 'true';
    const logged = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!logged) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
