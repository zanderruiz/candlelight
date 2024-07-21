import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSelectGameItemComponent } from './explore-select-game-item.component';

describe('ExploreSelectGameItemComponent', () => {
  let component: ExploreSelectGameItemComponent;
  let fixture: ComponentFixture<ExploreSelectGameItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreSelectGameItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreSelectGameItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
