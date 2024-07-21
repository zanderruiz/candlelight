import { Component, Input, ViewChild, inject } from '@angular/core';
import { Card, CardPlace, emptyCardPlace } from '../../../../../../models/piece';
import { TagsComponent } from '../../tags/tags.component';
import { GameDefinitionStateService } from '../../../game-definition-state.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-piece-set-card-place',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    TagsComponent
  ],
  templateUrl: './piece-set-card-place.component.html',
  styleUrl: './piece-set-card-place.component.css'
})
export class PieceSetCardPlaceComponent {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  @ViewChild(TagsComponent)
  private tagsComponent!: TagsComponent;

  private _cardPlace = emptyCardPlace();

  private cards: ReadonlyArray<Card> = [];
  readonly cardPlaceForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    cards: new FormControl<ReadonlyArray<string>>([]),
    owner: new FormControl<string>('')
  });

  readonly availableCards = this.gameDefinitionStateService.cards;

  get key(): string {
    return this._cardPlace.id;
  }

  get cardPlace(): CardPlace {
    return this._cardPlace;
  }

  @Input()
  set cardPlace(cardPlace: CardPlace) {
    this._cardPlace = cardPlace;
    this.loadFormState(cardPlace);
  }

  mapFormToCardPlace(): CardPlace {
    const form = this.cardPlaceForm.getRawValue();
    const formCards: ReadonlyArray<Card> = form.cards
      .map((c: string) => this.availableCards.find(card => card.id === c))
      .filter((c: Card | undefined) => c !== undefined);
    return {
      id: this._cardPlace.id,
      name: form.name,
      tags: this.tagsComponent.mapFormsToTags(),
      placedCards: formCards,
      owner: form.owner
    };
  }

  loadFormState(cardPlace: CardPlace): void {
    this.cardPlaceForm.setValue({
      name: cardPlace.name,
      cards: cardPlace.placedCards.map(c => c.id),
      owner: cardPlace.owner
    });
  }

}
