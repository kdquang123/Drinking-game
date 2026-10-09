import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICON_REGISTRY } from '../../core/icons/icon.registry';

/** Icon outline viewBox 24, nét bo tròn, màu theo `currentColor` (design system mục 5.1). */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex shrink-0',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  template: `
    <svg
      class="size-full"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth()"
      aria-hidden="true"
    >
      <use [attr.href]="iconUrl()" />
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input<number | string>(24);
  readonly strokeWidth = input(2.2);

  readonly viewBox = input('0 0 24 24');

  readonly iconUrl = computed(() => ICON_REGISTRY[this.name()]);
}
