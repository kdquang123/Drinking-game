import { DOCUMENT, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { LofiMusic } from './lofi-music';
import { SettingService } from './setting.service';

export const SFX = {
  tick: 'assets/audio/ding.mp3',
  winner: 'assets/audio/winner.mp3',
  cardFlip: 'assets/audio/card-flip.mp3',
} as const;

export type SfxName = keyof typeof SFX;

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly settings = inject(SettingService);
  private readonly document = inject(DOCUMENT);

  private ctx?: AudioContext;
  private music?: LofiMusic;
  private readonly buffers = new Map<SfxName, AudioBuffer>();
  private readonly unlocked = signal(false);
  private readonly visible = signal(!this.document.hidden);

  constructor() {
    // Nhạc chạy khi: setting bật, đã có thao tác của người dùng, app đang hiện
    effect(() => {
      const want = this.settings.backgroundMusic() && this.unlocked() && this.visible();
      untracked(() => (want ? this.music?.start() : this.music?.stop()));
    });

    // Capture để chạy trước handler của component (VD: tiếng lật thẻ ở lần chạm đầu).
    // Trên cảm ứng, pointerup mới được tính là thao tác của người dùng nên nghe cả hai.
    for (const type of ['pointerdown', 'pointerup', 'keydown']) {
      this.document.addEventListener(type, () => this.unlock(), { capture: true });
    }

    // Rời app (chuyển tab, tắt màn hình) thì dừng nhạc, quay lại thì phát tiếp.
    this.document.addEventListener('visibilitychange', () =>
      this.visible.set(!this.document.hidden),
    );

    void this.preloadSfx();
  }

  /** Phát SFX đã tải sẵn. Tắt "Âm thanh hiệu ứng", chưa tải xong hoặc chưa mở khoá thì bỏ qua. */
  playSfx(name: SfxName, volume = 0.8): void {
    if (!this.settings.soundEffects()) return;
    const buffer = this.buffers.get(name);
    if (!this.ctx || !buffer) return;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(this.ctx.destination);
    source.start();
  }

  private unlock(): void {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.music = new LofiMusic(this.ctx);
    }
    // iOS chuyển sang 'interrupted' sau cuộc gọi, không chỉ 'suspended'
    if (this.ctx.state !== 'running') void this.ctx.resume().catch(() => {});
    this.unlocked.set(true);
  }

  /**
   * Giải mã bằng OfflineAudioContext để không phải tạo AudioContext trước khi người dùng
   * thao tác (Chrome sẽ cảnh báo). AudioBuffer dùng được cho mọi context.
   */
  private async preloadSfx(): Promise<void> {
    const decoder = new OfflineAudioContext(1, 1, 44100);
    await Promise.all(
      (Object.keys(SFX) as SfxName[]).map(async (name) => {
        try {
          const data = await (await fetch(SFX[name])).arrayBuffer();
          this.buffers.set(name, await decoder.decodeAudioData(data));
        } catch (error) {
          console.error(`Không thể tải SFX "${name}":`, error);
        }
      }),
    );
  }
}
