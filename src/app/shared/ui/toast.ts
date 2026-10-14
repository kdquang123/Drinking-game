import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Icon } from './icon';

/** Vào 200ms + giữ 1.5s + ra 200ms (design system mục 7). */
const TOAST_DURATION_MS = 1900;

export interface ToastMessage {
  id: number;
  message: string;
  icon: string;
}

/** Toast nhỏ trượt từ trên xuống rồi tự ẩn. Mỗi lần chỉ hiện một toast, toast mới thay toast cũ. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toast = signal<ToastMessage | null>(null);
  readonly current = this.toast.asReadonly();
  private nextId = 0;
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string, icon = 'check'): void {
    clearTimeout(this.timer);
    this.toast.set({ id: ++this.nextId, message, icon });
    this.timer = setTimeout(() => this.toast.set(null), TOAST_DURATION_MS);
  }

  /** Dùng cho các nút chưa làm. */
  comingSoon(): void {
    this.show('Tính năng đang phát triển', 'settings');
  }
}

/** Đặt một lần ở App, hiển thị toast từ ToastService. */
@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { role: 'status', 'aria-live': 'polite' },
  template: `
    <!-- Lặp theo id để toast mới luôn tạo lại phần tử, chạy lại animation -->
    @for (t of toasts(); track t.id) {
      <div class="toast bg-ok text-on-ok type-action font-bold">
        <app-icon [name]="t.icon" [size]="20" [strokeWidth]="2.6" />
        <span>{{ t.message }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      top: calc(var(--page-top, 16px) + 8px);
      left: 50%;
      z-index: 50;
      transform: translateX(-50%);
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 999px;
      white-space: nowrap;
      animation: toast-in-out 1.9s ease both;
    }
    @keyframes toast-in-out {
      0% {
        opacity: 0;
        transform: translateY(-120%);
      }
      10.5%,
      89.5% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-120%);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation-name: toast-fade;
      }
      @keyframes toast-fade {
        0%,
        100% {
          opacity: 0;
        }
        10.5%,
        89.5% {
          opacity: 1;
        }
      }
    }
  `,
})
export class Toast {
  private readonly service = inject(ToastService);
  protected readonly toasts = computed(() => {
    const t = this.service.current();
    return t ? [t] : [];
  });
}
