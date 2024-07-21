import {Game} from "./game";
import {CardPlace, Deck} from "./piece";
import {Action, ActionSet} from "./action";
import {GamePhase} from "./rule";

export const UNO: Readonly<Game> = {
        id: "1",
        name: "YOU HAVE UNO",
        genre: "party",
        maxPlayers: 4,
        resources: [],
        rules: {
            id: "8",
            constraints: [
                {
                    id: "",
                    allowedActions: {} as ActionSet, // "Update Card Place Action",
                    flipActionsArray: false,
                    activePhases: [], // "Waiting on player input",
                    flipActivePhases: false
                },
                {
                    id: "",
                    allowedActions: {} as ActionSet, // "Draw",
                    flipActionsArray: false,
                    activePhases: [], // "Must draw",
                    flipActivePhases: false
                }
            ],
            eventActionPairs: [
                {
                    id: "12",
                    triggers: {} as ActionSet, // "Play Card"
                    actions: {} as Action // "Transition to Waiting"
                }
            ],
            // actionModifiers: [
            //     {
            //         id: 8,
            //         affectedActions: {
            //             placements: [
            //                 {
            //                     id: 6
            //                 }
            //             ]
            //         },
            //         flipAffectedActions: false,
            //         constraintFunction: "(game.pieces.cardPlaces[0].placesCards[0].tags['color'] == pieces.decks[0].cards[0].tags['color']) || (pieces.decks[0].cards[0].tags['color'] == 'wild') || # is same"
            //     },
            //     {
            //         id: 8,
            //         affectedActions: {
            //             pieceUpdates: [
            //                 {id: 11}
            //             ]
            //         },
            //         flipAffectedActions: false,
            //         constraintFunction: "top card is wild function"
            //     }
            // ]
        },
        pieces: {
            decks: [
                {
                    id: "2",
                    name: "Main Deck",
                    cards: [
                        {
                            id: "3",
                            name: "Blue 1",
                            description: "Blue and 1",
                            value: 1,
                            tags: {"color": "blue"}
                        },
                        // {"One for each card": ""},
                        {
                            id: "",
                            name: "wild",
                            description: '',
                            value: 0,
                            tags: {"color": "wild"}
                        }
                    ],
                    tags: {}
                }
            ],
            cardPlaces: [
                {
                    id: "4",
                    name: "Play Area",
                    placedCards: [],
                    owner: "Game",
                    tags: {"suit": "some color"}
                }
            ]
        },
        actions: {
            moves: [],
            trades: [],
            transitions: [
                {
                    id: "13",
                    newPhase: "Waiting on player phase",
                    name: ""
                }
            ],
            takes: [
                {
                    id: "5",
                    name: "Draw",
                    num: 1,
                    takeFrom: {
                        decks: [
                            {
                                id: "3"
                            } as Deck
                        ],
                        cardPlaces: []
                    },
                    takeRandomly: false
                }
            ],
            placements: [
                {
                    id: "6",
                    name: "Play a Card",
                    num: 1,
                    allowedTargets: {
                        decks: [],
                        cardPlaces: [
                            {
                                id: "4"
                            } as CardPlace
                        ]
                    },
                    flipAllowedTargets: false,
                    allowedPieces: {
                        decks: [
                            {
                                id: "2"
                            } as Deck
                        ],
                        cardPlaces: []
                    },
                    flipAllowedPieces: false,
                    placeRandomly: false
                }
                // {"One for each type of card":""}
            ],
            pieceUpdates: [
                {
                    id: "11",
                    targetPieces: {
                        decks: [],
                        cardPlaces: [
                            {id: "4"} as CardPlace
                        ]
                    },
                    tagUpdates: {"suit": ""},
                    name: ""
                }
            ]
        },
        phases: [
            {
                id: "14",
                name: "Normal Play"
            },
            {
                id: "15",
                name: "Waiting on Player"
            },
            {
                id: "16",
                name: "Must Draw"
            }
        ],
        beginningPhase: {} as GamePhase
    };
