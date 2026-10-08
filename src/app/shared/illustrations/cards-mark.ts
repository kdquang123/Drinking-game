import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Minh hoạ chế độ Lật thẻ: thẻ úp phía sau + thẻ mở phía trước. */
@Component({
  selector: 'app-cards-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 100 100" class="block size-full">
      <rect
        x="20" y="14" width="48" height="68" rx="8"
        transform="rotate(-12 44 48)"
        class="fill-back stroke-ink"
        stroke-width="3"
      />
      <g transform="rotate(8 60 52)">
        <rect x="36" y="18" width="48" height="68" rx="8" class="fill-card stroke-ink" stroke-width="3" />
        <rect x="42" y="25" width="36" height="22" rx="4" class="fill-dare" />
        <rect x="44" y="53" width="32" height="5" rx="2.5" class="fill-ink" opacity="0.7" />
        <rect x="48" y="62" width="24" height="5" rx="2.5" class="fill-ink" opacity="0.7" />
        <rect x="44" y="72" width="32" height="8" rx="3" class="fill-drink" />
      </g>
    </svg>
  `,
})
export class CardsMark {}
