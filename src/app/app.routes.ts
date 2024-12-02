import { Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CatalogComponent } from './catalog/catalog/catalog.component';
import { ContactComponent } from './contact/contact/contact.component';
import { ManagePostComponent } from './admin/manage-post/manage-post.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Ruta inicial redirige al catálogo
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },

  // Rutas del Administrador
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/manage-post', component: ManagePostComponent, canActivate: [AuthGuard] },

  // Rutas del Visitante
  { path: 'catalog', component: CatalogComponent },
  { path: 'contact', component: ContactComponent },

  // Ruta para manejar páginas no encontradas (404)
  { path: '**', redirectTo: 'catalog' },
];
