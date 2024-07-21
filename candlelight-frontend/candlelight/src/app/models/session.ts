import { ActionSet, emptyActionSet } from "./action";
import { PieceSet, emptyPieceSet } from "./piece";
import { Player, emptyPlayer } from "./player";
import { GamePhase, emptyGamePhase } from "./rule";

export interface GameState {
    id: string;
    playerStates: ReadonlyArray<PlayerState>;
    currentPlayer: PlayerState;
    currentPhase: GamePhase;
    gamePieces: PieceSet;
}

export interface PlayerState {
    allowedActions: ActionSet;
    player: Player;
}

export enum ActionType {
    MoveTurn = "MoveTurn",
    PieceUpdateTurn = "PieceUpdateTurn",
    PlacementTurn = "PlacementTurn",
    TakeTurn = "TakeTurn",
    TradeTurn = "TradeTurn",
    TransitionTurn = "TransitionTurn"
}

export interface SubmittedAction {
    type: ActionType;
    turn: Turn;
    player: Player;
}

export interface Transaction {
    playerId: string;
    resourceId: string;
    changeAmount: number;
}

export interface Turn {
    actionId: string;
}

export interface MoveTurn extends Turn {
    pieceId: string;
    targetId: string;
}

export interface PieceUpdateTurn extends Turn {
    pieceId: string;
    newTags: Record<string, string>;
}

export interface PlacementTurn extends Turn {
    pieceId: string;
    targetId: string;
}

export interface TakeTurn extends Turn {
    pieceId: string;
    takingFromId: string;
}

export interface TradeTurn extends Turn {
    transactions: ReadonlyArray<Transaction>;
}

export interface TransitionTurn extends Turn {
    newPhase: string;
}

export function emptyGameState(): GameState {
    return {
        id: '',
        playerStates: [],
        currentPlayer: emptyPlayerState(),
        currentPhase: emptyGamePhase(),
        gamePieces: emptyPieceSet()
    }
}

export function emptyPlayerState(): PlayerState {
    return {
        allowedActions: emptyActionSet(),
        player: emptyPlayer()
    }
}
