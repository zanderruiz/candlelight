import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Card } from '../../../models/piece';
import { 
  CdkDrag, 
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  @Input() text: string = '';
  @Input() classes: string = '';

  // Element classes for the host and destination views
  // These will be the divs holding the views
  @Input() hostViewClass: string = '';
  @Input() destinationViewClass: string = '';
  // hostView: HTMLElement | null = null;
  // destinationView: HTMLElement | null = null;

  // Timer to make navigating on hovering a draggable item work
  private hoverTimeout: any;

  onDragEnter() {
    // Clear any existing timeout
    clearTimeout(this.hoverTimeout);

    // Navigate after user hovers draggable for long enough
    this.hoverTimeout = setTimeout(() => {
      this.navigate();
    }, 600);
  }

  onDragExit() {
    // Clear the timeout when leaving the drop target
    clearTimeout(this.hoverTimeout);
  }

  navigate() {
    const hostView = (document.querySelector(`.${this.hostViewClass}`) as HTMLElement);
    const destinationView = (document.querySelector(`.${this.destinationViewClass}`) as HTMLElement);
    hostView!!.style.zIndex = '0';
    hostView!!.style.visibility = 'hidden';
    destinationView!!.style.zIndex = '1';
    destinationView!!.style.visibility = 'visible';
  }
}
