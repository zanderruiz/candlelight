import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, map, Observable, OperatorFunction, Subscription} from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {emptyGameState, GameState, SubmittedAction} from '../../models/session';
import {LobbyInfo} from '../lobby/lobby.service';
import {emptyPlayer, Player} from "../../models/player";
import API_URL from '../../../../env.js';
import {UserService} from "../user/user.service";

export type StartGameMessage = {
  playerId: string;
}

export interface Lobby {
  gameDefinitionId: string;
  gameName: string;
  host: Player;
  maxPlayers: number;
  numPlayers: number;
  players: ReadonlyArray<Player>;
  roomCode: string;
}

export type LobbyResponse = {
  playerID: string;
  lobbyInfo: Lobby;
};

export function emptyLobby(): Lobby {
  return {
    gameDefinitionId: '',
    gameName: '',
    host: emptyPlayer(),
    maxPlayers: 0,
    numPlayers: 0,
    players: [],
    roomCode: ''
  };
}

export function emptyLobbyResponse(): LobbyResponse {
  return {
    playerID: '',
    lobbyInfo: emptyLobby()
  };
}

export type WebSocketRequest = SubmittedAction;
export type WebSocketResponse = LobbyResponse | GameState;
type WebSocketMessage = WebSocketRequest | WebSocketResponse;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private readonly userService: UserService = inject(UserService);

  private subscription: Subscription | undefined;
  private subject?: WebSocketSubject<unknown>;

  private lastLobbyResponse$ = new BehaviorSubject<LobbyResponse>(emptyLobbyResponse());
  private lastGameState$ = new BehaviorSubject<GameState>(emptyGameState());


  constructor() {
    console.log('constructed websocket service');
    console.log(this.subject);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get isOpen(): boolean {
    return !!this.subject && !this.subject.closed;
  }

  get isHost(): boolean {
    return this.userService.playerId === this.lobby.host.id;
  }

  get lobby(): Lobby {
    return this.lastLobbyResponse$.value.lobbyInfo;
  }

  get lobby$(): Observable<Lobby> {
    return this.lastLobbyResponse$.asObservable().pipe(map((r) => r.lobbyInfo));
  }

  get gameState(): GameState {
    return this.lastGameState$.value;
  }

  get gameState$(): Observable<GameState> {
    return this.lastGameState$.asObservable();
  }

  get subject$(): Observable<WebSocketResponse> {
    console.log('getting subject', this.subject);
    return this.subject!.asObservable().pipe(this.mapToResponse());
  }

  openWebSocket(path: string): Observable<WebSocketResponse> {
    console.log('Opening websocket with path:', path);
    this.closeWebSocket();
    this.subject = webSocket({
      url: `ws://${API_URL}${path}`,
      serializer: (value: unknown) => JSON.stringify(value),
    });

    // this will update some fields in this service whenever an update is received.
    // this can be useful to be able to imperatively get the most recent state of the game/lobby
    this.subscription = new Subscription();
    this.subscription.add(
      this.subject.subscribe((next: unknown) => {
          if ('gamePieces' in (next as any)) {
            const gameState = next as GameState;
            console.log('Setting last game state:', gameState);
            this.lastGameState$.next(gameState);
          } else {
            this.onLobbyChange(next as (LobbyResponse | Lobby));
          }
        })
    );

    return this.subject$;
  }

  closeWebSocket(): void {
    this.subscription?.unsubscribe();
    this.subject?.complete();
  }

  startGame(): void {
    // This JSON struct could be refactored into an interface, it's just ungabunga right now
    this.subject?.next(
      {
        JSONType: 'startGame',
        Data: {playerId: this.userService.playerId} as StartGameMessage
      }
    );
  }

  sendAction(s: WebSocketRequest): void {
    const action =
      {
        JSONType: 'submitAction',
        Data:
        {
          GameId: this.gameState.id,
          Action: s
        }
      }
    this.subject?.next(action);
    console.log('Sent action:', action);
  }

  sendLobbyInfo(s: LobbyInfo): void {
    this.subject?.next(s);
  }

  sendEmpty(): void {
    this.subject?.next({});
  }

  private onLobbyChange(lobby: LobbyResponse | Lobby): void {
    let lobbyResponse: LobbyResponse;
    if (!('lobbyInfo' in (lobby as any))) {
      // this check is in case the backend sends just a Lobby instead of the full LobbyResponse
      lobbyResponse = {...this.lastLobbyResponse$.value, lobbyInfo: lobby as Lobby};
    } else {
      lobbyResponse = lobby as LobbyResponse;
    }
    console.log('Setting last lobby response:', lobbyResponse);
    this.lastLobbyResponse$.next(lobbyResponse);
    this.userService.playerId = lobbyResponse.playerID;
  }

  private mapToResponse: () => OperatorFunction<unknown, WebSocketResponse> =
    () => map((r: unknown) => r as WebSocketResponse);

}
