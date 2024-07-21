package Session

import (
	"candlelight-models/Actions"
	"candlelight-models/Pieces"
	"candlelight-models/Player"
	"fmt"
	"slices"
)

func (mt MoveTurn) Execute(gameState *GameState, player Player.Player) error {
	//Make sure the Player trying to play this is tracked in the gameState, and if so, grab his state off
	//the gameState to make updates there
	currentPlayerState := findPlayerInGameState(gameState, &player)

	if currentPlayerState == nil {
		return fmt.Errorf("ERROR: Could not find PlayerState within GameState for given player")
	}

	//Make sure the Action they're trying to take is within their allowed actions
	if !actionInAllowedActions(mt.ActionId, &currentPlayerState.AllowedActions, MoveTurnType) {
		return fmt.Errorf("ERROR: Attempted action not found within Player's allowed actions")
	}

	target := findCardContainerInGame(mt.TargetId, gameState)
	if target == nil {
		return fmt.Errorf("couldn't find target with targetId == {%s} in Game", mt.TargetId)
	}

	removedCard := attemptToRemoveCardFromGame(mt.PieceId, gameState)
	if removedCard == nil {
		return fmt.Errorf("couldn't find card with PieceId == {%s} in GameState", mt.PieceId)
	}

	target.AddCardToCollection(*removedCard)

	return nil
}

func (puT PieceUpdateTurn) Execute(gameState *GameState, player Player.Player) error {
	currentPlayerState := findPlayerInGameState(gameState, &player)

	if currentPlayerState == nil {
		return fmt.Errorf("ERROR: Could not find PlayerState within GameState for given player")
	}

	if !actionInAllowedActions(puT.ActionId, &currentPlayerState.AllowedActions, PieceUpdateTurnType) {
		return fmt.Errorf("ERROR: Attempted action not found within Player's allowed actions")
	}

	for index, cp := range gameState.GamePieces.CardPlaces {
		if puT.TargetPieceId == cp.Id {
			gameState.GamePieces.CardPlaces[index].Tags = puT.NewTags
			return nil
		}
	}

	for index, deck := range gameState.GamePieces.Decks {
		if puT.TargetPieceId == deck.Id {
			gameState.GamePieces.Decks[index].Tags = puT.NewTags
			return nil
		}
	}

	return fmt.Errorf("could not find target with TargetPieceId=={%s}", puT.TargetPieceId)
}

func (pt PlacementTurn) Execute(gameState *GameState, player Player.Player) error {

	currentPlayerState := findPlayerInGameState(gameState, &player)

	if currentPlayerState == nil {
		return fmt.Errorf("ERROR: Could not find PlayerState within GameState for given player")
	}

	//Make sure the Action they're trying to take is within their allowed actions
	if !actionInAllowedActions(pt.ActionId, &currentPlayerState.AllowedActions, PlacementTurnType) {
		return fmt.Errorf("ERROR: Attempted action not found within Player's allowed actions")
	}

	target := findCardContainerInGame(pt.TargetId, gameState)
	if target == nil {
		return fmt.Errorf("couldn't find target with targetId == {%s} in Game", pt.TargetId)
	}

	removedCard := attemptToRemoveCardFromPlayer(pt.PieceId, &currentPlayerState.Player)
	if removedCard == nil {
		return fmt.Errorf("couldn't find card with PieceId == {%s} in player's hand", pt.PieceId)
	}

	target.AddCardToCollection(*removedCard)

	return nil
}

func (tt TakeTurn) Execute(gameState *GameState, player Player.Player) error { //TODO: Right now this only adds to the Player's Decks[0]
	currentPlayerState := findPlayerInGameState(gameState, &player)

	if currentPlayerState == nil {
		return fmt.Errorf("ERROR: Could not find PlayerState within GameState for given player")
	}

	if !actionInAllowedActions(tt.ActionId, &currentPlayerState.AllowedActions, TakeTurnType) {
		return fmt.Errorf("ERROR: Attempted action not found within Player's allowed actions")
	}

	target := findCardContainerInGame(tt.TakingFromId, gameState)

	if target == nil {
		return fmt.Errorf("could not find target with Id == {%s}", tt.TakingFromId)
	}

	var cardToTake *Pieces.Card = nil
	if tt.PieceId == "" {
		//PieceId is empty, so take a random card
		cardToTake = target.PickRandomCardFromCollection()
	} else {
		cardToTake = target.FindCardInCollection(tt.PieceId)
	}

	if cardToTake == nil { //If we haven't found it, ERROR
		return fmt.Errorf("could not find piece with ID == {%s} within target with ID == {%s}", tt.PieceId, tt.TakingFromId)
	}

	copy := *cardToTake
	target.RemoveCardFromCollection(*cardToTake)
	//Currently just adds to the player's 0-index Deck
	currentPlayerState.Player.Hand.Decks[0].AddCardToCollection(copy)

	return nil

}

func (mt TradeTurn) Execute(gameState *GameState, player Player.Player) error {
	return fmt.Errorf("TradeTurn is not implemented yet")
}

