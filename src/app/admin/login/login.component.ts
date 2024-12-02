import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/enviroment';
import { AuthService } from '../../auth/auth.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false; // Indicador de carga

  constructor(private router: Router, private authService: AuthService) {} // Inyecta AuthService

  async onSubmit() {
    this.isLoading = true; // Activar indicador de carga

    try {
      const response = await axios.post(`${environment.apiUrl}/api/auth/login`, {
        username: this.username,
        password: this.password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({ username: response.data.username }));
      this.authService.setLoginStatus(true, response.data.username);


        this.router.navigate(['/admin/dashboard']);
      } else {
        alert('Error: Token no recibido. Intenta nuevamente.');
      }
    } catch (error: any) {
      console.error('Error en el inicio de sesión:', error);

      if (error.response && error.response.status === 401) {
        alert('Usuario o contraseña incorrectos.');
      } else {
        alert('Error al conectarse al servidor.');
      }
    } finally {
      this.isLoading = false; // Desactivar indicador de carga
    }
  }
}
