import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { ActionSetTakeComponent } from './action-set-take/action-set-take.component';
import { TakeAction, emptyTakeAction } from '../../../../../models/action';
import { generateNextId } from '../../../../../util/IdGeneration';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-takes',
  standalone: true,
  imports: [
    ActionSetTakeComponent,
    NgForOf
  ],
  templateUrl: './action-set-takes.component.html',
  styleUrl: './action-set-takes.component.css'
})
export class ActionSetTakesComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _takes: TakeAction[] = [];

  @ViewChildren(ActionSetTakeComponent)
  private components!: QueryList<ActionSetTakeComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get takes(): ReadonlyArray<TakeAction> {
    return this._takes;
  }

  addComponent(takeAction: TakeAction = emptyTakeAction()): void {
    const nextId = generateNextId([takeAction].concat(this._takes));
    this._takes.push({
      ...takeAction,
      id: takeAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._takes = this._takes.filter(k => k.id !== key);
  }

  mapFormsToTakes(): ReadonlyArray<TakeAction> {
    return this.components.map(c => c.mapFormToTake());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        takes: this.mapFormsToTakes()
      }
    };
  }

  loadChildren(): void {
    const existingTakes = this.gameDefinitionStateService.game.actions.takes;
    existingTakes.forEach(take => this.addComponent(take));
  }

}
