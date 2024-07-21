import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResourcesComponent } from './game-resources.component';

describe('GameResourcesComponent', () => {
  let component: GameResourcesComponent;
  let fixture: ComponentFixture<GameResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameResourcesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
