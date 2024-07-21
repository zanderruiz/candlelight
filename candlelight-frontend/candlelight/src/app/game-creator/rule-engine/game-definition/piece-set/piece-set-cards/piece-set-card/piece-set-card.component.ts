import { Component, Input, ViewChild } from '@angular/core';
import { Card, emptyCard } from '../../../../../../models/piece';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagsComponent } from '../../tags/tags.component';

@Component({
  selector: 'app-piece-set-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TagsComponent
  ],
  templateUrl: './piece-set-card.component.html',
  styleUrl: './piece-set-card.component.css'
})
export class PieceSetCardComponent {
  private _card: Card = emptyCard();

  @ViewChild(TagsComponent)
  private tagsComponent!: TagsComponent;

  readonly cardForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    value: new FormControl<number>(0)
  });

  get key(): string {
    return this._card.id;
  }

  get card(): Card {
    return this._card;
  }

  @Input()
  set card(card: Card) {
    this._card = card;
    this.loadFormState(card);
  }

  mapFormToCard(): Card {
    const form = this.cardForm.getRawValue();
    return {
      id: this._card.id,
      name: form.name,
      tags: this.tagsComponent.mapFormsToTags(),
      description: form.description,
      value: form.value
    };
  }

  loadFormState(card: Card): void {
    this.cardForm.setValue({
      name: card.name,
      description: card.description,
      value: card.value
    });
  }

}
