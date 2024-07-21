import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpTestComponent } from './http-test.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HttpTestComponent', () => {
  let component: HttpTestComponent;
  let fixture: ComponentFixture<HttpTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpTestComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HttpTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
