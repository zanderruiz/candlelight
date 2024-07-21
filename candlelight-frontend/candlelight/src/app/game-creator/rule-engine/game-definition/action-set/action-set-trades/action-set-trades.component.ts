import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { TradeAction, emptyTradeAction } from '../../../../../models/action';
import { generateNextId } from '../../../../../util/IdGeneration';
import { ActionSetTradeComponent } from './action-set-trade/action-set-trade.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-trades',
  standalone: true,
  imports: [
    ActionSetTradeComponent,
    NgForOf,
  ],
  templateUrl: './action-set-trades.component.html',
  styleUrl: './action-set-trades.component.css'
})
export class ActionSetTradesComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _trades: TradeAction[] = [];

  @ViewChildren(ActionSetTradeComponent)
  private components!: QueryList<ActionSetTradeComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get trades(): ReadonlyArray<TradeAction> {
    return this._trades;
  }

  addComponent(tradeAction: TradeAction = emptyTradeAction()): void {
    const nextId = generateNextId([tradeAction].concat(this._trades));
    this._trades.push({
      ...tradeAction,
      id: tradeAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._trades = this._trades.filter(k => k.id !== key);
  }

  mapFormsToTrades(): ReadonlyArray<TradeAction> {
    return this.components.map(c => c.mapFormToTrade());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        trades: this.mapFormsToTrades()
      }
    };
  }

  loadChildren(): void {
    const existingTrades = this.gameDefinitionStateService.game.actions.trades;
    existingTrades.forEach(trade => this.addComponent(trade));
  }

}
