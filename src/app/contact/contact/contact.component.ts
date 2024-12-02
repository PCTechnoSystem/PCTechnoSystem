import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/enviroment';
import axios from 'axios';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    message: '',
  };

  async sendEmail() {
    try {
      // Envía los datos del formulario al backend
      await axios.post(`${environment.apiUrl}/api/contact/send-email`, this.form);

      // Mostrar mensaje de éxito
      alert('Correo enviado correctamente.');

      // Limpia el formulario después de enviarlo
      this.form = { name: '', email: '', message: '' };
    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar el correo:', error);

      // Mostrar mensaje de error
      alert('Hubo un error al enviar el correo. Intente nuevamente.');
    }
  }
}
