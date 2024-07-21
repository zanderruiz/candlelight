import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type Tag = [
  key: string,
  value: string
];

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {
  @Input()
  key: number = 0;
  
  private _tag: Tag = ['', ''];
  private initialized = false;

  readonly tagForm: FormGroup = new FormGroup({
    key: new FormControl<string>(''),
    value: new FormControl<string>('')
  });

  @Input()
  set tag(tag: Tag) {
    this._tag = tag;
    if (!this.initialized) {
      this.loadFormState(tag);
    }
  }

  mapFormToTag(): Tag {
    const form = this.tagForm.getRawValue();
    return [`${form.key}`, `${form.value}`];
  }

  loadFormState(tag: Tag): void {
    this.initialized = true;
    this.tagForm.setValue({
      key: tag[0],
      value: tag[1]
    });
  }
}
