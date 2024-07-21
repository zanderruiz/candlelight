import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResourceComponent } from './game-resource.component';

describe('GameResourceComponent', () => {
  let component: GameResourceComponent;
  let fixture: ComponentFixture<GameResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameResourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
