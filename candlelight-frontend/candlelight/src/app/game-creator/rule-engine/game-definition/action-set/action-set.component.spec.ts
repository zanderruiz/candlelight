import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetComponent } from './action-set.component';

describe('ActionSetComponent', () => {
  let component: ActionSetComponent;
  let fixture: ComponentFixture<ActionSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
