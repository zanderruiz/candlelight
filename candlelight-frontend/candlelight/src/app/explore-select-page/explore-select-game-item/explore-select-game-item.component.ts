import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { Router } from '@angular/router';
import {GameDataService} from "../../data/game/game-data.service";
import {GameDefinitionStateService} from "../../game-creator/rule-engine/game-definition/game-definition-state.service";
import {switchMap, take, tap} from "rxjs";

export type GameIdAndTitle = {
  id: string;
  title: string;
};

@Component({
  selector: 'app-explore-select-game-item',
  standalone: true,
  imports: [],
  templateUrl: './explore-select-game-item.component.html',
  styleUrl: './explore-select-game-item.component.css'
})
export class ExploreSelectGameItemComponent {
  private readonly router = inject(Router);
  private readonly gameDataService = inject(GameDataService);
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);

  @Input() imageUrl: string = '';
  @Input() gameTitle: string = '';
  @Input() userName: string = '';
  @Input() gameId: string | undefined = '';

  // Emitter to give game title to host game dialogue
  @Output() playGameClicked = new EventEmitter<GameIdAndTitle>();

  playGame() {
    const gameIdAndTitle = {
      id: this.gameId || '',
      title: this.gameTitle
    };
    this.playGameClicked.emit(gameIdAndTitle);
    // Navigate to the play page for now.
    // This logic will get more complicated later to properly launch a game.
    // this.router.navigateByUrl('/play');
  }

  editGame(): void {
    this.gameDataService.fetchGame(this.gameId || '').pipe(
      take(1),
      tap(game => {
        this.gameDefinitionStateService.game = game;
        this.gameDefinitionStateService.cards = GameDefinitionStateService.selectCardsFromGame(game);
      }),
      switchMap(game => this.router.navigateByUrl('/rule-engine')),
    ).subscribe();
  }
}
