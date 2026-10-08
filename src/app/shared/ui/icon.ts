import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'settings' | 'check' | 'chevron-left' | 'chevron-right' | 'arrow-right' | 'plus';

/** Icon outline viewBox 24, nét bo tròn, màu theo `currentColor` (design system mục 5.1). */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block shrink-0',
    'aria-hidden': 'true',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="block size-full"
      [attr.stroke-width]="strokeWidth()"
    >
      @switch (name()) {
        @case ('settings') {
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"
          />
        }
        @case ('check') {
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        }
        @case ('chevron-left') {
          <path d="M15 5l-7 7 7 7" />
        }
        @case ('chevron-right') {
          <path d="M9 5l7 7-7 7" />
        }
        @case ('arrow-right') {
          <path d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
  readonly strokeWidth = input(2.2);
}
