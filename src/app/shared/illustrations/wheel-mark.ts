import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Minh hoạ chế độ Quay chai: vòng quay 4 lát + chai ở tâm. */
@Component({
  selector: 'app-wheel-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 100 100" class="block size-full">
      <circle cx="50" cy="50" r="46" class="fill-bg stroke-ink" stroke-width="3" />
      <g class="stroke-ink" stroke-width="2.5" stroke-linejoin="round">
        <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" class="fill-truth" />
        <path d="M50 50 L90 50 A40 40 0 0 1 50 90 Z" class="fill-drink" />
        <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" class="fill-ok" />
        <path d="M50 50 L10 50 A40 40 0 0 1 50 10 Z" class="fill-dare" />
      </g>
      <g transform="rotate(35 50 50)">
        <path
          d="M47 24 h6 v9 c0 3 5 5 5 10 v20 q0 4 -4 4 h-8 q-4 0 -4 -4 v-20 c0 -5 5 -7 5 -10 z"
          class="fill-bottle-glass stroke-ink"
          stroke-width="2.5"
          stroke-linejoin="round"
        />
        <rect x="46.5" y="20" width="7" height="5" rx="1.5" class="fill-bottle-cork stroke-ink" stroke-width="2" />
      </g>
    </svg>
  `,
})
export class WheelMark {}
