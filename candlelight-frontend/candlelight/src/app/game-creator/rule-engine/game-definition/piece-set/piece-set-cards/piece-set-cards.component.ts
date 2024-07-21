import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { PieceSetCardComponent } from './piece-set-card/piece-set-card.component';
import { Card, emptyCard } from '../../../../../models/piece';
import { NgForOf } from '@angular/common';
import { generateNextId } from '../../../../../util/IdGeneration';

@Component({
  selector: 'app-piece-set-cards',
  standalone: true,
  imports: [
    NgForOf,
    PieceSetCardComponent
  ],
  templateUrl: './piece-set-cards.component.html',
  styleUrl: './piece-set-cards.component.css'
})
export class PieceSetCardsComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _cards: Card[] = [];

  @ViewChildren(PieceSetCardComponent)
  private components!: QueryList<PieceSetCardComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get cards(): ReadonlyArray<Card> {
    return this._cards;
  }

  addComponent(card: Card = emptyCard()): void {
    const nextId = generateNextId([card].concat(this._cards));
    this._cards.push({
      ...card,
      id: card.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._cards = this._cards.filter(k => k.id !== key);
  }

  mapFormsToCards(): ReadonlyArray<Card> {
    return this.components.map(c => c.mapFormToCard());
  }

  confirm(): void {
    this.gameDefinitionStateService.cards = this.mapFormsToCards();
  }

  loadChildren(): void {
    const existingCards = this.gameDefinitionStateService.cards;
    existingCards.forEach(card => this.addComponent(card));
  }
}
