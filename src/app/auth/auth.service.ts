import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSource = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  private usernameSource = new BehaviorSubject<string | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).username : null
  );
  username$ = this.usernameSource.asObservable();

  /**
   * Actualiza el estado de inicio de sesión.
   * @param isLoggedIn Estado de inicio de sesión.
   * @param username (Opcional) Nombre de usuario.
   */
  setLoginStatus(isLoggedIn: boolean, username?: string): void {
    this.isLoggedInSource.next(isLoggedIn);
    if (isLoggedIn && username) {
      localStorage.setItem('user', JSON.stringify({ username }));
      this.usernameSource.next(username);
    } else {
      this.usernameSource.next(null);
    }
  }

  /**
   * Cierra sesión y limpia el estado.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setLoginStatus(false);
  }
}
