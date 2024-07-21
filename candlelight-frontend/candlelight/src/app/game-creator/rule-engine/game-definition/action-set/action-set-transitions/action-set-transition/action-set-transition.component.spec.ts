import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTransitionComponent } from './action-set-transition.component';

describe('ActionSetTransitionComponent', () => {
  let component: ActionSetTransitionComponent;
  let fixture: ComponentFixture<ActionSetTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTransitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
