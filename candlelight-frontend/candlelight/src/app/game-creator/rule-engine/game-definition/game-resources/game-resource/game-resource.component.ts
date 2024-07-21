import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameResource } from '../../../../../models/game';

@Component({
  selector: 'app-game-resource',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './game-resource.component.html',
  styleUrl: './game-resource.component.css'
})
export class GameResourceComponent {
  @Input()
  key: number = 0;

  readonly resourceForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    initialValue: new FormControl<number>(0),
    maxValue: new FormControl<number>(0),
    minValue: new FormControl<number>(0)
  });

  constructor() {
    this.resourceForm.valueChanges.subscribe(_ => this.mapFormToGameResource.bind(this.resourceForm));
  }

  mapFormToGameResource(): GameResource {
    const form = this.resourceForm.getRawValue();
    return {
      id: this.key.toString(),
      name: form.name,
      description: form.description,
      initialValue: form.initialValue,
      maxValue: form.maxValue,
      minValue: form.minValue
    };
  }

  loadFormState(resource: GameResource): void {
    this.resourceForm.setValue({
      name: resource.name,
      description: resource.description,
      initialValue: resource.initialValue,
      maxValue: resource.maxValue,
      minValue: resource.minValue
    });
  }
}
