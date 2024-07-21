import { AfterViewInit, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { MoveAction, emptyMoveAction } from '../../../../../../models/action';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { emptyPieceSet } from '../../../../../../models/piece';
import { PieceSubsetComponent } from '../../../piece-subset/piece-subset.component';

@Component({
  selector: 'app-action-set-move',
  standalone: true,
  imports: [
    PieceSubsetComponent,
    ReactiveFormsModule
  ],
  templateUrl: './action-set-move.component.html',
  styleUrl: './action-set-move.component.css'
})
export class ActionSetMoveComponent implements AfterViewInit {
  @ViewChildren(PieceSubsetComponent)
  private pieceSubsetComponents?: QueryList<PieceSubsetComponent>;

  private _move: MoveAction = emptyMoveAction();

  readonly moveForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    numPieces: new FormControl<number>(0),
    flipAllowedPieces: new FormControl<boolean>(false),
    flipAllowedTargets: new FormControl<boolean>(false),
  });

  ngAfterViewInit(): void {
    this.loadChildrenFormStates(this._move, this.pieceSubsetComponents!);
  }

  get key(): string {
    return this._move.id;
  }

  get move(): MoveAction {
    return this._move;
  }

  @Input()
  set move(move: MoveAction) {
    this._move = move;
    this.loadFormState(move);
  }

  mapFormToMove(): MoveAction {
    const form = this.moveForm.getRawValue();
    const allowedPieces = this.pieceSubsetComponents?.first?.mapFormToPieceSet() || emptyPieceSet();
    const allowedTargets = this.pieceSubsetComponents?.last?.mapFormToPieceSet() || emptyPieceSet();
    return {
      id: this._move.id,
      name: form.name,
      numPieces: form.numPieces,
      allowedPieces,
      allowedTargets,
      flipAllowedPieces: form.flipAllowedPieces,
      flipAllowedTargets: form.flipAllowedTargets
    };
  }

  loadFormState(move: MoveAction): void {
    this.moveForm.setValue({
      name: move.name,
      numPieces: move.numPieces,
      flipAllowedPieces: move.flipAllowedPieces,
      flipAllowedTargets: move.flipAllowedTargets
    });
  }

  private loadChildrenFormStates(move: MoveAction, children: QueryList<PieceSubsetComponent>): void {
    children.forEach((c, index) =>
      c.loadFormState(index == 0 ? move.allowedPieces : move.allowedTargets));
  }
}
