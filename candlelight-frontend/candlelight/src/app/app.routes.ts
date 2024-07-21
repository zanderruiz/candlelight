import { Routes } from '@angular/router';
import { GameDefinitionComponent } from './game-creator/rule-engine/game-definition/game-definition/game-definition.component';
import { LandingComponent } from './landing/landing.component';
import { GamePlayPageComponent } from './player-portal/game-play-page/game-play-page.component';
import { ExploreSelectPageComponent } from './explore-select-page/explore-select-page.component';
import { HttpTestComponent } from './game-creator/http-test/http-test.component';
import { GameResourcesComponent } from './game-creator/rule-engine/game-definition/game-resources/game-resources.component';
import { RuleSetComponent } from './game-creator/rule-engine/game-definition/rule-set/rule-set.component';
import { PieceSetComponent } from './game-creator/rule-engine/game-definition/piece-set/piece-set.component';
import { ActionSetComponent } from './game-creator/rule-engine/game-definition/action-set/action-set.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'http-test',
        component: HttpTestComponent
    },
    {
        path: 'rule-engine',
        component: GameDefinitionComponent
    },
    {
        path: 'rule-engine/resources',
        component: GameResourcesComponent
    },
    {
        path: 'rule-engine/piece-set',
        component: PieceSetComponent
    },
    {
        path: 'rule-engine/action-set',
        component: ActionSetComponent
    },
    {
        path: 'rule-engine/rule-set',
        component: RuleSetComponent
    },
    {
        path: 'play',
        component: GamePlayPageComponent
    },
    {
        path: 'lobby',
        component: LobbyComponent
    },
    {
        path: 'explore',
        component: ExploreSelectPageComponent
    },
    {
        path: 'host',
        component: ExploreSelectPageComponent
    }
];
