import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetDecksComponent } from './piece-set-decks.component';

describe('PieceSetDecksComponent', () => {
  let component: PieceSetDecksComponent;
  let fixture: ComponentFixture<PieceSetDecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetDecksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetDecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
