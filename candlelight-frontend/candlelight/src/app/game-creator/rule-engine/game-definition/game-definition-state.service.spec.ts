import { TestBed } from '@angular/core/testing';

import { GameDefinitionStateService } from './game-definition-state.service';

describe('GameDefinitionStateService', () => {
  let service: GameDefinitionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDefinitionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
