import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <button
      type="button"
      class="flex h-11 w-13 items-center"
      [attr.aria-label]="label()"
      [attr.aria-pressed]="checked()"
      (click)="checked.set(!checked())"
    >
      <span
        class="flex h-7.5 w-full rounded-pill p-0.75 transition-colors"
        [class]="checked() ? 'bg-toggle-on' : 'bg-toggle-off'"
      >
        <span
          class="size-6 rounded-pill bg-highlight shadow-sm transition-transform"
          [style.translate]="checked() ? '22px 0' : '0 0'"
        ></span>
      </span>
    </button>
  `,
})
export class Toggle {
  readonly label = input.required<string>();
  readonly checked = model(false);
}
