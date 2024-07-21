import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTakesComponent } from './action-set-takes.component';

describe('ActionSetTakesComponent', () => {
  let component: ActionSetTakesComponent;
  let fixture: ComponentFixture<ActionSetTakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTakesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
