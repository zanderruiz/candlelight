import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LobbyService} from '../../data/lobby/lobby.service';
import {HttpErrorResponse} from '@angular/common/http';
import {switchMap, take} from "rxjs";
import {UserService} from "../../data/user/user.service";

@Component({
  selector: 'app-host-game-dialogue',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './host-game-dialogue.component.html',
  styleUrl: './host-game-dialogue.component.css'
})
export class HostGameDialogueComponent {
  private readonly router: Router = inject(Router);
  private readonly lobbyService: LobbyService = inject(LobbyService);
  private readonly userService: UserService = inject(UserService);

  @Input() gameId: string = '';
  @Input() gameName: string = '';
  playerName: string = '';

  @Output() closed = new EventEmitter<void>(); // Emit event when dialogue is closed

  submitForm() {
    const observer = {
      next: (_: boolean) => {
        this.userService.playerName = this.playerName;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.playerName = '';
        this.closeDialogue();
      }
    }
    this.lobbyService.hostLobbyAndConnect(this.gameId, this.playerName).pipe(
      take(1),
      switchMap(_ => this.router.navigateByUrl('/lobby'))
    ).subscribe(observer);
  }

  closeDialogue() {
    this.closed.emit(); // Emit event when dialogue is closed
  }
}
