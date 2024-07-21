import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetPieceUpdateComponent } from './action-set-piece-update.component';

describe('ActionSetPieceUpdateComponent', () => {
  let component: ActionSetPieceUpdateComponent;
  let fixture: ComponentFixture<ActionSetPieceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSetPieceUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionSetPieceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
