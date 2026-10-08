import { Level } from '../game/game.model';

/** that = Thật, thach = Thách, uong = Phạt uống */
export type CardKind = 'that' | 'thach' | 'uong';

/** Key minh hoạ (design system mục 5.2). body / vote / secret chưa có hình. */
export type IlloTopic = 'love' | 'social' | 'drink' | 'body' | 'vote' | 'secret';

/**
 * Một câu trong public/data/questions.json.
 * Câu đầy đủ = pre + hl + post. `hl` là cụm từ khoá được tô màu trên thẻ.
 * Viết chữ thường, thẻ tự chuyển HOA bằng CSS.
 */
export interface Question {
  id: string;
  kind: CardKind;
  level: Level;
  topic: IlloTopic;
  pre: string;
  hl: string;
  post: string;
  /** Chỉ thẻ Thách: số giây đếm ngược. Không có thì không hiện đồng hồ. */
  timer?: number;
  /** Chỉ thẻ Phạt uống: số ngụm ghi trên thẻ. Thẻ Thật/Thách lấy theo mức độ. */
  sips?: number;
}

export interface QuestionBank {
  version: number;
  questions: Question[];
}

export const QUESTION_BANK_URL = 'data/questions.json';
export const MAX_QUESTION_LENGTH = 110;
