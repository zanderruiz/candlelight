import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Game } from '../../models/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  static readonly studioUrl = '/api/studio';
  static readonly allGamesUrl = '/api/allGames';

  private readonly httpClient: HttpClient = inject(HttpClient);

  fetchGame(id: string): Observable<Game> {
    const params = new HttpParams().append('id', id);
    return this.httpClient.get<Game>(GameDataService.studioUrl, { params });
  }

  fetchGames(slimmed = false): Observable<ReadonlyArray<Game>> {
    const params = new HttpParams().append('slimmed', slimmed.toString());
    return this.httpClient.get<ReadonlyArray<Game>>(GameDataService.allGamesUrl, { params });
  }

  createGame(game: Game): Observable<any> {
    return this.httpClient.post(GameDataService.studioUrl, game);
  }
}
