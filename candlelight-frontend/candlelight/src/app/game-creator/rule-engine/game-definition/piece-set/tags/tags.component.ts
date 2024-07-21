import { NgForOf } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Tag, TagComponent } from './tag/tag.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    NgForOf,
    TagComponent
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {

  private nextKey = 1;
  componentKeys: number[] = [];

  private _tags: Record<string, string> = {};

  @ViewChildren(TagComponent)
  private components!: QueryList<TagComponent>;

  @Input()
  set tags(tags: Record<string, string>) {
    this._tags = tags;
    if (!this.componentKeys.length) {
      this.loadChildren();
    }
  }

  findMatchingTag(i: number): Tag {
    const existingTags = this._tags;
    const tagKeys = Object.keys(existingTags);
    const tagValues = Object.values(existingTags);
    if (i < tagKeys.length) {
      return [tagKeys[i], tagValues[i]];
    } else {
      return ['', ''];
    }
  }

  addComponent(): void {
    this.componentKeys.push(this.nextKey++);
  }

  removeComponent(key: number): void {
    this.componentKeys = this.componentKeys.filter(k => k !== key);
  }

  mapFormsToTags(): Record<string, string> {
    const tags = this.components.map(c => c.mapFormToTag());
    const isEmptyTag = (tag: Tag) => tag[0].trim() === '' || tag[1].trim() === '';
    return Object.fromEntries(tags.filter(t => !isEmptyTag(t)));
  }

  loadChildren(): void {
    const existingTags = this._tags;
    const tagKeys = Object.keys(existingTags);
    tagKeys.forEach(_ => this.addComponent());
  }
}
