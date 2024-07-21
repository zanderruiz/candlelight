import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetMoveComponent } from './action-set-move.component';

describe('ActionSetMoveComponent', () => {
  let component: ActionSetMoveComponent;
  let fixture: ComponentFixture<ActionSetMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetMoveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
