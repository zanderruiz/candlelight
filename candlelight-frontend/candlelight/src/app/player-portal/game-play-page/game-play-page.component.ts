import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  CdkDragEnter,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';
import { CardPlaceComponent } from './card-place/card-place.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DeckComponent } from './deck/deck.component';
import { GameInfoBarComponent } from './game-info-bar/game-info-bar.component';
import dummyGameData from './dummy-game-data.json';
import { Card, CardPlace, Deck, GamePiece } from '../../models/piece';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { GamePlayService } from '../game-play.service';
import { WebSocketResponse, WebsocketService } from '../../data/websocket/websocket.service';
import { UserService } from '../../data/user/user.service';
import { Observable, interval, map, merge, of, takeUntil } from 'rxjs';
import { GameState } from '../../models/session';
import { Player } from '../../models/player';
import { Router } from '@angular/router';

interface View {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-game-play-page',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CardComponent,
    CardPlaceComponent,
    NavigationComponent,
    DeckComponent,
    GameInfoBarComponent,
    AsyncPipe,
    NgFor,
    NgIf
  ],
  templateUrl: './game-play-page.component.html',
  styleUrl: './game-play-page.component.css'
})
export class GamePlayPageComponent implements OnInit, AfterViewInit {
  gameName: string = 'UNE!';
  roomCode: string = 'BRUH';
  playerName: string = 'UNGABUNGA';
  readonly cardPlaceArrays: Map<string, Card[]> = new Map<string, Card[]>();
  readonly deckArrays: Map<string, Card[]> = new Map<string, Card[]>();
  readonly playerHandArrays: Map<string, Card[]> = new Map<string, Card[]>();

  private readonly websocketService: WebsocketService = inject(WebsocketService);
  private readonly userService: UserService = inject(UserService);

  readonly socketResponse$: Observable<WebSocketResponse> = merge(
    of(this.websocketService.gameState as WebSocketResponse),
    this.websocketService.subject$
  );

  // Decks information
  readonly decks$: Observable<ReadonlyArray<Deck>> = this.socketResponse$.pipe(
    map((response: WebSocketResponse) => {
      return this.websocketService.gameState.gamePieces.decks;
    }));

  updateDeckArrays(
    decks: ReadonlyArray<Deck>
  ): void {
    decks.forEach(deck => {
      const deckArray = this.deckArrays.get(deck.id);
      // Pop everything from the deckArray
      deckArray!!.length = 0;

      // Push all the cards from the deck into the deckArray
      deck.cards.forEach(card => {
        deckArray!!.push(card as Card);
      });
    });
  }

  // Card places information
  readonly cardPlaces$: Observable<ReadonlyArray<CardPlace>> = this.socketResponse$.pipe(
    map((response: WebSocketResponse) => {
      return this.websocketService.gameState.gamePieces.cardPlaces;
    }));

  getReadonlyCardsAsCardArray(deck: readonly Card[]): Card[] {
    // Using map to transform each ReadOnly<Card> into a Card
    return deck.map(readonlyCard => readonlyCard as Card);
  }

  updateCardPlaceArrays(
    cardPlaces: ReadonlyArray<CardPlace>
  ): void {
    cardPlaces.forEach(cardPlace => {
      const cardPlaceArray = this.cardPlaceArrays.get(cardPlace.id);
      // Pop everything from the cardPlaceArray
      cardPlaceArray!!.length = 0;

      // Push all the cards from the cardPlace into the cardPlaceArray
      cardPlace.placedCards.forEach(card => {
        cardPlaceArray!!.push(card as Card);
      });
    });
  }

  // Curr player information
  readonly currPlayer$: Observable<string> = this.socketResponse$.pipe(
    map((response: WebSocketResponse) => {
      return this.userService.playerName;
    }));

  // All players information
  readonly players$: Observable<ReadonlyArray<Player>> = this.socketResponse$.pipe(
    map((response: WebSocketResponse) => {
      return this.websocketService.gameState.playerStates
      .map(playerState => playerState.player);
    }));

  playerIsCurrPlayer(player: Player): boolean {
    return player.id === this.userService.playerId;
  }

  updatePlayerHandArrays(players: ReadonlyArray<Player>): void {
    console.log("Players object:", players)
    console.log("Current playerHandArrays:", this.playerHandArrays)
    players.forEach(player => {
      const playerHandArray = this.playerHandArrays.get(player.id + player.hand.decks[0].id);
      console.log(player.name + 's hand array before:', playerHandArray);
      // Pop everything from the playerHandArray
      playerHandArray!!.length = 0;

      // Push all the cards from the player's hand into the playerHandArray
      player.hand.decks[0].cards.forEach(card => {
        playerHandArray!!.push(card as Card);
      });
      console.log(player.name + 's hand array after:', playerHandArray);
    });
  }

