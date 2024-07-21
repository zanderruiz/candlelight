import {Component, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgForOf} from "@angular/common";
import {GameDefinitionStateService} from "../../game-definition-state.service";
import {Deck, emptyDeck} from "../../../../../models/piece";
import {PieceSetDeckComponent} from "./piece-set-deck/piece-set-deck.component";
import { generateNextId } from '../../../../../util/IdGeneration';

@Component({
  selector: 'app-piece-set-decks',
  standalone: true,
  imports: [
    NgForOf,
    PieceSetDeckComponent
  ],
  templateUrl: './piece-set-decks.component.html',
  styleUrl: './piece-set-decks.component.css'
})
export class PieceSetDecksComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _decks: Deck[] = [];

  @ViewChildren(PieceSetDeckComponent)
  private components!: QueryList<PieceSetDeckComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get decks(): ReadonlyArray<Deck> {
    return this._decks;
  }

  addComponent(deck: Deck = emptyDeck()): void {
    const nextId = generateNextId([deck].concat(this._decks));
    this._decks.push({
      ...deck,
      id: deck.id || nextId
    });
  }

  removeComponent(key: string | undefined): void {
    this._decks = this._decks.filter(k => k.id !== key);
  }

  mapFormsToDecks(): ReadonlyArray<Deck> {
    return this.components.map(c => c.mapFormToDeck());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      pieces: {
        ...this.gameDefinitionStateService.game.pieces,
        decks: this.mapFormsToDecks()
      }
    };
  }

  loadChildren(): void {
    const existingDecks = this.gameDefinitionStateService.game.pieces.decks;
    existingDecks.forEach(deck => this.addComponent(deck));
  }

}
