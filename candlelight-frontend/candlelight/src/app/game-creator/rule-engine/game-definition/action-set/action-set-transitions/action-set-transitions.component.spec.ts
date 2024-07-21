import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTransitionsComponent } from './action-set-transitions.component';

describe('ActionSetTransitionsComponent', () => {
  let component: ActionSetTransitionsComponent;
  let fixture: ComponentFixture<ActionSetTransitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTransitionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTransitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
