import {PieceSet, emptyPieceSet} from "./piece";

export interface Action {
    id: string;
    name: string;
}

export interface MoveAction extends Action {
    numPieces: number;
    allowedPieces: PieceSet;
    allowedTargets: PieceSet;
    flipAllowedPieces: boolean;
    flipAllowedTargets: boolean;
}

export interface TradeAction extends Action {
    allowedResources: ReadonlyArray<string>;
    maximumAllowedChange: number;
    enforceMaximumAllowedChange: boolean;
    minimumAllowedChange: number;
    enforceMinimumAllowedChange: boolean;
}

export interface TransitionAction extends Action {
    newPhase: string;
}

export interface PieceUpdateAction extends Action {
    targetPieces: PieceSet;
    tagUpdates: Record<string, string>;
}

export interface PlacementAction extends Action {
    num: number;
    allowedTargets: PieceSet;
    flipAllowedTargets: boolean;
    allowedPieces: PieceSet;
    flipAllowedPieces: boolean;
    placeRandomly: boolean;
}

export interface TakeAction extends Action {
    num: number;
    takeFrom: PieceSet;
    takeRandomly: boolean;
}

export interface ActionSet {
    moves: ReadonlyArray<MoveAction>;
    trades: ReadonlyArray<TradeAction>;
    transitions: ReadonlyArray<TransitionAction>;
    takes: ReadonlyArray<TakeAction>;
    placements: ReadonlyArray<PlacementAction>;
    pieceUpdates: ReadonlyArray<PieceUpdateAction>;
}

export function emptyAction(): Action {
    return {
        id: '',
        name: ''
    };
}

export function emptyMoveAction(): MoveAction {
    return {
        ...emptyAction(),
        numPieces: 0,
        allowedPieces: emptyPieceSet(),
        allowedTargets: emptyPieceSet(),
        flipAllowedPieces: false,
        flipAllowedTargets: false
    }
}

export function emptyTradeAction(): TradeAction {
    return {
        ...emptyAction(),
        allowedResources: [],
        maximumAllowedChange: 0,
        enforceMaximumAllowedChange: false,
        minimumAllowedChange: 0,
        enforceMinimumAllowedChange: false
    }
}

export function emptyTransitionAction(): TransitionAction {
    return {
        ...emptyAction(),
        newPhase: ''
    }
}
 
export function emptyTakeAction(): TakeAction {
    return {
        ...emptyAction(),
        num: 0,
        takeFrom: emptyPieceSet(),
        takeRandomly: false
    }
}

export function emptyPlacementAction(): PlacementAction {
    return {
        ...emptyAction(),
        num: 0,
        allowedTargets: emptyPieceSet(),
        flipAllowedTargets: false,
        allowedPieces: emptyPieceSet(),
        flipAllowedPieces: false,
        placeRandomly: false
    }
}

export function emptyPieceUpdateAction(): PieceUpdateAction {
    return {
        ...emptyAction(),
        targetPieces: emptyPieceSet(),
        tagUpdates: {}
    }
}

export function emptyActionSet(): ActionSet {
    return {
        moves: [],
        trades: [],
        transitions: [],
        takes: [],
        placements: [],
        pieceUpdates: []
    };
}
