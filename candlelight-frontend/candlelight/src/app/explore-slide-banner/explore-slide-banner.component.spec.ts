import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSlideBannerComponent } from './explore-slide-banner.component';

describe('ExploreSlideBannerComponent', () => {
  let component: ExploreSlideBannerComponent;
  let fixture: ComponentFixture<ExploreSlideBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreSlideBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreSlideBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
