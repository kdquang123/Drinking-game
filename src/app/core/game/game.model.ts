export type PlayMode = 'quay-chai' | 'lat-the';

export type Level = 'nhe' | 'vua' | 'nang';

export interface LevelOption {
  value: Level;
  label: string;
  /** Số ngụm phải uống khi bấm Bỏ qua. */
  sips: number;
}

export const LEVELS: readonly LevelOption[] = [
  { value: 'nhe', label: 'Nhẹ', sips: 1 },
  { value: 'vua', label: 'Vừa', sips: 2 },
  { value: 'nang', label: 'Nặng', sips: 3 },
];

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 10;

/** Số màu người chơi (token w0…w9). Bằng MAX_PLAYERS để 2 lát cạnh nhau không bao giờ trùng màu. */
export const PLAYER_SLOT_COUNT = 10;

export interface Player {
  id: string;
  name: string;
  /** Chỉ số màu 0…9, giữ nguyên suốt ván kể cả khi người khác bị xoá. */
  slot: number;
}

export interface GameSession {
  version: 1;
  savedAt: number;
  mode: PlayMode;
  level: Level;
  players: Player[];
}
