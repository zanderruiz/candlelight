import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetCardPlaceComponent } from './piece-set-card-place.component';

describe('PieceSetCardPlaceComponent', () => {
  let component: PieceSetCardPlaceComponent;
  let fixture: ComponentFixture<PieceSetCardPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetCardPlaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetCardPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
