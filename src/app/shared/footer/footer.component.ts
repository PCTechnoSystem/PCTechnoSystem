import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/enviroment';
import axios from 'axios';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  contactInfo: any = null;

  ngOnInit(): void {
    this.loadContactInfo();
  }

  async loadContactInfo() {
    try {
      const response = await axios.get(`${environment.apiUrl}/api/contact`);
      this.contactInfo = response.data[0];
    } catch (error) {
      console.error('Error al cargar la información de contacto:', error);
    }
  }
  
}
