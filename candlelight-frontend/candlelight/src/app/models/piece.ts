export interface GamePiece {
    id: string;
    name: string;
    tags: Record<string, string>;
}

export interface CardPlace extends GamePiece {
    placedCards: ReadonlyArray<Card>;
    owner: string;
}

export interface Card extends GamePiece {
    description: string;
    value?: number;
}

export interface Deck extends GamePiece {
    cards: ReadonlyArray<Card>;
}

export interface PieceSet {
    decks: ReadonlyArray<Deck>;
    cardPlaces: ReadonlyArray<CardPlace>;
}

export function emptyGamePiece(): GamePiece {
    return {
        id: '',
        name: '',
        tags: {}
    }
}

export function emptyCardPlace(): CardPlace {
    return {
        ...emptyGamePiece(),
        placedCards: [],
        owner: ''
    };
}

export function emptyCard(): Card {
    return {
        ...emptyGamePiece(),
        description: '',
        value: 0
    };
}

export function emptyDeck(): Deck {
    return {
        ...emptyGamePiece(),
        cards: []
    }
}

export function emptyPieceSet(): PieceSet {
    return {
        decks: [],
        cardPlaces: []
    };
}
