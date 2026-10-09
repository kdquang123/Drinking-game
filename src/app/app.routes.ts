import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { SettingLayout } from './layouts/setting-layout/setting-layout';

const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  { path: '', component: Home, title: 'Chén Vào, Chuyện Ra' },
  {
    path: 'cai-dat',
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
    title: 'Cài đặt',
  },
  {
    path: 'nguoi-choi',
    component: SettingLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/add-player/add-player').then((m) => m.AddPlayer),
      },
    ],
    data: { title: 'Người chơi' },
    title: 'Người chơi',
  },
  {
    path: 'quay-chai',
    loadComponent: placeholder,
    data: { title: 'Quay chai' },
    title: 'Quay chai',
  },
  { path: 'lat-the', loadComponent: placeholder, data: { title: 'Lật thẻ' }, title: 'Lật thẻ' },
  { path: '**', redirectTo: '' },
];
