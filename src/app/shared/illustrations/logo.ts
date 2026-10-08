import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Logo "Chén Vào, Chuyện Ra": bong bóng chat + cốc bia. Màu lấy từ token nên tự đổi theo theme. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg viewBox="0 0 100 100" class="block size-full" role="img" aria-label="Logo Chén Vào, Chuyện Ra">
      <path
        d="M44 8 h38 a12 12 0 0 1 12 12 v16 a12 12 0 0 1 -12 12 h-20 l-13 11 l2 -11 h-7 a12 12 0 0 1 -12 -12 v-16 a12 12 0 0 1 12 -12 z"
        class="fill-dare stroke-ink"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <circle cx="52" cy="28" r="3.6" class="fill-ink" />
      <circle cx="63" cy="28" r="3.6" class="fill-ink" />
      <circle cx="74" cy="28" r="3.6" class="fill-ink" />
      <g transform="rotate(-18 34 70)">
        <path
          d="M10 56 h48 l-6 26 q-1.5 7 -8.5 7 h-19 q-7 0 -8.5 -7 z"
          class="fill-card stroke-ink"
          stroke-width="4"
          stroke-linejoin="round"
        />
        <ellipse cx="34" cy="56" rx="24" ry="6" class="fill-drink stroke-ink" stroke-width="4" />
        <rect x="18" y="66" width="4" height="12" rx="2" class="fill-highlight" opacity="0.7" />
      </g>
      <path
        d="M50 52 q4 5 0 8 q-4 -3 0 -8 z"
        class="fill-drink stroke-ink"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class Logo {}
