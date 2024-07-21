import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeartbeatDataService } from './heartbeat-data.service';

describe('DataService', () => {
  let service: HeartbeatDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(HeartbeatDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