  constructor() {
    this.gameName = this.websocketService.lobby.gameName || 'GAME NAME FROM NAV FAILED';
  }

  ngOnInit(): void {
    console.log(dummyGameData);
    console.log("INIT GAME STATE:", this.websocketService.gameState);
    console.log("PLAYER:",
    {
      playerName: this.userService.playerName ,
      playerId: this.userService.playerId
    });

    // Give the game-play-page element a height of 100vh minus the navbar height and offset by the navbar height
    const navbarElement = document.querySelector('.navbar');
    const navbarHeight = navbarElement ? (navbarElement as HTMLElement).offsetHeight : 0;
    const gamePlayPageElement = document.querySelector('.game-play-page');
    if (gamePlayPageElement) {
      (gamePlayPageElement as HTMLElement).style.height = `calc(100vh - ${navbarHeight}px)`;
      (gamePlayPageElement as HTMLElement).style.top = `${navbarHeight}px`;
    }

    const outermostBody = document.querySelector('.outermost-body');
    if (outermostBody) {
      (outermostBody as HTMLElement).style.overflow = 'hidden';
    }

    this.createCardArrays();

    setInterval(() => {
      this.websocketService.sendEmpty();
    }, 1000);
  }

  ngAfterViewInit(): void {
    // Subscribe all card places, decks, and player hands to update their arrays
    this.cardPlaces$.subscribe((decks$) =>
      this.updateCardPlaceArrays(decks$)
    );
    this.decks$.subscribe((decks$) =>
      this.updateDeckArrays(decks$)
    );
    this.players$.subscribe((decks$) =>
      this.updatePlayerHandArrays(decks$)
    );

    // Debugging console log to see if we receive a new game state
    this.socketResponse$.subscribe((response: WebSocketResponse) => {
      console.log('Received new game state:', response);
    });
  }

  // Reset the overflow of the outermost body element to auto when the page is destroyed
  // That way, scrolling is enabled again on other pages on the site.
  ngOnDestroy(): void {
    const outermostBody = document.querySelector('.outermost-body');
    if (outermostBody) {
      (outermostBody as HTMLElement).style.overflow = 'auto';
    }
  }

  createCardArrays(): void {
    for (const cardPlace of this.websocketService.gameState.gamePieces.cardPlaces) {
      this.cardPlaceArrays.set(
        cardPlace.id,
        this.getReadonlyCardsAsCardArray(cardPlace.placedCards)
      );
    }
    for (const deck of this.websocketService.gameState.gamePieces.decks) {
      this.deckArrays.set(
        deck.id,
        this.getReadonlyCardsAsCardArray(deck.cards)
      );
    }
    for (const playerState of this.websocketService.gameState.playerStates) {
      this.playerHandArrays.set(
        playerState.player.id + playerState.player.hand.decks[0].id,
        this.getReadonlyCardsAsCardArray(playerState.player.hand.decks[0].cards)
      );
    }
  }


  // parseGamePieceData(data: any): Card[] {
  //   if (data.game && data.game.Pieces && data.game.Pieces.Decks) {
  //       data.game.Pieces.Decks.forEach((deck: any) => {
  //           if (deck.Cards) {
  //               deck.Cards.forEach((card: any) => {
  //                   const newCard: Card = {
  //                       id: card.Id,
  //                       name: card.Name || '',
  //                       tags: card.Tags || {},
  //                       description: card.Description || '',
  //                       value: card.Value ? parseInt(card.Value, 10) : undefined // Assuming value is a number
  //                   };
  //                   this.deck.push(newCard);
  //               });
  //           }
  //       });
  //   }

  //   // Create the player hand as well

  //   // Subscribe to the card-place observable


  //   return this.deck;
  // }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  toPlayArea(event: CdkDragEnter<Card[]>) {
    const playerView = (document.querySelector('.player-view') as HTMLElement);
    const playAreaView = (document.querySelector('.play-area-view') as HTMLElement);

    playerView.style.zIndex = '0';
    playerView.style.visibility = 'hidden';
    playAreaView.style.zIndex = '1';
    playAreaView.style.visibility = 'visible';
  }

  toHand(event: CdkDragEnter<Card[]>) {
    const playerView = (document.querySelector('.player-view') as HTMLElement);
    const playAreaView = (document.querySelector('.play-area-view') as HTMLElement);

    playAreaView.style.zIndex = '0';
    playAreaView.style.visibility = 'hidden';
    playerView.style.zIndex = '1';
    playerView.style.visibility = 'visible';
  }
}
