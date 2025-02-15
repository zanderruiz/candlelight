import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintComponent } from './constraint.component';

describe('ConstraintComponent', () => {
  let component: ConstraintComponent;
  let fixture: ComponentFixture<ConstraintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstraintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
