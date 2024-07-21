import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PieceSetCardsComponent } from './piece-set-cards/piece-set-cards.component';
import {PieceSetCardPlacesComponent} from "./piece-set-card-places/piece-set-card-places.component";
import {PieceSetDecksComponent} from "./piece-set-decks/piece-set-decks.component";

enum PieceSetType {
  Cards = "Cards",
  Decks = "Decks",
  CardPlaces = "Card Places"
}

@Component({
  selector: 'app-piece-set',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    PieceSetCardsComponent,
    PieceSetCardPlacesComponent,
    PieceSetDecksComponent
  ],
  templateUrl: './piece-set.component.html',
  styleUrl: './piece-set.component.css'
})
export class PieceSetComponent {
  readonly pieceSetType = PieceSetType;
  readonly pieceSetTypes: ReadonlyArray<PieceSetType> = Object.values(PieceSetType);

  private readonly router = inject(Router);

  @ViewChild(PieceSetCardsComponent)
  private pieceSetCardsComponent?: PieceSetCardsComponent;
  @ViewChild(PieceSetDecksComponent)
  private pieceSetDecksComponent?: PieceSetDecksComponent;
  @ViewChild(PieceSetCardPlacesComponent)
  private pieceSetCardPlacesComponent?: PieceSetCardPlacesComponent;

  pieceSetTypeView: PieceSetType = PieceSetType.Cards;

  selectView(pieceSetType: PieceSetType): void {
    this.confirm();
    this.pieceSetTypeView = pieceSetType;
  }

  confirm(): void {
    this.pieceSetCardsComponent?.confirm();
    this.pieceSetDecksComponent?.confirm();
    this.pieceSetCardPlacesComponent?.confirm();
  }

  goToGameDefinition(): void {
    this.confirm();
    this.router.navigate(['/rule-engine']);
  }
}
