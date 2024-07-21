import {Action, ActionSet} from "./action";

export interface GameRule {
    id?: string;
}

export interface GamePhase {
    id?: string;
    name: string;
}

export interface Constraint extends GameRule {
    allowedActions: ActionSet;
    flipActionsArray: boolean;
    activePhases: ReadonlyArray<GamePhase>;
    flipActivePhases: boolean;
}

export interface EventActionPair extends GameRule {
    triggers: ActionSet;
    actions: Action;
}

export interface ActionModifier extends GameRule {
    affectedActions: ActionSet;
    flipAffectedActions: boolean;
    constraintFunction: string; // should be a function that returns boolean
}

export interface RuleSet {
    id?: string;
    constraints: ReadonlyArray<Constraint>;
    eventActionPairs: ReadonlyArray<EventActionPair>;
}

export function emptyGameRule(): GameRule {
    return {
    }
}

export function emptyGamePhase(): GamePhase {
    return {
        name: ''
    }
}

export function emptyRuleSet(): RuleSet {
    return {
        constraints: [],
        eventActionPairs: []
    }
}
