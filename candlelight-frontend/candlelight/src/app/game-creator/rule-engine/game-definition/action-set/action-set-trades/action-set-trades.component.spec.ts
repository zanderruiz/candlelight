import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTradesComponent } from './action-set-trades.component';

describe('ActionSetTradesComponent', () => {
  let component: ActionSetTradesComponent;
  let fixture: ComponentFixture<ActionSetTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTradesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
