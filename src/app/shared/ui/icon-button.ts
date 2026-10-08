import { Directive } from '@angular/core';

/**
 * Nút icon 48×48 (mục 6.3). Dùng cho <button> hoặc <a>, bắt buộc có aria-label.
 * Disabled: opacity .45. Với <a> dùng aria-disabled="true".
 */
@Directive({
  selector: 'button[appIconButton], a[appIconButton]',
  host: {
    class:
      'inline-flex size-12 shrink-0 items-center justify-center rounded-m bg-surface text-text transition-opacity ' +
      'disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45',
  },
})
export class IconButton {}
