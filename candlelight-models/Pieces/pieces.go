package Pieces

// A collection of GamePieces
type PieceSet struct {
	Decks      []Deck      `json:"decks"`
	CardPlaces []CardPlace `json:"cardPlaces"`
}

// An outline for any piece the Game might use.
type GamePiece struct {
	//Id for book keeping
	Id string `json:"id"`
	//Name of this piece
	Name string `json:"name"`
	//A set of Player-defined properties for this Piece. Should have the form
	// property: value in JSON
	Tags map[string]string `json:"tags"`
}

// An outline for pieces that can contain other GamePieces. Whitelist is a dictionary
// of string -> array(string), where the key is the tag name and the value is a list of
// values such that any piece with that tag key-value pair is allowed to be placed within collections of this
// PieceContainer
type PieceContainer struct {
	//a dictionary of string -> array(string), where the key is the tag name and the value is a list of
	// values such that any piece with that tag key-value pair is allowed to be placed within collections of this
	// PieceContainer
	TagsWhitelist map[string][]string `json:"tagsWhitelist"`
}

// A deck simply serves to keep a collection of cards in one place.
type Deck struct {
	GamePiece
	PieceContainer
	//The cards in the deck
	Cards []Card `json:"cards"`
}

// A card. Hopefully if you're reading this code, you know what a card might
// be used for in a tabletop game.
type Card struct {
	GamePiece
	//Optional description
	Description string `json:"description"`
	//Optional value, if having/playing a certain card might be good/bad
	Value int `json:"value"`
}

/*
A place where a player can play their
cards. This might be shared between all players (Owner == "game" or something) e.g. Uno
or might be owned by one specific player e.g. Cover Your Assets
*/
type CardPlace struct {
	GamePiece
	PieceContainer
	//Cards currently in this CardPlace
	PlacedCards []Card `json:"placedCards"`
	//Owner of this Card place
	Owner string `json:"owner"`
}

type Card_Container interface {
	AddCardToCollection(cardToAdd Card)
	RemoveCardFromCollection(cardToRemove Card)
	FindCardInCollection(cardId string) *Card
	PickRandomCardFromCollection() *Card
}
