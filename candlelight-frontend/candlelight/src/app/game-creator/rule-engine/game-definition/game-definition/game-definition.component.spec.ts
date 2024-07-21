import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDefinitionComponent } from './game-definition.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameDefinitionComponent', () => {
  let component: GameDefinitionComponent;
  let fixture: ComponentFixture<GameDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GameDefinitionComponent,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
