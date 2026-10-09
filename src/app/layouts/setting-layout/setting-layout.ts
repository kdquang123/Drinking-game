import { Component, input } from '@angular/core';
import { Icon } from '../../shared/ui/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconButton } from '../../shared/ui/icon-button';

@Component({
  imports: [Icon, RouterOutlet, RouterLink, IconButton],
  selector: 'app-setting-layout',
  styleUrl: './setting-layout.css',
  templateUrl: './setting-layout.html',
})
export class SettingLayout {
  readonly title = input.required<string>();
}
