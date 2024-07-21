import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetCardComponent } from './piece-set-card.component';

describe('PieceSetCardComponent', () => {
  let component: PieceSetCardComponent;
  let fixture: ComponentFixture<PieceSetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
