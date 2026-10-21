import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { STORAGE_KEYS, StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private readonly storage = inject(StorageService);
  readonly soundEffects = signal(
    this.storage.read(STORAGE_KEYS.soundEffects, (v): v is boolean => typeof v === 'boolean') ??
      true,
  );
  readonly backgroundMusic = signal(
    this.storage.read(STORAGE_KEYS.backgroundMusic, (v): v is boolean => typeof v === 'boolean') ??
      false,
  );
  readonly excludePlayed = signal(
    this.storage.read(STORAGE_KEYS.excludePlayed, (v): v is boolean => typeof v === 'boolean') ??
      false,
  );

  toggleSetting(key: (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value: boolean) {
    switch (key) {
      case STORAGE_KEYS.soundEffects:
        this.storage.write(STORAGE_KEYS.soundEffects, value);
        break;
      case STORAGE_KEYS.backgroundMusic:
        this.storage.write(STORAGE_KEYS.backgroundMusic, value);
        break;
      case STORAGE_KEYS.excludePlayed:
        this.storage.write(STORAGE_KEYS.excludePlayed, value);
        break;
    }
  }
}
