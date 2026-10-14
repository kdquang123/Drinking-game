import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameSessionStore } from './game-session.store';

export const hasPlayersGuard: CanActivateFn = () => {
  const gameStore = inject(GameSessionStore);
  return gameStore.hasEnoughPlayers() || inject(Router).createUrlTree(['/nguoi-choi']);
};
