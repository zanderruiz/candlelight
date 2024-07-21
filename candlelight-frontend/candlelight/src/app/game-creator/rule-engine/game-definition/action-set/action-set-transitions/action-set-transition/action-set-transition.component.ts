import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransitionAction, emptyTransitionAction } from '../../../../../../models/action';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-action-set-transition',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './action-set-transition.component.html',
  styleUrl: './action-set-transition.component.css'
})
export class ActionSetTransitionComponent {
  private _transition: TransitionAction = emptyTransitionAction();

  readonly transitionForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    newPhase: new FormControl<string>('')
  });

  get key(): string {
    return this._transition.id;
  }

  get transition(): TransitionAction {
    return this._transition;
  }

  @Input()
  set transition(transition: TransitionAction) {
    this._transition = transition;
    this.loadFormState(transition);
  }

  mapFormToTransition(): TransitionAction {
    const form = this.transitionForm.getRawValue();
    return {
      id: this._transition.id,
      name: form.name,
      newPhase: form.newPhase
    };
  }

  loadFormState(transition: TransitionAction): void {
    this.transitionForm.setValue({
      name: transition.name,
      newPhase: transition.newPhase
    });
  }

}
