import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { MoveAction, emptyMoveAction } from '../../../../../models/action';
import { generateNextId } from '../../../../../util/IdGeneration';
import { NgForOf } from '@angular/common';
import { ActionSetMoveComponent } from './action-set-move/action-set-move.component';

@Component({
  selector: 'app-action-set-moves',
  standalone: true,
  imports: [
    ActionSetMoveComponent,
    NgForOf,
  ],
  templateUrl: './action-set-moves.component.html',
  styleUrl: './action-set-moves.component.css'
})
export class ActionSetMovesComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _moves: MoveAction[] = [];

  @ViewChildren(ActionSetMoveComponent)
  private components!: QueryList<ActionSetMoveComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get moves(): ReadonlyArray<MoveAction> {
    return this._moves;
  }

  addComponent(moveAction: MoveAction = emptyMoveAction()): void {
    const nextId = generateNextId([moveAction].concat(this._moves));
    this._moves.push({
      ...moveAction,
      id: moveAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._moves = this._moves.filter(k => k.id !== key);
  }

  mapFormsToMoves(): ReadonlyArray<MoveAction> {
    return this.components.map(c => c.mapFormToMove());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        moves: this.mapFormsToMoves()
      }
    };
  }

  loadChildren(): void {
    const existingMoves = this.gameDefinitionStateService.game.actions.moves;
    existingMoves.forEach(move => this.addComponent(move));
  }

}
