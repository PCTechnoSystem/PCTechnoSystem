import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { FooterComponent } from '../../shared/footer/footer.component';
import { environment } from '../../../environments/enviroment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  posts: any[] = []; // Lista completa de publicaciones
  filteredPosts: any[] = []; // Lista filtrada
  searchQuery: string = ''; // Texto de búsqueda
  filterType: string = ''; // Filtro por tipo (producto o servicio)
  filterCategory: string = ''; // Filtro por subtipo
  categories: string[] = []; // Lista de categorías para mostrar según el tipo
  selectedPost: any = null;

  imageUrl: string = environment.apiUrl;
  private apiUrl = `${environment.apiUrl}/api/posts` ; // URL del backend

  constructor() {}

  ngOnInit(): void {
    this.loadPosts();
  }

  openModal(post: any): void {
    this.selectedPost = post;
  }

  closeModal(): void {
    this.selectedPost = null;
  }

  async loadPosts(): Promise<void> {
    try {
      console.log(`Esta es la variable de entorno: ${this.apiUrl}`);
      const response = await axios.get(this.apiUrl);
      this.posts = response.data;
      this.filteredPosts = [...this.posts]; // Inicializa con todos los posts
    } catch (error) {
      console.error('Error al cargar los posts:', error);
    }
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredPosts = this.posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query);
      const matchesType = this.filterType ? post.type === this.filterType : true;
      const matchesCategory = this.filterCategory ? post.subtype === this.filterCategory : true;

      return matchesSearch && matchesType && matchesCategory;
    });

    // Actualizar las categorías dinámicamente según el tipo seleccionado
    this.updateCategories();
  }

  updateCategories(): void {
    if (this.filterType === 'product') {
      this.categories = ['Cámaras', 'Routers', 'Módems', 'Sensores'];
    } else if (this.filterType === 'service') {
      this.categories = [
        'Instalación de redes',
        'Configuración de IPs',
        'Mantenimiento de equipos de seguridad',
        'Instalación de cámaras',
        'Instalación de brazos robóticos',
      ];
    } else {
      this.categories = [];
    }
  }
}
