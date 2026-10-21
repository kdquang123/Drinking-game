import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS, StorageService } from '../storage/storage.service';
import { DEFAULT_THEME, THEME_META, ThemeKey, isThemeKey } from './theme.model';

const SWITCH_TRANSITION_MS = 350;

/**
 * Theme của toàn app. Ghi `data-theme` lên <html>; mọi màu là CSS variable nên
 * component không cần biết theme hiện tại.
 *
 * Muốn xem trước một theme trong phạm vi nhỏ, gắn `[attr.data-theme]` lên khung đó.
 * Muốn xem trước cả màn (màn Chọn giao diện) thì dùng `preview()`: chỉ đổi màu, không lưu.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private switchTimer?: ReturnType<typeof setTimeout>;

  private readonly current = signal<ThemeKey>(
    this.storage.read(STORAGE_KEYS.theme, isThemeKey) ?? DEFAULT_THEME,
  );
  private readonly previewing = signal<ThemeKey | null>(null);
  readonly theme = this.current.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.previewing() ?? this.current();
      this.document.documentElement.dataset['theme'] = theme;
      this.document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', THEME_META[theme].background);
    });
    effect(() => this.storage.write(STORAGE_KEYS.theme, this.current()));
  }

  set(theme: ThemeKey): void {
    this.previewing.set(null);
    if (theme === this.current()) return;
    this.animateSwitch();
    this.current.set(theme);
  }

  /** Xem trước một theme mà không lưu. Truyền `null` để bỏ xem trước, quay về theme đang dùng. */
  preview(theme: ThemeKey | null): void {
    if ((theme ?? this.current()) !== (this.previewing() ?? this.current())) this.animateSwitch();
    this.previewing.set(theme);
  }

  private animateSwitch(): void {
    const root = this.document.documentElement;
    root.classList.add('theme-switching');
    clearTimeout(this.switchTimer);
    this.switchTimer = setTimeout(
      () => root.classList.remove('theme-switching'),
      SWITCH_TRANSITION_MS,
    );
  }
}
