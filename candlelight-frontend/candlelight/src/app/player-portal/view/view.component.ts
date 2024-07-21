import { Component } from '@angular/core';
import { CardPlaceComponent } from '../game-play-page/card-place/card-place.component';
import { NavigationComponent } from '../game-play-page/navigation/navigation.component';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CardPlaceComponent,
    NavigationComponent,
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

}
