import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGameDialogueComponent } from './host-game-dialogue.component';

describe('HostGameDialogueComponent', () => {
  let component: HostGameDialogueComponent;
  let fixture: ComponentFixture<HostGameDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostGameDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostGameDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
