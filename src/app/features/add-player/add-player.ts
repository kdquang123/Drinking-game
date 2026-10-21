import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Icon } from '../../shared/ui/icon';
import { IconButton } from '../../shared/ui/icon-button';
import { GameSessionStore } from '../../core/game/game-session.store';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/ui/button';
import { Avatar } from '../../shared/ui/avatar';
import { RouterLink } from '@angular/router';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../core/game/game.model';

@Component({
  imports: [Icon, IconButton, FormsModule, Button, Avatar, RouterLink],
  selector: 'app-add-player',
  styleUrl: './add-player.css',
  templateUrl: './add-player.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPlayer {
  private readonly gameStore = inject(GameSessionStore);

  readonly title = input.required<string>();

  playerName = '';
  minPlayer = MIN_PLAYERS;

  errorText = signal('');
  readonly listPlayer = computed(() => this.gameStore.players());
  readonly hasEnoughPlayers = computed(() => this.gameStore.hasEnoughPlayers());
  readonly isFull = computed(() => this.gameStore.isFull());

  protected readonly startLink = computed(() => {
    return this.hasEnoughPlayers() ? '/quay-chai' : '/nguoi-choi';
  });

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
    if (value.length === 0) {
      this.errorText.set('Nhập tên trước đã');
      return false;
    }

    if (value.length > 12) {
      this.errorText.set('Tên tối đa 12 ký tự');
      return;
    }

    if (this.isFull()) {
      this.errorText.set(`Đã đủ ${MAX_PLAYERS} người chơi`);
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
