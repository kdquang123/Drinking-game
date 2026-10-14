import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Card } from './components/card/card';
import { EmptyCard } from './components/empty-card/empty-card';
import { CardKind, Level, LEVELS, Question } from '../../core/game/game.model';
import { buildDeck } from '../../data/mock-data';
import { GameSessionStore } from '../../core/game/game-session.store';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { ToastService } from '../../shared/ui/toast';

@Component({
  imports: [Card, EmptyCard, Button, Icon],
  selector: 'app-card-flip',
  styleUrl: './card-flip.css',
  templateUrl: './card-flip.html',
})
export class CardFlip implements OnInit {
  private readonly gameSession = inject(GameSessionStore);
  private readonly toast = inject(ToastService);
  readonly deck = signal<Question[]>([]);
  readonly drawnIndex = signal(-1);
  readonly flipped = signal(false);
  readonly current = computed(() => this.deck()[Math.max(this.drawnIndex(), 0)]);
  readonly drawnCount = computed(() => this.drawnIndex() + 1);
  readonly remaining = computed(() => this.deck().length - this.drawnCount());
  readonly finished = computed(() => !this.flipped() && this.remaining() <= 0);

  readonly level = computed(() => this.gameSession.level());
  readonly nextLevel = computed(() =>
    this.level() === Level.HARD ? Level.MEDIUM : ((this.level() + 1) as Level),
  );
  readonly nextLevelLabel = computed(
    () => LEVELS.find((l) => l.value === this.nextLevel())?.label ?? '',
  );

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
    this.resetDeck();
  }

  next() {
    if (this.flipped()) {
      this.flipped.set(false);
      return;
    }
    if (this.remaining() <= 0) return;
    this.drawnIndex.update((i) => i + 1);
    this.flipped.set(true);
  }

  shuffle() {
    this.resetDeck();
    this.toast.show('Đã xáo lại bộ bài', 'shuffle');
  }

  changeLevel() {
    this.gameSession.level.set(this.nextLevel());
    this.resetDeck();
  }

  private resetDeck() {
    this.deck.set(buildDeck({ level: this.gameSession.level() }));
    this.drawnIndex.set(-1);
    this.flipped.set(false);
  }

  addGroupQuestions() {
    this.toast.comingSoon();
  }
}
