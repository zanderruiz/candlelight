import { TestBed } from '@angular/core/testing';

import { LobbyService } from './lobby.service';
import { WebSocketResponse, WebsocketService } from '../websocket/websocket.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LobbyService', () => {
  let lobbyService: LobbyService;
  let webSocketService: WebsocketService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    lobbyService = TestBed.inject(LobbyService);
    webSocketService = TestBed.inject(WebsocketService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(lobbyService).toBeTruthy();
  });

  xit('should host lobby and connect', () => {
    // given a lobby response
    const lobbyResponse: WebSocketResponse = {
      playerId: 'test1',
      lobby: {
        roomCode: 'test2',
        gameDefinitionId: 'test3',
        gameName: 'game',
        numPlayers: 4,
        maxPlayers: 5,
        players: ['test6'],
        host: 'test7'
      }
    };
    // and given the web socket service returns the lobby response
    const websocketSpy = spyOn(webSocketService, 'openWebSocket').and
      .returnValue(of(lobbyResponse));
    // when the lobby service hosts a lobby and connects
    let response: WebSocketResponse | undefined;
    const reqGameId = 'game_id';
    const reqPlayerName = 'player_name';
    lobbyService.hostLobbyAndConnect(reqGameId, reqPlayerName).subscribe(r => response = r);
    // expect a GET request is made to host a lobby with a game id and player name
    const req = httpTestingController.expectOne(
      `${LobbyService.hostUrl}?gameId=${reqGameId}&playerName=${reqPlayerName}`);
    expect(req.request.method).toEqual('GET');
    // when the GET request completes
    const socketInfo = { url: 'ws://localhost', port: 9876 };
    req.flush(socketInfo);
    // then the web socket service is called with the port
    // expect(websocketSpy).toHaveBeenCalledWith(socketInfo.port);
    // and the response is the lobby response
    expect(response).toEqual(lobbyResponse);
  });

  xit('should join lobby and connect', () => {
    // given a lobby response
    const lobbyResponse: WebSocketResponse = {
      playerId: 'test1',
      lobby: {
        roomCode: 'test2',
        gameDefinitionId: 'test3',
        gameName: 'game',
        numPlayers: 4,
        maxPlayers: 5,
        players: ['test6'],
        host: 'test7'
      }
    };
    // and given the web socket service returns the lobby response
    const websocketSpy = spyOn(webSocketService, 'openWebSocket').and
      .returnValue(of(lobbyResponse));
    // when the lobby service joins a lobby and connects
    let response: WebSocketResponse | undefined;
    const reqRoomCode = 'room_code';
    const reqPlayerName = 'player_name';
    lobbyService.joinLobbyAndConnect(reqRoomCode, reqPlayerName).subscribe(r => response = r);
    // expect a GET request is made to join a lobby with a room code and player name
    const req = httpTestingController.expectOne(
      `${LobbyService.hostUrl}?roomCode=${reqRoomCode}&playerName=${reqPlayerName}`);
    expect(req.request.method).toEqual('GET');
    // when the GET request completes
    const socketInfo = { url: 'ws://localhost', port: 9876 };
    req.flush(socketInfo);
    // then the web socket service is called with the port
    // expect(websocketSpy).toHaveBeenCalledWith(socketInfo.port);
    // and the response is the lobby response
    expect(response).toEqual(lobbyResponse);
  });
});
