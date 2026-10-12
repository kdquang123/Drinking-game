import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CardKind, Level, Question } from '../../../../core/game/game.model';
import { CardIllo } from '../card-illo/card-illo';

@Component({
  imports: [CardIllo],
  selector: 'app-card',
  styleUrl: './card.css',
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly card = input.required<Question>();
  readonly flipped = input(false);
  toggleCard = output();

  color = computed(() => {
    const kind = this.card()?.kind;
    if (kind === CardKind.TRUTH) return 'truth';
    if (kind === CardKind.DARE) return 'dare';
    return 'drink';
  });

  cardKindText = computed(() => {
    const kind = this.card()?.kind;
    if (kind === CardKind.TRUTH) return 'THẬT';
    if (kind === CardKind.DARE) return 'THÁCH';
    return 'PHẠT UỐNG';
  });

  cardLevelText = computed(() => {
    const level = this.card()?.level;
    if (level === Level.EASY) return 'Mức nhẹ';
    if (level === Level.MEDIUM) return 'Mức vừa';
    if (level === Level.HARD) return 'Mức nặng';
    return 'Ai cũng dính';
  });

  cardActionText = computed(() => {
    const kind = this.card()?.kind;
    const level = this.card()?.level;
    if (kind === 'drink') return 'UỐNG HAI NGỤM NGAY!';
    return `KHÔNG ${kind === 'truth' ? 'NÓI' : 'LÀM'} THÌ UỐNG ${level} NGỤM`;
  });

  toggle() {
    this.toggleCard.emit();
  }
}
