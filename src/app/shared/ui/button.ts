import { Directive, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'truth' | 'dare' | 'drink' | 'ok';

// Viết đầy đủ tên class để Tailwind quét được.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary',
  truth: 'bg-truth text-on-truth',
  dare: 'bg-dare text-on-dare',
  drink: 'bg-drink text-on-drink',
  ok: 'bg-ok text-on-ok',
};

const BASE_CLASSES =
  'inline-flex h-16 w-full select-none items-center justify-center gap-2.5 rounded-l px-6 ' +
  'type-button-l uppercase lip active:pressed ' +
  'disabled:pointer-events-none disabled:bg-off disabled:text-off-text disabled:shadow-none ' +
  'aria-disabled:pointer-events-none aria-disabled:bg-off aria-disabled:text-off-text aria-disabled:shadow-none';

/** Nút chính (mục 6.1): nền theo ngữ nghĩa, có "môi", nhấn thì lún xuống. */
@Directive({
  selector: 'button[appButton], a[appButton]',
  host: { '[class]': 'classes()' },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  protected readonly classes = computed(() => `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]}`);
}
