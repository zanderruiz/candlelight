import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceSetComponent } from './piece-set.component';

describe('PieceSetComponent', () => {
  let component: PieceSetComponent;
  let fixture: ComponentFixture<PieceSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieceSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
