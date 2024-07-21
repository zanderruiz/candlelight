import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetMovesComponent } from './action-set-moves.component';

describe('ActionSetMovesComponent', () => {
  let component: ActionSetMovesComponent;
  let fixture: ComponentFixture<ActionSetMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetMovesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
