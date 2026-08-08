import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ResourceList } from './features/resources/resource-list/resource-list';
import { ResourceDetail } from './features/resources/resource-detail/resource-detail';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'resources', component: ResourceList, canActivate: [authGuard] },
  { path: 'resources/:id', component: ResourceDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'resources', pathMatch: 'full' },
];