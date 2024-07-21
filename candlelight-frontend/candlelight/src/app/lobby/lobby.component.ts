import {Component, inject} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {GameInfoBarComponent} from '../player-portal/game-play-page/game-info-bar/game-info-bar.component';
import {Lobby, WebsocketService} from '../data/websocket/websocket.service';
import {map, Observable, startWith, switchMap} from 'rxjs';
import {UserService} from "../data/user/user.service";
import {GameState} from "../models/session";

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    AsyncPipe,
    GameInfoBarComponent,
    NgFor,
    NgIf
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {
  private readonly router: Router = inject(Router);
  private readonly websocketService: WebsocketService = inject(WebsocketService);
  private readonly userService: UserService = inject(UserService);

  readonly socketResponse$: Observable<Lobby> = this.websocketService.lobby$.pipe(
    startWith(this.websocketService.lobby)
  );

  readonly players$: Observable<ReadonlyArray<string>> = this.socketResponse$.pipe(
    map((lobby: Lobby) => lobby.players.map(p => p.name))
  );

  readonly gameName$: Observable<string> = this.socketResponse$.pipe(
    map((lobby: Lobby) => {
      return lobby.gameName;
    }));

  readonly roomCode$: Observable<string> = this.socketResponse$.pipe(
    map((lobby: Lobby) => lobby.roomCode)
  );

  readonly currPlayer$: Observable<string> = this.socketResponse$.pipe(
    switchMap((response: Lobby) => this.userService.observable.pipe(
      map(user => user.playerName),
      startWith(this.userService.playerName)
    )));

  constructor() {
    this.websocketService.gameState$.subscribe((gameState: GameState) => {
      // const initGameState = respone as GameState;
      // const navigationExtras: NavigationExtras = {
      //   state: {
      //     gameName: this.mockGameName,
      //     initGameState
      //   }
      // };
      if (gameState.id) {
        // Redirect to the game-play component
        this.router.navigateByUrl('/play');
      }
    });
  }

  startGame() {
    console.log(this.websocketService.subject$);
    this.websocketService.startGame();
  }

  isHost(): boolean {
    return this.userService.playerId === this.websocketService.lobby.host.id;
  }
}
