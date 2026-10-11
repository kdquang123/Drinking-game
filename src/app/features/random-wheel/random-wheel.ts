import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { GameSessionStore } from '../../core/game/game-session.store';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';
import { Player } from '../../core/game/game.model';
import { Router } from '@angular/router';

const C = 165; // tâm
const R = 136.4; // bán kính hình tròn
const TEXT_R = 90; // khoảng cách đặt tên tính từ tâm

const point = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
};

@Component({
  imports: [Button, Icon, IconButton],
  selector: 'app-random-wheel',
  styleUrl: './random-wheel.css',
  templateUrl: './random-wheel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomWheel implements OnInit, OnDestroy {
  private readonly gameStore = inject(GameSessionStore);
  private router = inject(Router);
  PIN_COUNT = 12;
  readonly powerLevels = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly power = signal(0);
  readonly charging = signal(false);
  readonly duration = signal(4);
  readonly spinning = signal(false);
  readonly rotation = signal(0);

  private timer?: ReturnType<typeof setInterval>;
  private dir = 1;

  BOTTOM_ACTIONS = [
    {
      icon: 'users',
      label: 'Người chơi',
      action: () => {
        this.router.navigate(['/nguoi-choi']);
      },
    },
    { icon: 'adjust', label: 'Mức: vừa', action: () => {} },
    { icon: 'book', label: 'Luật chơi', action: () => {} },
  ];

  players = computed(() => this.gameStore.players());
  currentRoundPlayers = computed(() => this.gameStore.currentRoundPlayers());
  selectedPlayer = computed(() => this.gameStore.selectedPlayer());

  readonly slices = computed(() => {
    const list = this.currentRoundPlayers();
    const n = list.length;
    if (n < 2) return [];
    const step = 360 / n;

    return list.map((p, i) => {
      const mid = i * step; // tâm cung: 0° ở đỉnh, theo chiều kim đồng hồ
      const a0 = point(R, mid - step / 2);
      const a1 = point(R, mid + step / 2);
      const t = point(TEXT_R, mid);

      // Cung bên trái thì lật chữ để không bị ngược đầu
      const textRotate = mid;

      return {
        id: p.id,
        d: `M ${C} ${C} L ${a0.x} ${a0.y} A ${R} ${R} 0 0 1 ${a1.x} ${a1.y} Z`,
        slot: p.slot,
        tx: t.x,
        ty: t.y,
        textRotate,
        label: p.name.length > 9 ? p.name.slice(0, 8) + '…' : p.name,
      };
    });
  });

  statusText = computed(() => {
    const normalText = {
      title: 'AI TIẾP THEO?',
      buttonText: 'Giữ để quay',
      bottomText: 'Giữ càng lâu, chai quay càng mạnh',
    };
    const chargingText = {
      title: 'THẢ RA ĐỂ QUAY!',
      buttonText: 'Đang tích lực',
      bottomText: 'Thả tay để quay chai',
    };
    const spinningText = {
      title: 'ĐANG QUAY...',
      buttonText: 'Chờ chai dừng',
      bottomText: 'Hồi hộp chưa?',
    };
    return this.spinning() ? spinningText : this.charging() ? chargingText : normalText;
  });

  constructor() {
    // effect(() => {
    //   if (this.round()) {
    //     this.currentRoundPlayers.update((data) =>
    //       data.filter((p: Player) => p.id !== this.selectedPlayer()?.id),
    //     );
    //   }
    // });
  }

  ngOnInit(): void {
    this.gameStore.initGame();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startCharge(e?: PointerEvent) {
    if (this.spinning() || this.charging() || this.players().length < 2) return;
    // Giữ sự kiện pointer dù ngón tay trượt ra ngoài nút
    (e?.currentTarget as HTMLElement | undefined)?.setPointerCapture(e!.pointerId);

    this.gameStore.selectedPlayer.set(null);
    this.charging.set(true);
    this.power.set(1);
    this.dir = 1;

    this.timer = setInterval(() => {
      const next = this.power() + this.dir;
      if (next > 10 || next < 1) {
        this.dir = -this.dir; // chạm đỉnh hoặc đáy thì đảo chiều
        return;
      }
      this.power.set(next);
    }, 200);
  }

  releaseCharge() {
    if (!this.charging()) return;
    clearInterval(this.timer);
    this.charging.set(false);
    this.spin(this.power());
  }

  spin(power: number) {
    const turns = 2 + power * 0.6; // lực 1 → 2,6 vòng; lực 10 → 8 vòng
    this.duration.set(2 + power * 0.3); // lực 1 → 2,3s; lực 10 → 5s
    const extra = 360 * turns + Math.random() * 360;
    this.spinning.set(true);
    this.rotation.update((r) => r + extra);
  }

  onEnd(e: TransitionEvent) {
    if (e.propertyName !== 'transform') return;
    const list = this.currentRoundPlayers();
    const step = 360 / list.length;
    const angle = ((this.rotation() % 360) + 360) % 360;
    // Miệng chai hướng lên khi góc = 0, cung i có tâm tại i * step
    const index = Math.round(angle / step) % list.length;
    this.gameStore.selectedPlayer.set(list[index]);
    this.spinning.set(false);
    this.power.set(0);
  }
}
