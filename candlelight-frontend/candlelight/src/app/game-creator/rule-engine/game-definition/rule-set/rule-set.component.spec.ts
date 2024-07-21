import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSetComponent } from './rule-set.component';

describe('RuleSetComponent', () => {
  let component: RuleSetComponent;
  let fixture: ComponentFixture<RuleSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RuleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
