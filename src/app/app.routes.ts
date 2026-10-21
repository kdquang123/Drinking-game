import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { SettingLayout } from './layouts/setting-layout/setting-layout';
import { PlayLayout } from './layouts/play-layout/play-layout';
import { hasPlayersGuard } from './core/game/players.guard';

const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);

export const routes: Routes = [
  { path: '', component: Home, title: 'Chén Vào, Chuyện Ra' },
  {
    path: 'cai-dat/giao-dien',
    component: SettingLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/theme-picker/theme-picker').then((m) => m.ThemePicker),
      },
    ],
    data: { title: 'Giao diện', back: '/cai-dat' },
    title: 'Giao diện',
  },
  {
    path: 'cai-dat',
    component: SettingLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
    ],
    data: { title: 'Cài đặt' },
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
    component: PlayLayout,
    canActivate: [hasPlayersGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/random-wheel/random-wheel').then((m) => m.RandomWheel),
      },
    ],
    data: { title: 'Quay chai', mode: 'random-wheel' },
    title: 'Quay chai',
  },
  {
    path: 'lat-the',
    component: PlayLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/card-flip/card-flip').then((m) => m.CardFlip),
      },
    ],
    data: { title: 'Lật thẻ', mode: 'card-flip' },
    title: 'Lật thẻ',
  },
  { path: '**', redirectTo: '' },
];
