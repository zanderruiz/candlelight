import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TradeAction, emptyTradeAction } from '../../../../../../models/action';
import { GameDefinitionStateService } from '../../../game-definition-state.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-trade',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './action-set-trade.component.html',
  styleUrl: './action-set-trade.component.css'
})
export class ActionSetTradeComponent {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _trade: TradeAction = emptyTradeAction();

  readonly tradeForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    allowedResources: new FormControl<ReadonlyArray<string>>([]),
    maximumAllowedChange: new FormControl<number>(0),
    enforceMaximumAllowedChange: new FormControl<boolean>(false),
    minimumAllowedChange: new FormControl<number>(0),
    enforceMinimumAllowedChange: new FormControl<boolean>(false)
  });

  readonly availableResources = this.gameDefinitionStateService.game.resources;

  get key(): string {
    return this._trade.id;
  }

  get trade(): TradeAction {
    return this._trade;
  }

  @Input()
  set trade(trade: TradeAction) {
    this._trade = trade;
    this.loadFormState(trade);
  }

  mapFormToTrade(): TradeAction {
    const form = this.tradeForm.getRawValue();
    return {
      id: this._trade.id,
      name: form.name,
      allowedResources: form.allowedResources,
      maximumAllowedChange: form.maximumAllowedChange,
      enforceMaximumAllowedChange: form.enforceMaximumAllowedChange,
      minimumAllowedChange: form.minimumAllowedChange,
      enforceMinimumAllowedChange: form.enforceMinimumAllowedChange
    };
  }

  loadFormState(trade: TradeAction): void {
    this.tradeForm.setValue({
      name: trade.name,
      allowedResources: trade.allowedResources,
      maximumAllowedChange: trade.maximumAllowedChange,
      enforceMaximumAllowedChange: trade.enforceMaximumAllowedChange,
      minimumAllowedChange: trade.minimumAllowedChange,
      enforceMinimumAllowedChange: trade.enforceMinimumAllowedChange
    });
  }

}
