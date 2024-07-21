import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CdkDrag,
    NgIf
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() value?: number = undefined;
  @Input() classes: string = '';
  @Input() tags?: Record<string, string> = undefined;
  styles = "";

  ngOnInit() {
    if (this.tags && this.tags.hasOwnProperty('color') && this.classes === '') {
      this.styles = `background: ${this.tags['color']}`;
    }
  }
}
