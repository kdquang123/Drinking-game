import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MIN_PLAYERS, Player } from '../../core/game/game.model';
import { Avatar } from '../../shared/ui/avatar';
import { Icon } from '../../shared/ui/icon';

const MAX_VISIBLE_AVATARS = 4;

/** Dòng tóm tắt người chơi ở Trang chủ, bấm vào để sang màn Nhập tên. */
@Component({
  selector: 'app-players-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Avatar, Icon],
  host: { class: 'block' },
  template: `
    <a
      routerLink="/nguoi-choi"
      class="flex h-15 items-center gap-2.5 rounded-l bg-surface pr-3.5 pl-2.5 text-text"
    >
      <span class="flex shrink-0 items-center">
        @for (player of visible(); track player.id) {
          <app-avatar
            class="-ml-3 border-2 border-surface first:ml-0"
            [name]="player.name"
            [slot]="player.slot"
            [size]="34"
          />
        } @empty {
          <span class="flex size-[34px] items-center justify-center rounded-full bg-off text-off-text">
            <app-icon name="plus" [size]="18" [strokeWidth]="2.6" />
          </span>
        }
        @if (hiddenCount() > 0) {
          <span
            class="type-avatar -ml-3 flex size-[34px] items-center justify-center rounded-full border-2 border-surface bg-off text-off-text"
          >
            +{{ hiddenCount() }}
          </span>
        }
      </span>

      <span class="flex min-w-0 flex-col">
        <span class="type-body-m">{{ title() }}</span>
        <span class="type-caption truncate text-muted">{{ subtitle() }}</span>
      </span>

      <span class="type-action ml-auto shrink-0 text-muted">{{ players().length ? 'Sửa' : 'Thêm' }}</span>
      <app-icon class="ml-0.5 text-muted" name="chevron-right" [size]="18" [strokeWidth]="2.6" />
    </a>
  `,
})
export class PlayersSummary {
  readonly players = input.required<readonly Player[]>();

  protected readonly visible = computed(() => this.players().slice(0, MAX_VISIBLE_AVATARS));
  protected readonly hiddenCount = computed(() => this.players().length - this.visible().length);

  protected readonly title = computed(() => {
    const count = this.players().length;
    return count ? `${count} người chơi` : 'Chưa có người chơi';
  });

  protected readonly subtitle = computed(() => {
    const players = this.players();
    const missing = MIN_PLAYERS - players.length;
    if (players.length === 0) return `Cần ít nhất ${MIN_PLAYERS} người để quay chai`;
    if (missing > 0) return `Cần thêm ${missing} người nữa`;
    return players.map((p) => p.name).join(', ');
  });
}
