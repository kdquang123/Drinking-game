import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS, StorageService } from '../storage/storage.service';
import { DEFAULT_THEME, THEME_META, ThemeKey, isThemeKey } from './theme.model';

const SWITCH_TRANSITION_MS = 350;

/**
 * Theme của toàn app. Ghi `data-theme` lên <html>; mọi màu là CSS variable nên
 * component không cần biết theme hiện tại.
 *
 * Muốn xem trước một theme trong phạm vi nhỏ (màn Chọn giao diện), chỉ cần gắn
 * `[attr.data-theme]="previewTheme()"` lên khung của màn đó, không gọi service này.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private switchTimer?: ReturnType<typeof setTimeout>;

  private readonly current = signal<ThemeKey>(
    this.storage.read(STORAGE_KEYS.theme, isThemeKey) ?? DEFAULT_THEME,
  );
  readonly theme = this.current.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.current();
      this.document.documentElement.dataset['theme'] = theme;
      this.document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', THEME_META[theme].background);
      this.storage.write(STORAGE_KEYS.theme, theme);
    });
  }

  set(theme: ThemeKey): void {
    if (theme === this.current()) return;
    this.animateSwitch();
    this.current.set(theme);
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
