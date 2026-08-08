import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ResourceList } from './features/resources/resource-list/resource-list';
import { ResourceDetail } from './features/resources/resource-detail/resource-detail';
import { MyReservations } from './features/reservations/my-reservations/my-reservations';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'resources', component: ResourceList },
  { path: 'resources/:id', component: ResourceDetail },
  { path: 'reservations/my', component: MyReservations, canActivate: [authGuard] },
  { path: '', redirectTo: 'resources', pathMatch: 'full' },
];