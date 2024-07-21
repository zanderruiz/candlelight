import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSetMovesComponent } from './action-set-moves/action-set-moves.component';
import { ActionSetTradesComponent } from './action-set-trades/action-set-trades.component';
import { ActionSetTransitionsComponent } from './action-set-transitions/action-set-transitions.component';
import { ActionSetTakesComponent } from './action-set-takes/action-set-takes.component';
import { ActionSetPlacementsComponent } from './action-set-placements/action-set-placements.component';
import { ActionSetPieceUpdatesComponent } from './action-set-piece-updates/action-set-piece-updates.component';

enum ActionSetType {
  MoveAction = "Moves",
  TradeAction = "Trades",
  TransitionAction = "Transitions",
  TakeAction = "Takes",
  PlacementAction = "Placements",
  PieceUpdateAction = "Piece Updates"
}

@Component({
  selector: 'app-action-set',
  standalone: true,
  imports: [
    ActionSetMovesComponent,
    ActionSetPieceUpdatesComponent,
    ActionSetPlacementsComponent,
    ActionSetTakesComponent,
    ActionSetTradesComponent,
    ActionSetTransitionsComponent,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './action-set.component.html',
  styleUrl: './action-set.component.css'
})
export class ActionSetComponent {
  readonly actionSetType = ActionSetType;
  readonly actionSetTypes: ReadonlyArray<ActionSetType> = Object.values(ActionSetType);

  private readonly router = inject(Router);

  @ViewChild(ActionSetMovesComponent)
  private actionSetMovesComponent?: ActionSetMovesComponent;
  @ViewChild(ActionSetTradesComponent)
  private actionSetTradesComponent?: ActionSetTradesComponent;
  @ViewChild(ActionSetTransitionsComponent)
  private actionSetTransitionsComponent?: ActionSetTransitionsComponent;
  @ViewChild(ActionSetTakesComponent)
  private actionSetTakesComponent?: ActionSetTakesComponent;
  @ViewChild(ActionSetPlacementsComponent)
  private actionSetPlacementsComponent?: ActionSetPlacementsComponent;
  @ViewChild(ActionSetPieceUpdatesComponent)
  private actionSetPieceUpdatesComponent?: ActionSetPieceUpdatesComponent;

  actionSetTypeView: ActionSetType = ActionSetType.MoveAction;

  selectView(actionSetType: ActionSetType): void {
    this.confirm();
    this.actionSetTypeView = actionSetType;
  }

  confirm(): void {
    this.actionSetMovesComponent?.confirm();
    this.actionSetTradesComponent?.confirm();
    this.actionSetTransitionsComponent?.confirm();
    this.actionSetTakesComponent?.confirm();
    this.actionSetPlacementsComponent?.confirm();
    this.actionSetPieceUpdatesComponent?.confirm();
  }

  goToGameDefinition(): void {
    this.confirm();
    this.router.navigate(['/rule-engine']);
  }
}
