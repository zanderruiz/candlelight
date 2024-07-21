import { AfterViewInit, Component, OnInit, ViewChildren, inject } from '@angular/core';
import { GameResourceComponent } from './game-resource/game-resource.component';
import { NgFor } from '@angular/common';
import { GameResource } from '../../../../models/game';
import { GameDefinitionStateService } from '../game-definition-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-resources',
  standalone: true,
  imports: [
    NgFor,
    GameResourceComponent
  ],
  templateUrl: './game-resources.component.html',
  styleUrl: './game-resources.component.css'
})
export class GameResourcesComponent implements OnInit, AfterViewInit {
  private readonly gameDefinitionStateService = inject(GameDefinitionStateService);
  private readonly router = inject(Router);

  private nextKey = 1;
  componentKeys: number[] = [];

  @ViewChildren(GameResourceComponent)
  private components!: ReadonlyArray<GameResourceComponent>;

  ngOnInit(): void {
    this.loadChildren();
  }

  ngAfterViewInit(): void {
    this.loadFormStates();
  }

  addComponent(): void {
    this.componentKeys.push(this.nextKey++);
  }

  removeComponent(key: number): void {
    this.componentKeys = this.componentKeys.filter(k => k !== key);
  }

  mapFormsToGameResources(): ReadonlyArray<GameResource> {
    return this.components.map(c => c.mapFormToGameResource());
  }

  confirm(): void {
    const existing = this.gameDefinitionStateService.game;
    this.gameDefinitionStateService.game = {
      ...existing,
      resources: this.mapFormsToGameResources()
    };
  }

  loadChildren(): void {
    const existingResources = this.gameDefinitionStateService.game.resources;
    existingResources.forEach(_ => this.addComponent());
  }

  loadFormStates(): void {
    const existingResources = this.gameDefinitionStateService.game.resources;
    this.components.forEach((component, index) => {
      component.loadFormState(existingResources[index]);
    });
  }

  goToGameDefinition(): void {
    this.confirm();
    this.router.navigate(['/rule-engine']);
  }
}