func (tt TransitionTurn) Execute(gameState *GameState, player Player.Player) error {

	currentPlayerState := findPlayerInGameState(gameState, &player)

	if currentPlayerState == nil {
		return fmt.Errorf("ERROR: Could not find PlayerState within GameState for given player")
	}

	//Make sure the Action they're trying to take is within their allowed actions
	if !actionInAllowedActions(tt.ActionId, &currentPlayerState.AllowedActions, PlacementTurnType) {
		return fmt.Errorf("ERROR: Attempted action not found within Player's allowed actions")
	}

	return nil
}

// Checks if the given [actionId] is found on any of the [allowedActions] of type [actionType]
func actionInAllowedActions(actionId string, allowedActions *Actions.ActionSet, actionType string) bool {
	return true
	// switch actionType {
	// case MoveTurnType:
	// 	return slices.ContainsFunc(allowedActions.Moves, func(action Actions.Move) bool { return action.Id == actionId })
	// case PieceUpdateTurnType:
	// 	return slices.ContainsFunc(allowedActions.PieceUpdates, func(action Actions.PieceUpdate) bool { return action.Id == actionId })
	// case PlacementTurnType:
	// 	return slices.ContainsFunc(allowedActions.Placements, func(action Actions.Placement) bool { return action.Id == actionId })
	// case TakeTurnType:
	// 	return slices.ContainsFunc(allowedActions.Takes, func(action Actions.Take) bool { return action.Id == actionId })
	// case TradeTurnType:
	// 	return slices.ContainsFunc(allowedActions.Trades, func(action Actions.Trade) bool { return action.Id == actionId })
	// case TransitionTurnType:
	// 	return slices.ContainsFunc(allowedActions.Transitions, func(action Actions.Transition) bool { return action.Id == actionId })
	// default:
	// 	return false
	// }
}

func findPlayerInGameState(gameState *GameState, player *Player.Player) *PlayerState {
	for index, element := range gameState.PlayerStates {
		if element.Player.Id == player.Id {
			return &gameState.PlayerStates[index]
		}
	}
	return nil
}

func attemptToRemoveCardFromPlayer(pieceId string, player *Player.Player) *Pieces.Card {
	//Try to find the card in their CardPlaces
	for index := range player.Hand.CardPlaces {
		cardPlace := &player.Hand.CardPlaces[index]
		foundCard := cardPlace.FindCardInCollection(pieceId)
		if foundCard != nil { //[foundCard] != nil if the card was found
			//Need to make a copy because RemoveCardFromCollection uses slices.Delete, which will 0 out the
			//card at the address pointed to by foundCard
			copy := *foundCard
			cardPlace.RemoveCardFromCollection(*foundCard)
			return &copy
		}
	}

	for index := range player.Hand.Decks {
		deck := &player.Hand.Decks[index]
		foundCard := deck.FindCardInCollection(pieceId)
		if foundCard != nil { //[foundCard] != nil if the card was found
			//Need to make a copy because RemoveCardFromCollection uses slices.Delete, which will 0 out the
			//card at the address pointed to by foundCard
			copy := *foundCard
			deck.RemoveCardFromCollection(*foundCard)
			return &copy
		}
	}

	return nil
}

// Finds the card with the given [pieceId] in the entire gameState, removes it from the collection it's found in, and returns a copy of it
func attemptToRemoveCardFromGame(pieceId string, gameState *GameState) *Pieces.Card {
	//Try to find the card in their CardPlaces
	for index := range gameState.GamePieces.CardPlaces {
		cardPlace := &gameState.GamePieces.CardPlaces[index]
		foundCard := cardPlace.FindCardInCollection(pieceId)
		if foundCard != nil { //[foundCard] != nil if the card was found
			//Need to make a copy because RemoveCardFromCollection uses slices.Delete, which will 0 out the
			//card at the address pointed to by foundCard
			copy := *foundCard
			cardPlace.RemoveCardFromCollection(*foundCard)
			return &copy
		}
	}

	for index := range gameState.GamePieces.Decks {
		deck := &gameState.GamePieces.Decks[index]
		foundCard := deck.FindCardInCollection(pieceId)
		if foundCard != nil { //[foundCard] != nil if the card was found
			//Need to make a copy because RemoveCardFromCollection uses slices.Delete, which will 0 out the
			//card at the address pointed to by foundCard
			copy := *foundCard
			deck.RemoveCardFromCollection(*foundCard)
			return &copy
		}
	}

	return nil
}

func findCardContainerInGame(targetId string, gameState *GameState) Pieces.Card_Container {
	foundIndex := -1
	foundIndex = slices.IndexFunc(gameState.GamePieces.CardPlaces, func(c Pieces.CardPlace) bool { return c.Id == targetId })
	if foundIndex != -1 {
		return &gameState.GamePieces.CardPlaces[foundIndex]
	}
	foundIndex = slices.IndexFunc(gameState.GamePieces.Decks, func(c Pieces.Deck) bool { return c.Id == targetId })
	if foundIndex != -1 {
		return &gameState.GamePieces.Decks[foundIndex]
	}
	return nil
}
