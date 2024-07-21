import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetPlacementComponent } from './action-set-placement.component';

describe('ActionSetPlacementComponent', () => {
  let component: ActionSetPlacementComponent;
  let fixture: ComponentFixture<ActionSetPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetPlacementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
