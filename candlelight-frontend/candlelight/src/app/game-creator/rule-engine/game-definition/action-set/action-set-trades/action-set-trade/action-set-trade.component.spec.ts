import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetTradeComponent } from './action-set-trade.component';

describe('ActionSetTradeComponent', () => {
  let component: ActionSetTradeComponent;
  let fixture: ComponentFixture<ActionSetTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetTradeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
