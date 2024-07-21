import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ExploreSelectPageComponent } from './explore-select-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExploreSelectPageComponent', () => {
  let component: ExploreSelectPageComponent;
  let fixture: ComponentFixture<ExploreSelectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ExploreSelectPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExploreSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
