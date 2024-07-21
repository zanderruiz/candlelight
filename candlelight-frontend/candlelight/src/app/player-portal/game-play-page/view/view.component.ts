import { Component } from '@angular/core';
import { CardPlaceComponent } from '../card-place/card-place.component';
import { NavigationComponent } from '../navigation/navigation.component';

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
