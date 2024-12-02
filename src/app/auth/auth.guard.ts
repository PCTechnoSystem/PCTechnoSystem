import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verifica si hay token
    if (!token) {
      this.router.navigate(['/admin/login']); // Redirige al login si no está autenticado
      return false;
    }
    return true;
  }
}
