import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetPlacementsComponent } from './action-set-placements.component';

describe('ActionSetPlacementsComponent', () => {
  let component: ActionSetPlacementsComponent;
  let fixture: ComponentFixture<ActionSetPlacementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetPlacementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetPlacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
