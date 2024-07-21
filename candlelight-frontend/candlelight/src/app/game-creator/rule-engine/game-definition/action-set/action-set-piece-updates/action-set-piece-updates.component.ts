import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { PieceUpdateAction, emptyPieceUpdateAction } from '../../../../../models/action';
import { ActionSetPieceUpdateComponent } from './action-set-piece-update/action-set-piece-update.component';
import { generateNextId } from '../../../../../util/IdGeneration';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-piece-updates',
  standalone: true,
  imports: [
    ActionSetPieceUpdateComponent,
    NgForOf
  ],
  templateUrl: './action-set-piece-updates.component.html',
  styleUrl: './action-set-piece-updates.component.css'
})
export class ActionSetPieceUpdatesComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _pieceUpdates: PieceUpdateAction[] = [];

  @ViewChildren(ActionSetPieceUpdateComponent)
  private components!: QueryList<ActionSetPieceUpdateComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get pieceUpdates(): ReadonlyArray<PieceUpdateAction> {
    return this._pieceUpdates;
  }

  addComponent(pieceUpdateAction: PieceUpdateAction = emptyPieceUpdateAction()): void {
    const nextId = generateNextId([pieceUpdateAction].concat(this._pieceUpdates));
    this._pieceUpdates.push({
      ...pieceUpdateAction,
      id: pieceUpdateAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._pieceUpdates = this._pieceUpdates.filter(k => k.id !== key);
  }

  mapFormsToPieceUpdates(): ReadonlyArray<PieceUpdateAction> {
    return this.components.map(c => c.mapFormToPieceUpdate());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        pieceUpdates: this.mapFormsToPieceUpdates()
      }
    };
  }

  loadChildren(): void {
    const existingPieceUpdates = this.gameDefinitionStateService.game.actions.pieceUpdates;
    existingPieceUpdates.forEach(pieceUpdate => this.addComponent(pieceUpdate));
  }
}
