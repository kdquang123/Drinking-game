import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { THEMES, THEME_META, ThemeKey } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';
import { Segmented, SegmentedOption } from '../../shared/ui/segmented';
import { Placeholder } from '../placeholder/placeholder';

/** TẠM: chỉ có nút đổi theme để kiểm tra 3 theme. Thay bằng màn Cài đặt (5A) thật. */
@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Placeholder, Segmented],
  template: `
    <app-placeholder title="Cài đặt">
      <p id="theme-label" class="type-label mt-8 px-1 text-muted uppercase">Giao diện (tạm)</p>
      <app-segmented
        class="mt-2 self-start"
        aria-labelledby="theme-label"
        [options]="themeOptions"
        [value]="themeService.theme()"
        (valueChange)="themeService.set($event)"
      />
    </app-placeholder>
  `,
})
export class Settings {
  protected readonly themeService = inject(ThemeService);
  protected readonly themeOptions: readonly SegmentedOption<ThemeKey>[] = THEMES.map((value) => ({
    value,
    label: THEME_META[value].label,
  }));
}
