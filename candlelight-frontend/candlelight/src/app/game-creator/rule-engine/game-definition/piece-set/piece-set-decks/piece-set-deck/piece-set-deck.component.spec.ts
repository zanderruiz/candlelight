import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetDeckComponent } from './piece-set-deck.component';

describe('PieceSetDeckComponent', () => {
  let component: PieceSetDeckComponent;
  let fixture: ComponentFixture<PieceSetDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetDeckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
