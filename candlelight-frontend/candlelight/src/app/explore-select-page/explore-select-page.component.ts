import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExploreSelectGameItemComponent, GameIdAndTitle } from './explore-select-game-item/explore-select-game-item.component';
import { HostGameDialogueComponent } from './host-game-dialogue/host-game-dialogue.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable, catchError, take } from 'rxjs';
import { Game } from '../models/game';
import { GameDataService } from '../data/game/game-data.service';

interface GameExploreItem {
  id: string;
  imageUrl: string;
  title: string;
  createdBy: string;
}

@Component({
  selector: 'app-explore-select-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ExploreSelectGameItemComponent,
    HostGameDialogueComponent,
    NgFor,
    NgIf
  ],
  templateUrl: './explore-select-page.component.html',
  styleUrl: './explore-select-page.component.css'
})
export class ExploreSelectPageComponent {
  private readonly gameDataService = inject(GameDataService);
  private readonly activatedRoute = inject(ActivatedRoute);

  showHostGameDialogueFlag: boolean = false;
  selectedGameId: string = '';
  selectedGameTitle: string = '';

  pageTitle: string = '';
  pageSubtitle: string = '';
  mockGames: GameExploreItem[] = []; // This array will contain game objects later fetched via API

  readonly games$: Observable<ReadonlyArray<Game>> = this.gameDataService.fetchGames().pipe(
    take(1),
    catchError(error => {
      console.error(error);
      return [];
    })
  );

  ngOnInit(): void {
    // Get the current route
    const currentRoute = this.activatedRoute.snapshot.routeConfig?.path;

    // Set the page title and subtitle based on the current route
    if (currentRoute === 'explore') {
      this.pageTitle = 'EXPLORE GAMES';
      this.pageSubtitle = 'CREATED BY USERS LIKE YOU';
    } else if (currentRoute === 'host') {
      this.pageTitle = 'HOST A GAME';
      this.pageSubtitle = 'SELECT A GAME TO HOST';
    } else {
      this.pageTitle = '';
      this.pageSubtitle = '';
    }

    // Fetch games from an API 
    // (this is just a placeholder for now, we'll plug in real API calls later)
    this.fetchGames();
  }

  fetchGames() {
    this.mockGames = [
      { 
        id: '1',
        imageUrl: 'https://pbs.twimg.com/profile_images/1097954391892598784/7BvEDoKe_400x400.png', 
        title: 'UNE!', 
        createdBy: 'bigman' 
      },
      { 
        id: '2',
        imageUrl: 'https://play-lh.googleusercontent.com/l--vx1v_q-0xX8TZxGwmZhPqnMmUYJ96TZG98zXh8HZOy7va1yJdP7eSvebCbXUi_Q', 
        title: 'Rüt', 
        createdBy: 'catfighter' 
      },
      { 
        id: '3',
        imageUrl: 'https://www.sideshow.com/storage/product-images/905229/lightning-mcqueen_disney_square.jpg', 
        title: 'Cartann 4', 
        createdBy: 'legobrian42' 
      }
    ];
  }

  showHostGameDialogue(gameIdAndTitle: GameIdAndTitle) {
    this.selectedGameId = gameIdAndTitle.id; // Set selected game id
    this.selectedGameTitle = gameIdAndTitle.title; // Set selected game title
    this.showHostGameDialogueFlag = true; // Show dialogue
  }

  closeHostGameDialogue() {
    this.showHostGameDialogueFlag = false; // Close dialogue
  }
}
