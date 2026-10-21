import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { GameSessionStore } from '../../core/game/game-session.store';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';
import { ToastService } from '../../shared/ui/toast';
import { Router } from '@angular/router';
import { CardKind, Level, LEVELS, Question } from '../../core/game/game.model';
import { buildDeck } from '../../data/mock-data';
import { Card } from '../card-flip/components/card/card';
import { EmptyCard } from '../card-flip/components/empty-card/empty-card';
import { AudioService } from '../../services/audio.service';

const C = 165; // tâm
const R = 136.4; // bán kính hình tròn
const TEXT_R = 90; // khoảng cách đặt tên tính từ tâm

const TICK_MIN_GAP = 40; // ms giữa 2 tiếng, tránh rè khi chai quay quá nhanh

const point = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
};

@Component({
  imports: [Button, Icon, IconButton, Card, EmptyCard],
  selector: 'app-random-wheel',
  styleUrl: './random-wheel.css',
  templateUrl: './random-wheel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomWheel implements OnInit, OnDestroy {
  private readonly gameStore = inject(GameSessionStore);
  private router = inject(Router);
  private readonly audioService = inject(AudioService);
  private readonly toast = inject(ToastService);
  PIN_COUNT = 12;
  readonly powerLevels = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly power = signal(0);
  readonly charging = signal(false);
  readonly duration = signal(4);
  readonly spinning = signal(false);
  readonly rotation = signal(0);
  readonly truthDeck = signal<Question[]>([]);
  readonly dareDeck = signal<Question[]>([]);
  readonly currentCard = signal<Question | null>(null);
  /** Loại thẻ vừa chọn nhưng đã hết câu → hiện màn 2C. */
  readonly exhaustedKind = signal<CardKind | null>(null);
  private readonly deckTotals = signal<Partial<Record<CardKind, number>>>({});

  private timer?: ReturnType<typeof setInterval>;
  private dir = 1;
  private readonly bottle = viewChild<ElementRef<HTMLElement>>('bottle');
  private tickFrame = 0;
  CardKind = CardKind;

  readonly level = computed(() => this.gameStore.level());
  readonly levelLabel = computed(() => levelLabel(this.level()));

  readonly bottomActions = computed(() => [
    {
      icon: 'users',
      label: 'Người chơi',
      action: () => {
        this.router.navigate(['/nguoi-choi']);
      },
    },
    {
      icon: 'adjust',
      label: `Mức: ${this.levelLabel().toLowerCase()}`,
      action: () => this.toast.comingSoon(),
    },
    { icon: 'book', label: 'Luật chơi', action: () => this.toast.comingSoon() },
  ]);

  readonly exhaustedTotal = computed(() => {
    const kind = this.exhaustedKind();
    return kind ? (this.deckTotals()[kind] ?? 0) : 0;
  });
  readonly otherKind = computed(() =>
    this.exhaustedKind() === CardKind.TRUTH ? CardKind.DARE : CardKind.TRUTH,
  );
  readonly canSwitchKind = computed(() => this.deckSignal(this.otherKind())().length > 0);
  /** Nhẹ → Vừa, Vừa → Nặng; đang Nặng thì gợi ý hạ xuống Vừa. */
  readonly nextLevel = computed(() =>
    this.level() === Level.HARD ? Level.MEDIUM : ((this.level() + 1) as Level),
  );
  readonly nextLevelLabel = computed(() => levelLabel(this.nextLevel()));

  round = computed(() => this.gameStore.round());
  players = computed(() => this.gameStore.players());
  currentRoundPlayers = computed(() => this.gameStore.currentRoundPlayers());
  selectedPlayer = computed(() => this.gameStore.selectedPlayer());
  playedPlayers = computed(() => this.gameStore.playedPlayers());

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

  ngOnInit(): void {
    this.gameStore.initGame();
    this.rebuildDeck(CardKind.TRUTH);
    this.rebuildDeck(CardKind.DARE);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.stopTicking();
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
    this.startTicking();
  }

  onEnd(e: TransitionEvent) {
    if (e.propertyName !== 'transform') return;
    this.stopTicking();
    const list = this.currentRoundPlayers();
    const step = 360 / list.length;
    const angle = ((this.rotation() % 360) + 360) % 360;
    // Miệng chai hướng lên khi góc = 0, cung i có tâm tại i * step
    const index = Math.round(angle / step) % list.length;
    this.gameStore.selectedPlayer.set(list[index]);
    this.spinning.set(false);
    this.power.set(0);
    this.audioService.playSfx('winner');
  }

  randomSelectCard() {
    // Ưu tiên loại còn câu; hết cả hai thì vẫn random để mở màn hết câu
    const kinds = [CardKind.TRUTH, CardKind.DARE];
    const available = kinds.filter((k) => this.deckSignal(k)().length > 0);
    const pool = available.length ? available : kinds;
    this.selectCard(pool[Math.floor(Math.random() * pool.length)]);
  }

  selectCard(kind: CardKind) {
    const deck = this.deckSignal(kind);
    const [card, ...rest] = deck();
    if (!card) {
      this.exhaustedKind.set(kind);
      return;
    }
    this.exhaustedKind.set(null);
    this.currentCard.set(card);
    deck.set(rest);
  }

  switchKind() {
    this.selectCard(this.otherKind());
  }

  reshuffle() {
    const kind = this.exhaustedKind();
    if (!kind) return;
    this.rebuildDeck(kind);
    this.selectCard(kind);
    this.toast.show(`Đã trộn lại câu ${kind === CardKind.TRUTH ? 'Thật' : 'Thách'}`, 'shuffle');
  }

  changeLevel() {
    const kind = this.exhaustedKind();
    if (!kind) return;
    this.gameStore.level.set(this.nextLevel());
    this.rebuildDeck(CardKind.TRUTH);
    this.rebuildDeck(CardKind.DARE);
    this.selectCard(kind);
  }

  addGroupQuestions() {
    this.toast.comingSoon();
  }

  /** Mỗi frame đọc góc thật của chai; chai qua ranh giới giữa 2 ô thì kêu 1 tiếng. */
  private startTicking() {
    this.stopTicking();
    const el = this.bottle()?.nativeElement;
    const n = this.currentRoundPlayers().length;
    if (!el || n < 2) return;

    const step = 360 / n;
    // Tâm ô i ở i * step nên ranh giới nằm ở step/2 + k * step
    const sliceOf = (deg: number) => Math.floor((deg + step / 2) / step);
    let prev = readAngle(el);
    let total = prev; // góc cộng dồn, không bị quấn về -180..180
    let slice = sliceOf(total);
    let lastTickAt = 0;

    const frame = (now: number) => {
      const angle = readAngle(el);
      total += ((angle - prev + 540) % 360) - 180;
      prev = angle;
      const current = sliceOf(total);
      if (current !== slice) {
        slice = current;
        if (now - lastTickAt >= TICK_MIN_GAP) {
          lastTickAt = now;
          this.audioService.playSfx('tick', 1);
        }
      }
      this.tickFrame = requestAnimationFrame(frame);
    };
    this.tickFrame = requestAnimationFrame(frame);
  }

  private stopTicking() {
    cancelAnimationFrame(this.tickFrame);
    this.tickFrame = 0;
  }

  private deckSignal(kind: CardKind) {
    return kind === CardKind.TRUTH ? this.truthDeck : this.dareDeck;
  }

  private rebuildDeck(kind: CardKind) {
    const deck = buildDeck({ level: this.gameStore.level(), kinds: [kind] });
    this.deckSignal(kind).set(deck);
    this.deckTotals.update((t) => ({ ...t, [kind]: deck.length }));
  }

  nextTurn() {
    if (this.currentRoundPlayers().length === 1) {
      this.gameStore.initGame(this.gameStore.round() + 1);
      this.currentCard.set(null);
      this.exhaustedKind.set(null);
      return;
    }
    if (this.selectedPlayer()) {
      // this.gameStore.playedPlayers.update((v) => [...v, this.selectedPlayer()!]);
      // this.gameStore.currentRoundPlayers.update((v) =>
      //   v.filter((p) => p.id !== this.selectedPlayer()?.id),
      // );
      this.gameStore.selectedPlayer.set(null);
      this.currentCard.set(null);
      this.exhaustedKind.set(null);
    }
  }
}

/** Góc xoay hiện tại (độ, -180..180) lấy từ transform đang chạy của phần tử. */
function readAngle(el: HTMLElement): number {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0;
  const m = new DOMMatrixReadOnly(transform);
  return (Math.atan2(m.b, m.a) * 180) / Math.PI;
}

function levelLabel(level: Level): string {
  return LEVELS.find((l) => l.value === level)?.label ?? '';
}
