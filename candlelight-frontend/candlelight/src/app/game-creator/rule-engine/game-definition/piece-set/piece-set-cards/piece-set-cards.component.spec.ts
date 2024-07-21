import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetCardsComponent } from './piece-set-cards.component';

describe('PieceSetCardsComponent', () => {
  let component: PieceSetCardsComponent;
  let fixture: ComponentFixture<PieceSetCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
