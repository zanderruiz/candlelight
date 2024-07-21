import { Component, Input, inject } from '@angular/core';
import { GameDefinitionStateService } from '../game-definition-state.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CardPlace, Deck, PieceSet, emptyCardPlace, emptyDeck } from '../../../../models/piece';

@Component({
  selector: 'app-piece-subset',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule
  ],
  templateUrl: './piece-subset.component.html',
  styleUrl: './piece-subset.component.css'
})
export class PieceSubsetComponent {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  @Input()
  label: string = '';
  @Input()
  key: number = 0;

  readonly availableDecks = this.gameDefinitionStateService.game.pieces.decks;
  readonly availableCardPlaces = this.gameDefinitionStateService.game.pieces.cardPlaces;

  readonly pieceSubsetForm: FormGroup = new FormGroup({
    decks: new FormControl<ReadonlyArray<string>>([]),
    cardPlaces: new FormControl<ReadonlyArray<string>>([])
  });

  @Input()
  set pieceSet(pieceSet: PieceSet) {
    const existingDecks = pieceSet.decks;
    const existingCardPlaces = pieceSet.cardPlaces;
    this.pieceSubsetForm.setValue({
      decks: this.filterToAvailableDecks(existingDecks),
      cardPlaces: this.filterToAvailableCardPlaces(existingCardPlaces),
    });
  }

  loadFormState(pieceSet: PieceSet): void {
    this.pieceSubsetForm.setValue({
      decks: pieceSet.decks.map(d => d.id),
      cardPlaces: pieceSet.cardPlaces.map(cp => cp.id)
    });
  }

  mapFormToPieceSet(): PieceSet {
    const form = this.pieceSubsetForm.getRawValue();
    const decks = form.decks.map((deckId: string) =>
      this.availableDecks.find(d => d.id === deckId) || emptyDeck());
    const cardPlaces = form.cardPlaces.map((cardPlaceId: string) =>
      this.availableCardPlaces.find(cp => cp.id === cardPlaceId) || emptyCardPlace());
    return {
      decks,
      cardPlaces
    };
  }

  private filterToAvailableDecks(existingDecks: ReadonlyArray<Deck>): ReadonlyArray<string> {
    return this.filterToAvailableItems(existingDecks, this.availableDecks);
  }

  private filterToAvailableCardPlaces(existingCardPlaces: ReadonlyArray<CardPlace>): ReadonlyArray<string> {
    return this.filterToAvailableItems(existingCardPlaces, this.availableCardPlaces);
  }

  private filterToAvailableItems<T extends { id: string }>(existingItems: ReadonlyArray<T>, availableItems: ReadonlyArray<T>): ReadonlyArray<string> {
    return existingItems
      .filter(ei => availableItems.find(ai => ai.id === ei.id))
      .map((item: T) => item.id);
  }
}
