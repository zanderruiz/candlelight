import {Component, inject, Input, ViewChild} from '@angular/core';
import {Card, Deck, emptyDeck} from "../../../../../../models/piece";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TagsComponent} from "../../tags/tags.component";
import {GameDefinitionStateService} from "../../../game-definition-state.service";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-piece-set-deck',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    TagsComponent
  ],
  templateUrl: './piece-set-deck.component.html',
  styleUrl: './piece-set-deck.component.css'
})
export class PieceSetDeckComponent {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  @ViewChild(TagsComponent)
  private tagsComponent!: TagsComponent;

  private _deck: Deck = emptyDeck();

  private cards: ReadonlyArray<Card> = [];
  readonly deckForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    cards: new FormControl<ReadonlyArray<string>>([])
  });

  readonly availableCards = this.gameDefinitionStateService.cards;

  get key(): string {
    return this._deck.id;
  }

  get deck(): Deck {
    return this._deck;
  }

  @Input()
  set deck(deck: Deck) {
    this._deck = deck;
    this.cards = deck.cards;
    this.loadFormState(deck);
  }

  mapFormToDeck(): Deck {
    const form = this.deckForm.getRawValue();
    const formCards: ReadonlyArray<Card> = form.cards
      .map((c: string) => this.availableCards.find(card => card.id === c))
      .filter((c: Card | undefined) => c !== undefined);
    return {
      id: this._deck.id,
      name: form.name,
      tags: this.tagsComponent.mapFormsToTags(),
      cards: formCards
    };
  }

  loadFormState(deck: Deck): void {
    this.deckForm.setValue({
      name: deck.name,
      cards: deck.cards.map(c => c.id)
    });
  }

}
