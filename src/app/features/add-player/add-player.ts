import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';
import { GameSessionStore } from '../../core/game/game-session.store';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/ui/button';
import { Avatar } from '../../shared/ui/avatar';

@Component({
  imports: [Icon, IconButton, FormsModule, Button, Avatar],
  selector: 'app-add-player',
  styleUrl: './add-player.css',
  templateUrl: './add-player.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlayer {
  private readonly gameStore = inject(GameSessionStore);

  readonly title = input.required<string>();

  playerName = '';

  errorText = signal('');
  readonly listPlayer = computed(() => this.gameStore.players());

  addPlayer() {
    const value = this.playerName.trim();
    if (!this.validate(value)) {
      return;
    }
    this.gameStore.addPlayer(this.playerName);
    this.playerName = '';
  }

  removePlayer(id: string) {
    this.gameStore.removePlayer(id);
  }

  private validate(value: string) {
    if (value.length === 0) return false;
    if (this.listPlayer().length >= 10) {
      this.errorText.set('Đã đủ số lượng người chơi');
      return false;
    }
    if (this.listPlayer().some((p) => p.name === value)) {
      this.errorText.set(`Tên “${value}” đã có rồi, thêm họ hoặc biệt danh nhé`);
      return false;
    }
    this.errorText.set('');
    return true;
  }
}
