import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { PixPage } from './pages/pix/pix.page';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'pix',
        component: PixPage
    }
];
