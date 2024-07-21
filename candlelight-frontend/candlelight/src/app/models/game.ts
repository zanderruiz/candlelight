import { ActionSet, emptyActionSet } from "./action";
import { PieceSet, emptyPieceSet } from "./piece";
import { GamePhase, RuleSet, emptyGamePhase, emptyRuleSet } from "./rule";

export interface Game {
    id?: string;
    name: string;
    genre: string;
    maxPlayers: number;
    resources: ReadonlyArray<GameResource>;
    rules: RuleSet;
    pieces: PieceSet;
    actions: ActionSet;
    phases: ReadonlyArray<GamePhase>;
    beginningPhase: GamePhase;
}

export interface GameResource {
    id: string;
    name: string;
    description: string;
    initialValue: number;
    maxValue: number;
    minValue: number;
}

export function emptyGame(): Game {
    return {
        name: '',
        genre: '',
        maxPlayers: 0,
        resources: [],
        rules: emptyRuleSet(),
        pieces: emptyPieceSet(),
        actions: emptyActionSet(),
        phases: [],
        beginningPhase: emptyGamePhase()
    }
}

export function emptyGameResource(): GameResource {
    return {
        id: '',
        name: '',
        description: '',
        initialValue: 0,
        maxValue: 0,
        minValue: 0
    };
}
