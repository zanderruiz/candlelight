import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSubsetComponent } from './piece-subset.component';

describe('PieceSubsetComponent', () => {
  let component: PieceSubsetComponent;
  let fixture: ComponentFixture<PieceSubsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSubsetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSubsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
