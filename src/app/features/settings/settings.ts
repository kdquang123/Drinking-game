import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { THEMES, THEME_META } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';
import { Icon } from '../../shared/ui/icon';
import { Segmented, SegmentedOption } from '../../shared/ui/segmented';
import { Toggle } from '../../shared/ui/toggle';
import { RouterLink } from '@angular/router';
import { STORAGE_KEYS, StorageService } from '../../core/storage/storage.service';
import { SettingService } from '../../services/setting.service';

type Level = 'light' | 'medium' | 'heavy';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Segmented, Toggle, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class Settings {
  private readonly themeService = inject(ThemeService);
  private readonly storage = inject(StorageService);
  private readonly settingService = inject(SettingService);

  STORAGE_KEYS = STORAGE_KEYS;

  protected readonly soundEffects = this.settingService.soundEffects;
  protected readonly backgroundMusic = this.settingService.backgroundMusic;
  protected readonly excludePlayed = this.settingService.excludePlayed;
  protected readonly level = signal<Level>('medium');

  protected readonly levelOptions: readonly SegmentedOption<Level>[] = [
    { value: 'light', label: 'Nhẹ' },
    { value: 'medium', label: 'Vừa' },
    { value: 'heavy', label: 'Nặng' },
  ];

  protected readonly themeSwatches = THEMES.map((key) => THEME_META[key].background);
  protected readonly themeLabel = computed(() => THEME_META[this.themeService.theme()].label);
  protected readonly questionCount = 12;

  toggleSetting(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value: boolean) {
    this.settingService.toggleSetting(key, value);
  }
}
