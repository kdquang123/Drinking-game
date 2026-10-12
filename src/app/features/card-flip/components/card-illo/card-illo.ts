import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardKind, IlloKey } from '../../../../core/game/game.model';

@Component({
  imports: [],
  selector: 'app-card-illo',
  styleUrl: './card-illo.css',
  templateUrl: './card-illo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden rounded-ctl',
    'aria-hidden': 'true',
    '[style.background]': "'var(--' + bgVar() + ')'",
    '[style.--ia]':
      "kind() === 'truth' ? 'var(--dare)' : kind() === 'dare' ? 'var(--truth)' : 'var(--dare)'",
    '[style.--ib]': "'var(--card)'",
    '[style.--ic]': "kind() === 'drink' ? 'var(--truth)' : 'var(--drink)'",
    '[style.--sp]': "kind() === 'drink' ? 'var(--card)' : 'var(--drink)'",
  },
})
export class CardIllo {
  readonly illo = input.required<IlloKey>();
  readonly kind = input.required<CardKind>();
  protected readonly hands = [
    { x: 92, y: 40, r: -12, arm: 'var(--ic)' },
    { x: 150, y: 22, r: 0, arm: 'var(--ia)' },
    { x: 208, y: 40, r: 12, arm: 'var(--ic)' },
  ];
  protected bgVar(): string {
    return this.kind() === 'truth' ? 'truth' : this.kind() === 'dare' ? 'dare' : 'drink';
  }
}
