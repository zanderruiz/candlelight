import { AfterViewInit, Component, Input, HostListener, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card, GamePiece } from '../../../models/piece';
import { GamePlayService } from '../../game-play.service';
import { 
  CdkDrag, 
  CdkDragStart,
  CdkDragRelease,
  CdkDragDrop, 
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { WebsocketService } from '../../../data/websocket/websocket.service';
import { UserService } from '../../../data/user/user.service';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CardComponent,
  ],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})
export class DeckComponent {
  @Input() id: string = '';
  @Input() cards: Card[] = [];

  private readonly websocketService: WebsocketService = inject(WebsocketService);
  private readonly userService: UserService = inject(UserService);

  getTopCard(): Card[] {
    if (this.cards.length === 0) {
      return [];
    }
    return [this.cards[this.cards.length]];
  }

  drop(event: CdkDragDrop<Card[]>) {
    // Dropped in same container it was dragged from
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    // Dropped in different container from which it was dragged
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }  
  }

  dragStarted(event: CdkDragStart) {
    const card = event.source.element.nativeElement.querySelector('.card') as HTMLElement;
    card.classList.remove('face-down');
  }

  dragReleased(event: CdkDragRelease) {
    const card = event.source.element.nativeElement.querySelector('.card') as HTMLElement;
    card.classList.add('face-down');
  }
}
