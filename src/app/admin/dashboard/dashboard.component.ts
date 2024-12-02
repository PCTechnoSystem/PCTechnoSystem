import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import axios from 'axios';
import { environment } from '../../../environments/enviroment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  posts: any[] = []; // Lista de publicaciones
  users: any[] = []; // Lista de usuarios
  contactInfo: any = { phone: '', email: '', address: '' }; // Información de contacto
  username: string = 'Administrador'; // Nombre del usuario actual por defecto
  activeView: string = 'posts'; // Vista activa ('posts', 'contact', 'users')

  // Variables para la gestión de usuarios
  currentUser: any = { username: '', password: '' }; // Usuario actual para agregar/editar
  showUserForm: boolean = false; // Controlar la visualización del formulario de usuario

  imageUrl: string = environment.apiUrl;
  private postsUrl = `${environment.apiUrl}/api/posts`; // URL para posts
  private contactUrl = `${environment.apiUrl}/api/contact`; // URL para información de contacto
  private usersUrl = `${environment.apiUrl}/api/users`; // URL para usuarios

  isSidebarCollapsed: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPosts(); // Cargar publicaciones al iniciar
    this.loadContactInfo(); // Cargar información de contacto al iniciar
    this.loadUsers(); // Cargar usuarios al iniciar

    // Sincronizar el nombre de usuario desde el AuthService
    this.authService.username$.subscribe((name) => {
      this.username = name || 'Administrador';
    });
  }
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  navigateTo(view: string): void {
    this.activeView = view;
  }

  async loadContactInfo(): Promise<void> {
    try {
      const response = await axios.get(this.contactUrl);
      if (response.data.length > 0) {
        this.contactInfo = response.data[0];
      }
    } catch (error) {
      console.error('Error al cargar la información de contacto:', error);
    }
  }

  async saveContactInfo(): Promise<void> {
    try {
      if (this.contactInfo.id) {
        await axios.put(`${this.contactUrl}/${this.contactInfo.id}`, this.contactInfo);
      } else {
        await axios.post(this.contactUrl, this.contactInfo);
      }
      alert('Información de contacto guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la información de contacto:', error);
      alert('Error al guardar la información.');
    }
  }

  async loadPosts(): Promise<void> {
    try {
      const response = await axios.get(this.postsUrl);
      this.posts = response.data;
    } catch (error) {
      console.error('Error al cargar las publicaciones:', error);
    }
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await axios.get(this.usersUrl);
      this.users = response.data;
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  openUserForm(user: any = null): void {
    this.showUserForm = true;
    if (user) {
      this.currentUser = { ...user, password: '' };
    } else {
      this.currentUser = { username: '', password: '' };
    }
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.currentUser = { username: '', password: '' };
  }

  async saveUser(): Promise<void> {
    try {
      if (this.currentUser.id) {
        await axios.put(`${this.usersUrl}/${this.currentUser.id}`, this.currentUser);
        alert('Usuario actualizado correctamente.');
      } else {
        await axios.post(`${this.usersUrl}`, this.currentUser);
        alert('Usuario creado correctamente.');
      }
      this.closeUserForm();
      this.loadUsers();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      alert('Error al guardar el usuario.');
    }
  }

  editUser(user: any): void {
    this.openUserForm(user);
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const confirmDelete = confirm('¿Estás seguro de eliminar este usuario?');
      if (confirmDelete) {
        await axios.delete(`${this.usersUrl}/${id}`);
        this.users = this.users.filter((user) => user.id !== id);
        alert('Usuario eliminado correctamente.');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

    /**
   * Navegar al componente de gestión de publicaciones.
   * @param post Publicación a editar (opcional).
   */
    navigateToManagePost(post: any = null): void {
      if (post) {
        this.router.navigate(['/admin/manage-post'], { queryParams: { id: post.id } });
      } else {
        this.router.navigate(['/admin/manage-post']);
      }
    }
  
    /**
     * Confirmar y eliminar una publicación.
     * @param id ID de la publicación a eliminar.
     */
    confirmDelete(id: number): void {
      const confirmDelete = confirm('¿Estás seguro? Esta acción es irreversible.');
      if (confirmDelete) {
        this.deletePost(id);
      }
    }
    /**
 * Eliminar publicación en el backend.
 * @param id ID de la publicación a eliminar.
 */
async deletePost(id: number): Promise<void> {
  try {
    await axios.delete(`${this.postsUrl}/${id}`);
    this.posts = this.posts.filter((post) => post.id !== id); // Actualizar lista local
    alert('Publicación eliminada correctamente.');
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    alert('Error al eliminar la publicación.');
  }
}

}
