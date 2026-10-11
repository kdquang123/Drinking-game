import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.css',
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly flipped = signal(false);

  toggle() {
    this.flipped.update((v) => !v);
  }
}
