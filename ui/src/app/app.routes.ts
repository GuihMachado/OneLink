import { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { ClientPageComponent } from './pages/client-page/client-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'renata-martho'
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./pages/admin-login/admin-login.page').then((module) => module.AdminLoginPage)
    },
    {
        path: 'admin/clients',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('./pages/admin-clients/admin-clients.page').then((module) => module.AdminClientsPage)
    },
    {
        path: 'admin/clients/new',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('./pages/admin-client-form/admin-client-form.page').then((module) => module.AdminClientFormPage)
    },
    {
        path: 'admin/appearance',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('./pages/admin-appearance/admin-appearance.page').then((module) => module.AdminAppearancePage)
    },
    {
        path: 'admin/clients/:id',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('./pages/admin-client-form/admin-client-form.page').then((module) => module.AdminClientFormPage)
    },
    {
        path: ':clientSlug',
        component: ClientPageComponent
    },
    {
        path: '**',
        redirectTo: 'renata-martho'
    }
];
