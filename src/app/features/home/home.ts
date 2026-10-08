import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSessionStore } from '../../core/game/game-session.store';
import { LEVELS, Level } from '../../core/game/game.model';
import { Logo } from '../../shared/illustrations/logo';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';
import { Segmented, SegmentedOption } from '../../shared/ui/segmented';
import { ModePicker } from './mode-picker';
import { PlayersSummary } from './players-summary';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon, IconButton, Button, Segmented, ModePicker, PlayersSummary],
  templateUrl: './home.html',
})
export class Home {
  protected readonly session = inject(GameSessionStore);

  protected readonly levelOptions: readonly SegmentedOption<Level>[] = LEVELS.map(
    ({ value, label }) => ({ value, label }),
  );

  /**
   * Quay chai cần ≥ 2 người nên chưa đủ thì đưa sang màn Nhập tên.
   * Lật thẻ không gắn với người chơi (design system 9.4) nên vào thẳng.
   */
  protected readonly startLink = computed(() => {
    if (this.session.mode() === 'lat-the') return '/lat-the';
    return this.session.hasEnoughPlayers() ? '/quay-chai' : '/nguoi-choi';
  });
}
