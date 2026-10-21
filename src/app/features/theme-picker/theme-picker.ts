import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { THEMES, THEME_META, ThemeKey } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-theme-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon],
  templateUrl: './theme-picker.html',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class ThemePicker implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly themes = THEMES.map((key) => ({ key, ...THEME_META[key] }));
  protected readonly selected = signal<ThemeKey>(this.themeService.theme());
  protected readonly selectedLabel = computed(() => THEME_META[this.selected()].label);

  select(theme: ThemeKey) {
    this.selected.set(theme);
    this.themeService.preview(theme);
  }

  apply() {
    this.themeService.set(this.selected());
    this.router.navigate(['/cai-dat']);
  }

  ngOnDestroy(): void {
    this.themeService.preview(null);
  }
}
