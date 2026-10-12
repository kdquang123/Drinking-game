import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Card } from './components/card/card';
import { CardKind, Question } from '../../core/game/game.model';
import { buildDeck } from '../../data/mock-data';
import { GameSessionStore } from '../../core/game/game-session.store';
import { Icon } from '../../shared/ui/icon';

@Component({
  imports: [Card, Icon],
  selector: 'app-card-flip',
  styleUrl: './card-flip.css',
  templateUrl: './card-flip.html',
})
export class CardFlip implements OnInit {
  private readonly gameSession = inject(GameSessionStore);
  readonly deck = signal<Question[]>([]);
  readonly useDeck = signal<Question[]>([]);
  readonly flipped = signal(false);
  readonly current = computed(() => this.useDeck()[0]);
  readonly finished = computed(() => this.useDeck().length === 0);

  titleText = computed(() => {
    if (!this.flipped() || !this.current()) return 'Rút 1 thẻ đi!';
    return this.current().kind === CardKind.DRINK
      ? 'PHẠT UỐNG!'
      : this.current().kind === CardKind.TRUTH
        ? 'THẬT!'
        : 'THÁCH!';
  });

  ngOnInit(): void {
    this.gameSession.selectedPlayer.set(null);
    this.deck.set(buildDeck({ level: this.gameSession.level() }));
    this.useDeck.set([...this.deck()]);
  }

  next() {
    if (!this.flipped()) {
      this.useDeck.update((d) => d.slice(1));
    }
    this.flipped.update((v) => !v);
  }
}
