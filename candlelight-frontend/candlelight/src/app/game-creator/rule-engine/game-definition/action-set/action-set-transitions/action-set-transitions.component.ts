import { NgForOf } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { GameDefinitionStateService } from '../../game-definition-state.service';
import { TransitionAction, emptyTransitionAction } from '../../../../../models/action';
import { ActionSetTransitionComponent } from './action-set-transition/action-set-transition.component';
import { generateNextId } from '../../../../../util/IdGeneration';

@Component({
  selector: 'app-action-set-transitions',
  standalone: true,
  imports: [
    ActionSetTransitionComponent,
    NgForOf
  ],
  templateUrl: './action-set-transitions.component.html',
  styleUrl: './action-set-transitions.component.css'
})
export class ActionSetTransitionsComponent implements OnInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  private _transitions: TransitionAction[] = [];

  @ViewChildren(ActionSetTransitionComponent)
  private components!: QueryList<ActionSetTransitionComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  get transitions(): ReadonlyArray<TransitionAction> {
    return this._transitions;
  }

  addComponent(transitionAction: TransitionAction = emptyTransitionAction()): void {
    const nextId = generateNextId([transitionAction].concat(this._transitions));
    this._transitions.push({
      ...transitionAction,
      id: transitionAction.id || nextId
    });
  }

  removeComponent(key: string): void {
    this._transitions = this._transitions.filter(k => k.id !== key);
  }

  mapFormsToTransitions(): ReadonlyArray<TransitionAction> {
    return this.components.map(c => c.mapFormToTransition());
  }

  confirm(): void {
    this.gameDefinitionStateService.game = {
      ...this.gameDefinitionStateService.game,
      actions: {
        ...this.gameDefinitionStateService.game.actions,
        transitions: this.mapFormsToTransitions()
      }
    };
  }

  loadChildren(): void {
    const existingTransitions = this.gameDefinitionStateService.game.actions.transitions;
    existingTransitions.forEach(transition => this.addComponent(transition));
  }

}
