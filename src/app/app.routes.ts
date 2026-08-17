import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ResourceList } from './features/resources/resource-list/resource-list';
import { ResourceDetail } from './features/resources/resource-detail/resource-detail';
import { MyReservations } from './features/reservations/my-reservations/my-reservations';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'resources', component: ResourceList },
  { path: 'resources/:id', component: ResourceDetail },
  { path: 'reservations/my', component: MyReservations, canActivate: [authGuard] },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '', redirectTo: 'resources', pathMatch: 'full' },
  { path: '**', redirectTo: 'resources' },
];