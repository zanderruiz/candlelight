import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { TakeAction, emptyTakeAction } from '../../../../../../models/action';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PieceSubsetComponent } from '../../../piece-subset/piece-subset.component';

@Component({
  selector: 'app-action-set-take',
  standalone: true,
  imports: [
    PieceSubsetComponent,
    ReactiveFormsModule
  ],
  templateUrl: './action-set-take.component.html',
  styleUrl: './action-set-take.component.css'
})
export class ActionSetTakeComponent implements AfterViewInit {
  @ViewChild(PieceSubsetComponent)
  private pieceSubsetComponent!: PieceSubsetComponent;

  private _take: TakeAction = emptyTakeAction();

  readonly takeForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    num: new FormControl<number>(0),
    takeRandomly: new FormControl<boolean>(false)
  });

  ngAfterViewInit(): void {
    this.pieceSubsetComponent.loadFormState(this._take.takeFrom);
  }

  get key(): string {
    return this._take.id;
  }

  get take(): TakeAction {
    return this._take;
  }

  @Input()
  set take(take: TakeAction) {
    this._take = take;
    this.loadFormState(take);
  }

  mapFormToTake(): TakeAction {
    const form = this.takeForm.getRawValue();
    return {
      id: this._take.id,
      name: form.name,
      num: form.num,
      takeFrom: this.pieceSubsetComponent.mapFormToPieceSet(),
      takeRandomly: form.takeRandomly
    };
  }

  loadFormState(take: TakeAction): void {
    this.takeForm.setValue({
      name: take.name,
      num: take.num,
      takeRandomly: take.takeRandomly
    });
  }

}
