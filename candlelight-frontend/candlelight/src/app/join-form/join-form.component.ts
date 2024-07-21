import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LobbyService} from '../data/lobby/lobby.service';
import {HttpErrorResponse} from '@angular/common/http';
import {switchMap, take} from "rxjs";
import {UserService} from "../data/user/user.service";

@Component({
  selector: 'app-join-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './join-form.component.html',
  styleUrl: './join-form.component.css'
})
export class JoinFormComponent {
  private readonly router: Router = inject(Router);
  private readonly lobbyService: LobbyService = inject(LobbyService);
  private readonly userService: UserService = inject(UserService);

  roomCode: string = '';
  playerName: string = '';

  submitForm() {
    const observer = {
      next: (_: boolean) => {
        this.userService.playerName = this.playerName;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.roomCode = '';
        this.playerName = '';
      }
    }
    this.lobbyService.joinLobbyAndConnect(this.roomCode, this.playerName).pipe(
      take(1),
      switchMap(_ => this.router.navigateByUrl('/lobby'))
    ).subscribe(observer);
  }
}
