import { Routes } from '@angular/router';
import { Home } from './features/home/home';

const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  { path: '', component: Home, title: 'Chén Vào, Chuyện Ra' },
  {
    path: 'cai-dat',
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
    title: 'Cài đặt',
  },
  // Các màn dưới đây đang là trang tạm, thay loadComponent khi làm.
  { path: 'nguoi-choi', loadComponent: placeholder, data: { title: 'Người chơi' }, title: 'Người chơi' },
  { path: 'quay-chai', loadComponent: placeholder, data: { title: 'Quay chai' }, title: 'Quay chai' },
  { path: 'lat-the', loadComponent: placeholder, data: { title: 'Lật thẻ' }, title: 'Lật thẻ' },
  { path: '**', redirectTo: '' },
];
