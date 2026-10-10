import { Component, input } from '@angular/core';
import { Icon } from '../../shared/ui/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconButton } from '../../shared/ui/icon-button';
import { Segmented } from '../../shared/ui/segmented';

@Component({
  imports: [Icon, RouterOutlet, IconButton, Segmented, RouterLink],
  selector: 'app-play-layout',
  styleUrl: './play-layout.css',
  templateUrl: './play-layout.html',
})
export class PlayLayout {
  readonly title = input.required<string>();
  readonly mode = input<string>('random-wheel');

  currentMode = 'random-wheel';

  PLAY_MODE = [
    {
      value: 'random-wheel',
      label: 'Quay chai',
    },
    {
      value: 'card-flip',
      label: 'Lật thẻ',
    },
  ];

  onChangeMode(value: string) {}
}
