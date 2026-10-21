import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/ui/toast';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Toast],
  template: `
    <div class="app-frame">
      <router-outlet />
      <app-toast />
    </div>
  `,
})
export class App {
  constructor() {
    // Khởi tạo sớm để nhạc nền và listener mở khoá âm thanh chạy trên mọi màn
    inject(AudioService);
  }
}
