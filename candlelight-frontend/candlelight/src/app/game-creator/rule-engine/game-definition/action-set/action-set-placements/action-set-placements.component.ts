import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { ActionSetPlacementComponent } from './action-set-placement/action-set-placement.component';
import { PlacementAction, emptyPlacementAction } from '../../../../../models/action';
import { generateNextId } from '../../../../../util/IdGeneration';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-placements',
  standalone: true,
  imports: [
    ActionSetPlacementComponent,
    NgForOf
  ],
  templateUrl: './action-set-placements.component.html',
  styleUrl: './action-set-placements.component.css'
})
export class ActionSetPlacementsComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _placements: PlacementAction[] = [];

  @ViewChildren(ActionSetPlacementComponent)
  private components!: QueryList<ActionSetPlacementComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get placements(): ReadonlyArray<PlacementAction> {
    return this._placements;
  }

  addComponent(placementAction: PlacementAction = emptyPlacementAction()): void {
    const nextId = generateNextId([placementAction].concat(this._placements));
    this._placements.push({
      ...placementAction,
      id: placementAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._placements = this._placements.filter(k => k.id !== key);
  }

  mapFormsToPlacements(): ReadonlyArray<PlacementAction> {
    return this.components.map(c => c.mapFormToPlacement());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        placements: this.mapFormsToPlacements()
      }
    };
  }

  loadChildren(): void {
    const existingPlacements = this.gameDefinitionStateService.game.actions.placements;
    existingPlacements.forEach(placement => this.addComponent(placement));
  }
}
