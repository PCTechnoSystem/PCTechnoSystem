import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = '';

  menuActive: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Escuchar los cambios en el estado de inicio de sesión
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // Escuchar los cambios en el nombre de usuario
    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }
  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }
  /**
   * Cerrar sesión y redirigir al catálogo.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }
}
