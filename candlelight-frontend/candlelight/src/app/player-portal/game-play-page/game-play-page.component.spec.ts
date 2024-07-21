import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayPageComponent } from './game-play-page.component';

describe('GamePlayPageComponent', () => {
  let component: GamePlayPageComponent;
  let fixture: ComponentFixture<GamePlayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePlayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
