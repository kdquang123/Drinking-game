import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface SegmentedOption<T> {
  value: T;
  label: string;
}

/**
 * Segmented control (mục 6.11). Item đang chọn dùng `primary-strong` vì chữ chỉ 13px.
 * Gắn aria-labelledby hoặc aria-label lên <app-segmented>.
 */
@Component({
  selector: 'app-segmented',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    class: 'flex gap-0.5 rounded-[12px] bg-bg p-[3px]',
  },
  template: `
    @for (option of options(); track option.value) {
      <button
        type="button"
        class="type-control h-[34px] rounded-[9px] px-3.5 transition-colors"
        [class]="
          option.value === value() ? 'bg-primary-strong text-on-primary-strong' : 'text-muted'
        "
        [attr.aria-pressed]="option.value === value()"
        (click)="value.set(option.value)"
      >
        {{ option.label }}
      </button>
    }
  `,
})
export class Segmented<T> {
  readonly options = input.required<readonly SegmentedOption<T>[]>();
  readonly value = model.required<T>();
}
