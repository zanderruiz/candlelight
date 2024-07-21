import { AfterViewInit, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { PieceSubsetComponent } from '../../../piece-subset/piece-subset.component';
import { PlacementAction, emptyPlacementAction } from '../../../../../../models/action';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { emptyPieceSet } from '../../../../../../models/piece';

@Component({
  selector: 'app-action-set-placement',
  standalone: true,
  imports: [
    PieceSubsetComponent,
    ReactiveFormsModule
  ],
  templateUrl: './action-set-placement.component.html',
  styleUrl: './action-set-placement.component.css'
})
export class ActionSetPlacementComponent  implements AfterViewInit {
  @ViewChildren(PieceSubsetComponent)
  private pieceSubsetComponents?: QueryList<PieceSubsetComponent>;

  private _placement: PlacementAction = emptyPlacementAction();

  readonly placementForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    num: new FormControl<number>(0),
    flipAllowedPieces: new FormControl<boolean>(false),
    flipAllowedTargets: new FormControl<boolean>(false),
    placeRandomly: new FormControl<boolean>(false)
  });

  ngAfterViewInit(): void {
    this.loadChildrenFormStates(this._placement, this.pieceSubsetComponents!);
  }

  get key(): string {
    return this._placement.id;
  }

  get placement(): PlacementAction {
    return this._placement;
  }

  @Input()
  set placement(placement: PlacementAction) {
    this._placement = placement;
    this.loadFormState(placement);
  }

  mapFormToPlacement(): PlacementAction {
    const form = this.placementForm.getRawValue();
    const allowedPieces = this.pieceSubsetComponents?.first?.mapFormToPieceSet() || emptyPieceSet();
    const allowedTargets = this.pieceSubsetComponents?.last?.mapFormToPieceSet() || emptyPieceSet();
    return {
      id: this._placement.id,
      name: form.name,
      num: form.num,
      allowedPieces,
      allowedTargets,
      flipAllowedPieces: form.flipAllowedPieces,
      flipAllowedTargets: form.flipAllowedTargets,
      placeRandomly: form.placeRandomly
    };
  }

  loadFormState(placement: PlacementAction): void {
    this.placementForm.setValue({
      name: placement.name,
      num: placement.num,
      flipAllowedPieces: placement.flipAllowedPieces,
      flipAllowedTargets: placement.flipAllowedTargets,
      placeRandomly: placement.placeRandomly
    });
  }

  private loadChildrenFormStates(placement: PlacementAction, children: QueryList<PieceSubsetComponent>): void {
    children.forEach((c, index) =>
      c.loadFormState(index == 0 ? placement.allowedPieces : placement.allowedTargets));
  }
}
