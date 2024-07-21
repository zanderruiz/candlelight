import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetCardPlacesComponent } from './piece-set-card-places.component';

describe('PieceSetCardPlacesComponent', () => {
  let component: PieceSetCardPlacesComponent;
  let fixture: ComponentFixture<PieceSetCardPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetCardPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetCardPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
