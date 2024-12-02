import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/enviroment';
import { Location } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-manage-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.css'],
})
export class ManagePostComponent implements OnInit {
  post: any = { title: '', description: '', price: 0, type: '', subtype: '', image: null, author_id: '' };
  subtypes: string[] = [];
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  private imageUrl: string = `${environment.apiUrl}`
  private postsUrl: string = `${environment.apiUrl}/api/posts`;
  private usersUrl: string = `${environment.apiUrl}/api/users`; // URL para obtener usuarios
  users: any[] = []; // Lista de usuarios disponibles

  constructor(private route: ActivatedRoute, private router: Router, private location:Location) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.queryParams['id'];
    if (postId) {
      this.isEditMode = true;
      this.loadPost(postId);
    }
    this.loadUsers(); // Cargar lista de usuarios al inicializar
  }


  goBack(): void {
    this.location.back(); // Navega a la página anterior
  }
  async loadPost(id: string): Promise<void> {
    try {
      const response = await axios.get(`${this.postsUrl}/${id}`);
      this.post = response.data;
      this.updateSubtypes();
    } catch (error) {
      console.error('Error al cargar el post:', error);
      alert('No se pudo cargar el post para editar.');
    }
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await axios.get(this.usersUrl);
      this.users = response.data; // Asume que el backend devuelve una lista de usuarios
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      alert('No se pudieron cargar los usuarios.');
    }
  }

  updateSubtypes(): void {
    if (this.post.type === 'product') {
      this.subtypes = ['Cámaras', 'Routers', 'Módems', 'Sensores'];
    } else if (this.post.type === 'service') {
      this.subtypes = [
        'Instalación de redes',
        'Configuración de IPs',
        'Mantenimiento de equipos de seguridad',
        'Instalación de cámaras',
        'Instalación de brazos robóticos',
      ];
    } else {
      this.subtypes = [];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async savePost(): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('title', this.post.title);
      formData.append('description', this.post.description);
      formData.append('price', this.post.price.toString());
      formData.append('type', this.post.type);
      formData.append('subtype', this.post.subtype);
      formData.append('author_id', this.post.author_id); // Agregar author_id
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.isEditMode) {
        await axios.put(`${this.postsUrl}/${this.post.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Post actualizado exitosamente.');
      } else {
        await axios.post(this.postsUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Post creado exitosamente.');
      }

      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error('Error al guardar el post:', error);
      alert('Hubo un error al guardar el post.');
    }
  }
}
