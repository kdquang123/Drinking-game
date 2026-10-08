import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  model,
  viewChildren,
} from '@angular/core';
import { PlayMode } from '../../core/game/game.model';
import { CardsMark } from '../../shared/illustrations/cards-mark';
import { WheelMark } from '../../shared/illustrations/wheel-mark';
import { Icon } from '../../shared/ui/icon';

interface ModeOption {
  value: PlayMode;
  title: string;
  description: string;
}

const MODE_OPTIONS: readonly ModeOption[] = [
  { value: 'quay-chai', title: 'Quay chai', description: 'Giữ, thả, chai chỉ ai người đó chơi' },
  { value: 'lat-the', title: 'Lật thẻ', description: 'Chạm lật thẻ, ra gì làm nấy' },
];

/** 2 thẻ chọn cách chơi ở Trang chủ. Radiogroup: Tab vào thẻ đang chọn, phím mũi tên để đổi. */
@Component({
  selector: 'app-mode-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, WheelMark, CardsMark],
  host: {
    role: 'radiogroup',
    class: 'grid grid-cols-2 gap-3',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @for (option of options; track option.value) {
      <button
        #radio
        type="button"
        role="radio"
        class="relative flex h-[172px] flex-col items-start rounded-[20px] bg-surface p-3 text-left text-text"
        [class.ring-selected]="option.value === value()"
        [attr.aria-checked]="option.value === value()"
        [tabIndex]="option.value === value() ? 0 : -1"
        (click)="value.set(option.value)"
      >
        @if (option.value === value()) {
          <span
            class="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-primary text-on-primary"
          >
            <app-icon name="check" [size]="14" [strokeWidth]="3.6" />
          </span>
        }
        @if (option.value === 'quay-chai') {
          <app-wheel-mark class="size-[76px]" />
        } @else {
          <app-cards-mark class="size-[76px]" />
        }
        <span class="type-title mt-1">{{ option.title }}</span>
        <span class="type-caption mt-1.5 text-muted">{{ option.description }}</span>
      </button>
    }
  `,
})
export class ModePicker {
  readonly value = model.required<PlayMode>();

  protected readonly options = MODE_OPTIONS;
  private readonly radios = viewChildren<ElementRef<HTMLButtonElement>>('radio');

  protected onKeydown(event: KeyboardEvent): void {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();

    const current = this.options.findIndex((o) => o.value === this.value());
    const next = (current + step + this.options.length) % this.options.length;
    this.value.set(this.options[next].value);
    this.radios()[next]?.nativeElement.focus();
  }
}
