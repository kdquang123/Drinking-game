import { Component, computed, inject, input } from '@angular/core';
import { Icon } from '../../shared/ui/icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconButton } from '../../shared/ui/icon-button';
import { Segmented } from '../../shared/ui/segmented';
import { GameSessionStore } from '../../core/game/game-session.store';

@Component({
  imports: [Icon, RouterOutlet, IconButton, Segmented, RouterLink],
  selector: 'app-play-layout',
  styleUrl: './play-layout.css',
  templateUrl: './play-layout.html',
})
export class PlayLayout {
  private readonly router = inject(Router);
  private readonly gameSession = inject(GameSessionStore);

  readonly title = input.required<string>();
  readonly mode = input<string>('random-wheel');

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

  selectedPlayer = computed(() => this.gameSession.selectedPlayer());

  onChangeMode(value: string) {
    if (value === 'random-wheel') {
      this.router.navigate(['/quay-chai']);

      return;
    }
    if (value === 'card-flip') {
      this.router.navigate(['/lat-the']);
      return;
    }
    this.router.navigate(['/']);
  }
}
