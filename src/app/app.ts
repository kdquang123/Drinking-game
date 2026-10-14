import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/ui/toast';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Toast],
  template: `
    <div class="app-frame">
      <router-outlet />
      <app-toast />
    </div>
  `,
})
export class App {}
