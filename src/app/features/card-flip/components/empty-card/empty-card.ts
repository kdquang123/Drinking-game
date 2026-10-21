import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardKind, Level, LEVELS } from '../../../../core/game/game.model';

/** Thẻ "Hết câu hỏi" (màn 2C): chỉ hiển thị, các nút hành động do màn cha tự đặt. */
@Component({
  selector: 'app-empty-card',
  styleUrl: './empty-card.css',
  templateUrl: './empty-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCard {
  /** Không truyền = bộ bài trộn (Lật thẻ): hiện "Hết thẻ" thay vì "Hết câu Thật/Thách". */
  readonly kind = input<CardKind>();
  readonly level = input.required<Level>();
  /** Tổng số câu của loại + mức này trong ván. */
  readonly total = input(0);
  readonly playerName = input<string>();

  heading = computed(() => {
    const kind = this.kind();
    if (kind === CardKind.TRUTH) return 'Hết câu Thật';
    if (kind === CardKind.DARE) return 'Hết câu Thách';
    if (kind === CardKind.DRINK) return 'Hết câu Phạt uống';
    return 'Hết thẻ';
  });

  unit = computed(() => (this.kind() ? 'câu' : 'thẻ'));

  levelText = computed(() => LEVELS.find((l) => l.value === this.level())?.label ?? '');
}
