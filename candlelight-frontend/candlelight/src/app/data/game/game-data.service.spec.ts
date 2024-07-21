import { TestBed } from '@angular/core/testing';

import { GameDataService } from './game-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameDataService', () => {
  let service: GameDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(GameDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
