import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Viết đầy đủ tên class để Tailwind quét được.
const SLOT_CLASSES = [
  'bg-w0 text-wt0',
  'bg-w1 text-wt1',
  'bg-w2 text-wt2',
  'bg-w3 text-wt3',
  'bg-w4 text-wt4',
  'bg-w5 text-wt5',
  'bg-w6 text-wt6',
  'bg-w7 text-wt7',
  'bg-w8 text-wt8',
  'bg-w9 text-wt9',
] as const;

/** Avatar tròn: chữ cái đầu của tên trên màu slot w0…w9 của người chơi. */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': 'classes()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  template: `{{ initial() }}`,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly slot = input.required<number>();
  readonly size = input(36);

  protected readonly initial = computed(
    () => [...this.name().normalize('NFC').trim()][0]?.toLocaleUpperCase('vi') ?? '',
  );
  protected readonly classes = computed(
    () =>
      'inline-flex shrink-0 items-center justify-center rounded-full type-avatar ' +
      SLOT_CLASSES[this.slot() % SLOT_CLASSES.length],
  );
}
