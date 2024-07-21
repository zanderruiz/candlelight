import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTakeComponent } from './action-set-take.component';

describe('ActionSetTakeComponent', () => {
  let component: ActionSetTakeComponent;
  let fixture: ComponentFixture<ActionSetTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
