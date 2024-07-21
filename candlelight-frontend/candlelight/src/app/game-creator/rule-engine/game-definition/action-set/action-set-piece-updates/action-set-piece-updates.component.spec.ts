import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetPieceUpdatesComponent } from './action-set-piece-updates.component';

describe('ActionSetPieceUpdatesComponent', () => {
  let component: ActionSetPieceUpdatesComponent;
  let fixture: ComponentFixture<ActionSetPieceUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetPieceUpdatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetPieceUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
