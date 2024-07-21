import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeartbeatDataService {
  static readonly baseUrl = '/api/';

  private readonly httpClient: HttpClient = inject(HttpClient);

  post(s: string): Observable<string> {
    return this.httpClient.post(HeartbeatDataService.baseUrl, s, { responseType: 'text' });
  }
}
