import {inject, Injectable} from '@angular/core';
import {map, Observable, tap} from 'rxjs';
import {LobbyResponse, WebsocketService} from '../websocket/websocket.service';

interface BaseLobbyInfo {
  playerName: string;
}

export interface HostLobbyInfo extends BaseLobbyInfo {
  gameId: string;
}

export interface JoinLobbyInfo extends BaseLobbyInfo {
  roomCode: string;
}

export type LobbyInfo = HostLobbyInfo | JoinLobbyInfo;

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  static readonly hostUrl = '/hostLobby';
  static readonly joinUrl = '/joinLobby';

  private readonly webSocketService: WebsocketService = inject(WebsocketService);

  hostLobbyAndConnect(gameId: string, playerName: string): Observable<LobbyResponse> {
    // open web socket with given url path
    this.webSocketService.openWebSocket(
      LobbyService.hostUrl
      + `?gameId=${gameId}&playerName=${playerName}`
    );

    // send lobby info to socket
    this.webSocketService.sendLobbyInfo({gameId, playerName});

    // return observable of socket connection, assume it can be mapped to a LobbyResponse object
    return this.webSocketService.subject$!
      .pipe(
        tap(r => console.log('hostLobbyAndConnect response:', r)),
        map(r => r as LobbyResponse)
      );
  }

  joinLobbyAndConnect(roomCode: string, playerName: string): Observable<LobbyResponse> {
    // open web socket with given url path
    this.webSocketService.openWebSocket(
      LobbyService.joinUrl
      + `?roomCode=${roomCode}&playerName=${playerName}`
    );

    // send lobby info to socket
    this.webSocketService.sendLobbyInfo({roomCode, playerName});

    // return observable of socket connection, assume it can be mapped to a LobbyResponse object
    return this.webSocketService.subject$!
      .pipe(map(r => r as LobbyResponse));
  }

}
