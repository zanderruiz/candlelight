import { AfterViewInit, Component, Input, HostListener, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card, GamePiece } from '../../../models/piece';
import { GamePlayService } from '../../game-play.service';
import { 
  CdkDrag, 
  CdkDragDrop, 
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { WebsocketService } from '../../../data/websocket/websocket.service';
import { UserService } from '../../../data/user/user.service';
import { ActionType, PlacementTurn, TakeTurn } from '../../../models/session';
import { Player } from '../../../models/player';

@Component({
  selector: 'app-card-place',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CardComponent,
  ],
  templateUrl: './card-place.component.html',
  styleUrl: './card-place.component.css'
})
export class CardPlaceComponent implements AfterViewInit {
  @Input() id: string = '';
  @Input() cards: Card[] = [];

  private readonly websocketService: WebsocketService = inject(WebsocketService);
  private readonly userService: UserService = inject(UserService);

  constructor(private readonly gamePlayService: GamePlayService) { }

  ngAfterViewInit(): void {
    // Adjust card place padding-right to get card overlay right
    this.calculatePaddingRight(document.querySelector('.card-place') as HTMLElement);
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Recalculate padding-right on window resize to get card overlay right
    this.calculatePaddingRight(document.querySelector('.card-place') as HTMLElement);
  }

  drop(event: CdkDragDrop<Card[]>) {
    // Dropped in same container it was dragged from
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      // Recalculate padding-right for the container to get card overlay right
      this.calculatePaddingRight(event.container.element.nativeElement as HTMLElement);
    } 
    // Dropped in different container from which it was dragged
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Recalculate padding-right for both containers to get card overlay right
      this.calculatePaddingRight(
        event.previousContainer.element.nativeElement as HTMLElement,
        -1
      );
      this.calculatePaddingRight(
        event.container.element.nativeElement as HTMLElement,
        1
      );

      const pieceID = event.container.data[event.currentIndex].id;

      if (event.previousContainer.element.nativeElement.classList.contains('deck')) {
        const action =
        {
          type: ActionType.TakeTurn,
          turn: {
            actionId: '',
            pieceId: pieceID,
            takingFromId: event.previousContainer.id
          } as TakeTurn,
          player: this.websocketService.gameState.playerStates.find(
                    (player) => player.player.id === this.userService.playerId
                  )?.player as Player
        };

        this.websocketService.sendAction(
          action
        );
      }
      else {
        const action =
        {
          type: ActionType.PlacementTurn,
          turn: {
            actionId: '',
            pieceId: pieceID,
            targetId: event.container.id
          } as PlacementTurn,
          player: this.websocketService.gameState.playerStates.find(
                    (player) => player.player.id === this.userService.playerId
                  )?.player as Player
        }

        this.websocketService.sendAction(
          action
        );
      }
    }  
  }

  calculatePaddingRight(cardPlace: HTMLElement, numCardsAdjustment: number = 0) {
    const cards = cardPlace.querySelectorAll('.card');
    const numCards = cards.length + numCardsAdjustment;

    if (numCards <= 1) {
      return;
    }

    let paddingRight = 10;

    const cardWidth = cards[0].clientWidth;
    const cardPlaceWidth = cardPlace.clientWidth;
    if (numCards * cardWidth >= window.innerWidth) {
      paddingRight = (cardPlaceWidth - (numCards * cardWidth)) / (-numCards + 1) + 20;
    }

    cardPlace.style.paddingRight = `${paddingRight}px`;
  }
}
