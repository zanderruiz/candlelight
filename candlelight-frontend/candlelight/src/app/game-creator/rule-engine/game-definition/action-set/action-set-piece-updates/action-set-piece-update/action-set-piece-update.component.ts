import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { PieceSubsetComponent } from '../../../piece-subset/piece-subset.component';
import { PieceUpdateAction, emptyPieceUpdateAction } from '../../../../../../models/action';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagsComponent } from '../../../piece-set/tags/tags.component';

@Component({
  selector: 'app-action-set-piece-update',
  standalone: true,
  imports: [
    PieceSubsetComponent,
    ReactiveFormsModule,
    TagsComponent
  ],
  templateUrl: './action-set-piece-update.component.html',
  styleUrl: './action-set-piece-update.component.css'
})
export class ActionSetPieceUpdateComponent implements AfterViewInit {
  @ViewChild(PieceSubsetComponent)
  private pieceSubsetComponent!: PieceSubsetComponent;
  @ViewChild(TagsComponent)
  private tagsComponent!: TagsComponent;

  private _pieceUpdate: PieceUpdateAction = emptyPieceUpdateAction();

  readonly pieceUpdateForm: FormGroup = new FormGroup({
    name: new FormControl<string>('')
  });

  ngAfterViewInit(): void {
    this.pieceSubsetComponent!.loadFormState(this._pieceUpdate.targetPieces);
  }

  get key(): string {
    return this._pieceUpdate.id;
  }

  get pieceUpdate(): PieceUpdateAction {
    return this._pieceUpdate;
  }

  @Input()
  set pieceUpdate(pieceUpdate: PieceUpdateAction) {
    this._pieceUpdate = pieceUpdate;
    this.loadFormState(pieceUpdate);
  }

  mapFormToPieceUpdate(): PieceUpdateAction {
    const form = this.pieceUpdateForm.getRawValue();
    return {
      id: this._pieceUpdate.id,
      name: form.name,
      targetPieces: this.pieceSubsetComponent!.mapFormToPieceSet(),
      tagUpdates: this.tagsComponent.mapFormsToTags()
    };
  }

  loadFormState(pieceUpdate: PieceUpdateAction): void {
    this.pieceUpdateForm.setValue({
      name: pieceUpdate.name
    });
  }

}
