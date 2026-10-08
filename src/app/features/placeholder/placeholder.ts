import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';

/** Trang tạm cho các màn chưa làm. Tiêu đề lấy từ `data.title` của route. */
@Component({
  selector: 'app-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, IconButton],
  template: `
    <main class="flex min-h-dvh flex-col px-(--page-x) pt-(--page-top) pb-(--page-bottom)">
      <header class="flex h-12 items-center gap-3">
        <a routerLink="/" appIconButton aria-label="Về trang chủ">
          <app-icon name="chevron-left" [size]="24" [strokeWidth]="2.6" />
        </a>
        <h1 class="type-display-m text-text uppercase">{{ title() }}</h1>
      </header>
      <p class="type-body-s mt-6 text-muted">Màn này chưa được xây dựng.</p>
      <ng-content />
    </main>
  `,
})
export class Placeholder {
  readonly title = input.required<string>();
}
