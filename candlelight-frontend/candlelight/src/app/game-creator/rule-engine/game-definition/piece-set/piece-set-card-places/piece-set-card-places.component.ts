import { NgForOf } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CardPlace, emptyCardPlace } from '../../../../../models/piece';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { PieceSetCardPlaceComponent } from './piece-set-card-place/piece-set-card-place.component';
import { generateNextId } from '../../../../../util/IdGeneration';

@Component({
  selector: 'app-piece-set-card-places',
  standalone: true,
  imports: [
    NgForOf,
    PieceSetCardPlaceComponent
  ],
  templateUrl: './piece-set-card-places.component.html',
  styleUrl: './piece-set-card-places.component.css'
})
export class PieceSetCardPlacesComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _cardPlaces: CardPlace[] = [];

  @ViewChildren(PieceSetCardPlaceComponent)
  private components!: QueryList<PieceSetCardPlaceComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get cardPlaces(): ReadonlyArray<CardPlace> {
    return this._cardPlaces;
  }

  addComponent(cardPlace: CardPlace = emptyCardPlace()): void {
    const nextId = generateNextId([cardPlace].concat(this._cardPlaces));
    this._cardPlaces.push({
      ...cardPlace,
      id: cardPlace.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._cardPlaces = this._cardPlaces.filter(k => k.id !== key);
  }

  mapFormsToCardPlaces(): ReadonlyArray<CardPlace> {
    return this.components.map(c => c.mapFormToCardPlace());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      pieces: {
        ...this.gameDefinitionStateService.game.pieces,
        cardPlaces: this.mapFormsToCardPlaces()
      }
    };
  }

  loadChildren(): void {
    const existingCardPlaces = this.gameDefinitionStateService.game.pieces.cardPlaces;
    existingCardPlaces.forEach(cardPlace => this.addComponent(cardPlace));
  }

}
