import { NgIf } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-info-bar',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './game-info-bar.component.html',
  styleUrl: './game-info-bar.component.css'
})
export class GameInfoBarComponent implements OnInit {
  @Input() gameName: string | null = 'UNE!';
  @Input() roomCode: string | null = 'BRUH';
  @Input() playerName: string | null = 'UNGABUNGA';

  isPhoneScreen: boolean = false;

  ngOnInit() {
    this.isPhoneScreen = window.innerWidth <= 600;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.isPhoneScreen = window.innerWidth <= 600;
  }

  // Method to check if the screen width is less than or equal to 600px
  isPhone() {
    return this.isPhoneScreen;
  }
}
