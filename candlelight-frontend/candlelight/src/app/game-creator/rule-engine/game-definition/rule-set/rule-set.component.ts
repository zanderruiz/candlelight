import { Component, inject } from '@angular/core';
import { ConstraintsComponent } from "./constraints/constraints.component";
import { Router } from '@angular/router';
import { GameDefinitionStateService } from '../game-definition-state.service';

@Component({
    selector: 'app-rule-set',
    standalone: true,
    templateUrl: './rule-set.component.html',
    styleUrl: './rule-set.component.css',
    imports: [
      ConstraintsComponent
    ]
})
export class RuleSetComponent {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);
  private readonly router = inject(Router);

  confirm(): void {

  }

  goToGameDefinition(): void {
    this.confirm();
    this.router.navigate(['/rule-engine']);
  }
}

//   id: string;
//   constraints: ReadonlyArray<Constraint>;
//   eventActionPairs: ReadonlyArray<EventActionPair>;
