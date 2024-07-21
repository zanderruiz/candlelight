import { Component } from '@angular/core';
import { JoinFormComponent } from '../join-form/join-form.component';
import { HostFormComponent } from '../host-form/host-form.component';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    JoinFormComponent,
    HostFormComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
