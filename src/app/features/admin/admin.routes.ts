import { Routes } from '@angular/router';
import { AdminResources } from './admin-resources/admin-resources';
import { AdminResourceNew } from './admin-resource-new/admin-resource-new';
import { AdminResourceEdit } from './admin-resource-edit/admin-resource-edit';
import { AdminUsers } from './admin-users/admin-users';
import { AdminUserEdit } from './admin-user-edit/admin-user-edit';
import { AdminReservations } from './admin-reservations/admin-reservations';

export const ADMIN_ROUTES: Routes = [
  { path: 'resources', component: AdminResources },
  { path: 'resources/new', component: AdminResourceNew },
  { path: 'resources/:id/edit', component: AdminResourceEdit },
  { path: 'reservations', component: AdminReservations },
  { path: 'users', component: AdminUsers },
  { path: 'users/:id/edit', component: AdminUserEdit },
  { path: '', redirectTo: 'resources', pathMatch: 'full' },
];