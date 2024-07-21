import { PieceSet, emptyPieceSet } from "./piece";

export interface Player {
    id: string;
    name: string;
    hand: PieceSet;
    resources: ReadonlyArray<PlayerResource>;
}

export interface PlayerResource {
    name: string;
    currentValue: number;
    maxValue: number;
}

export function emptyPlayer(): Player {
    return {
        id: '',
        name: '',
        hand: emptyPieceSet(),
        resources: []
    }
}

export function emptyPlayerResource(): PlayerResource {
    return {
        name: '',
        currentValue: 0,
        maxValue: 0
    }
}
