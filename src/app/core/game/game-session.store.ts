import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS, StorageService } from '../storage/storage.service';
import {
  GameSession,
  Level,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_SLOT_COUNT,
  PlayMode,
  Player,
} from './game.model';

/** Ván bỏ dở quá thời gian này sẽ bị xoá khi mở lại app. */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Trạng thái ván đang chơi. Lưu ở localStorage để lỡ đóng tab vẫn mở lại được,
 * xoá khi gọi `end()` hoặc khi quá SESSION_TTL_MS.
 *
 * Phần còn lại của ván (vòng hiện tại, ai đã chơi, câu đã dùng…) thêm vào đây
 * và vào interface GameSession khi làm các màn chơi.
 */
@Injectable({ providedIn: 'root' })
export class GameSessionStore {
  private readonly storage = inject(StorageService);
  private readonly restored = this.restore();

  readonly mode = signal<PlayMode>(this.restored?.mode ?? 'quay-chai');
  readonly level = signal<Level>(this.restored?.level ?? Level.MEDIUM);

  private readonly playerList = signal<readonly Player[]>(this.restored?.players ?? []);
  readonly players = this.playerList.asReadonly();
  readonly hasEnoughPlayers = computed(() => this.playerList().length >= MIN_PLAYERS);
  readonly isFull = computed(() => this.playerList().length >= MAX_PLAYERS);
  readonly round = signal(1);

  readonly currentRoundPlayers = signal<Player[]>([]);
  readonly playedPlayers = signal<Player[]>([]);
  readonly selectedPlayer = signal<Player | null>(null);

  constructor() {
    effect(() => {
      const players = this.playerList();
      const mode = this.mode();
      const level = this.level();
      if (players.length === 0) {
        this.storage.remove(STORAGE_KEYS.session);
        return;
      }
      const session: GameSession = {
        version: 1,
        savedAt: Date.now(),
        mode,
        level,
        players: [...players],
      };
      this.storage.write(STORAGE_KEYS.session, session);
    });
  }

  initGame(round: number = 1) {
    this.round.set(round);
    this.playedPlayers.set([]);
    this.currentRoundPlayers.set([...this.players()]);
    this.selectedPlayer.set(null);
  }

  /** Thêm người chơi với slot màu nhỏ nhất còn trống. Trả về null nếu đã đủ người. */
  addPlayer(name: string): Player | null {
    const players = this.playerList();
    if (players.length >= MAX_PLAYERS) return null;

    const usedSlots = new Set(players.map((p) => p.slot));
    const slot = Array.from({ length: PLAYER_SLOT_COUNT }, (_, i) => i).find(
      (i) => !usedSlots.has(i),
    );
    if (slot === undefined) return null;

    const player: Player = { id: createId(), name, slot };
    this.playerList.set([...players, player]);
    return player;
  }

  removePlayer(id: string): void {
    this.playerList.update((players) => players.filter((p) => p.id !== id));
  }

  /** Kết thúc ván: xoá người chơi và trạng thái ván, giữ chế độ/mức đang chọn. */
  end(): void {
    this.playerList.set([]);
  }

  private restore(): GameSession | null {
    const session = this.storage.read(STORAGE_KEYS.session, isGameSession);
    if (!session || Date.now() - session.savedAt > SESSION_TTL_MS) {
      this.storage.remove(STORAGE_KEYS.session);
      return null;
    }
    return session;
  }
}

function createId(): string {
  // randomUUID chỉ có trong secure context; khi test qua IP LAN bằng http thì không có.
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

function isGameSession(value: unknown): value is GameSession {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Partial<GameSession>;
  return (
    s.version === 1 &&
    typeof s.savedAt === 'number' &&
    (s.mode === 'quay-chai' || s.mode === 'lat-the') &&
    (s.level === Level.EASY || s.level === Level.MEDIUM || s.level === Level.HARD) &&
    Array.isArray(s.players) &&
    s.players.every(
      (p) =>
        typeof p?.id === 'string' &&
        typeof p.name === 'string' &&
        Number.isInteger(p.slot) &&
        p.slot >= 0 &&
        p.slot < PLAYER_SLOT_COUNT,
    )
  );
}
