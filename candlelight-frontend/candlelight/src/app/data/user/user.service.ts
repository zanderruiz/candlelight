import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface User {
  playerName: string;
  playerId: string;
}

export function emptyUser(): User {
  return {
    playerName: '',
    playerId: ''
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly subject$ = new BehaviorSubject<User>(emptyUser());

  get observable(): Observable<User> {
    return this.subject$.asObservable();
  }

  get playerName(): string {
    return this.subject$.value.playerName;
  }

  get playerId(): string {
    return this.subject$.value.playerId;
  }

  set playerName(playerName: string) {
    this.subject$.next({...this.subject$.value, playerName});
  }

  set playerId(playerId: string) {
    const existingPlayerId = this.playerId;
    if (existingPlayerId && (existingPlayerId !== playerId)) {
      console.warn(`Opting to not override existing player ID ${existingPlayerId} with ${playerId}.`);
    } else {
      this.subject$.next({...this.subject$.value, playerId});
    }
  }
}
