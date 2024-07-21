import { Injectable } from '@angular/core';
import { Game, emptyGame } from '../../../models/game';
import {Card, emptyCard} from '../../../models/piece';

interface GameWithCards {
  cards: ReadonlyArray<Card>;
  game: Game;
}

function emptyGameWithCards() {
  return {
    cards: [],
    game: emptyGame()
  };
}

@Injectable({
  providedIn: 'root'
})
export class GameDefinitionStateService {
  private static readonly sessionStorageKey = 'candlelight-game-definition';

  private gameDefinition: GameWithCards = this.loadGameOrDefault();

  static selectCardsFromGame(game: Game): ReadonlyArray<Card> {
    const cpCards = game.pieces.cardPlaces.flatMap(cp => cp.placedCards);
    const deckCards = game.pieces.decks.flatMap(deck => deck.cards);
    const allCards = [...cpCards, ...deckCards];
    // return a Card array of both combined and unique by id
    const uniqueIds = new Set<string>(allCards.map(c => c.id));
    return Array.from(uniqueIds)
      .map(id => allCards.find(c => c.id === id) || emptyCard())
      .filter(c => !!c.id);
  }

  get game(): Game {
    return this.gameDefinition.game;
  }

  get cards(): ReadonlyArray<Card> {
    return this.gameDefinition.cards;
  }

  set game(game: Game) {
    this.setValue({...this.gameDefinition, game});
  }

  set cards(cards: ReadonlyArray<Card>) {
    this.setValue({...this.gameDefinition, cards});
  }

  clear(): void {
    sessionStorage.removeItem(GameDefinitionStateService.sessionStorageKey);
    this.gameDefinition = emptyGameWithCards();
  }

  private setValue(gameWithCards: GameWithCards): void {
    const str = JSON.stringify(gameWithCards);
    sessionStorage.setItem(GameDefinitionStateService.sessionStorageKey, str);
    this.gameDefinition = this.loadGameOrDefault();
  }

  private loadGameOrDefault(): GameWithCards {
    const existing = sessionStorage.getItem(GameDefinitionStateService.sessionStorageKey);
    return existing && JSON.parse(existing) || emptyGameWithCards();
  }
}
