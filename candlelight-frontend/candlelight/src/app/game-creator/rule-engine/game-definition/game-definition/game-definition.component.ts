import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameResourcesComponent } from '../game-resources/game-resources.component';
import { RuleSetComponent } from '../rule-set/rule-set.component';
import { GameDefinitionStateService } from '../game-definition-state.service';
import { Router } from '@angular/router';
import { GameDataService } from '../../../../data/game/game-data.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-game-definition',
  standalone: true,
  imports: [
    GameResourcesComponent,
    ReactiveFormsModule,
    RuleSetComponent
  ],
  templateUrl: './game-definition.component.html',
  styleUrl: './game-definition.component.css'
})
export class GameDefinitionComponent implements OnInit {
  private readonly gameDataService = inject(GameDataService);
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);
  private readonly router = inject(Router);

  readonly gameForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    genre: new FormControl<string>(''),
    maxPlayers: new FormControl<number>(1),
  });

  ngOnInit(): void {
    this.loadFormState();
  }

  confirm(): void {
    const form = this.gameForm.getRawValue();
    const existing = this.gameDefinitionStateService.game;
    this.gameDefinitionStateService.game = {
      ...existing,
      name: form.name,
      genre: form.genre,
      maxPlayers: form.maxPlayers
    }
  }

  loadFormState(): void {
    const existing = this.gameDefinitionStateService.game;
    this.gameForm.setValue({
      name: existing.name,
      genre: existing.genre,
      maxPlayers: existing.maxPlayers > 0 ? existing.maxPlayers : 1
    });
  }

  goToGameResources(): void {
    this.confirm();
    this.router.navigate(['/rule-engine/resources']);
  }

  goToPieceSet(): void {
    this.confirm();
    this.router.navigate(['/rule-engine/piece-set']);
  }

  goToActionSet(): void {
    this.confirm();
    this.router.navigate(['/rule-engine/action-set']);
  }

  goToRuleSet(): void {
    this.confirm();
    this.router.navigate(['/rule-engine/rule-set']);
  }

  save(): void {
    this.confirm();
    const game = this.gameDefinitionStateService.game;

    const observer = {
      next: (response: string) => {
        console.log(response);
        this.gameDefinitionStateService.clear();
        this.router.navigate(['/explore']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    };
    this.gameDataService.createGame(game)
      .pipe(take(1))
      .subscribe(observer);
  }
}
