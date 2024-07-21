package Pieces

import (
	"math/rand"
	"slices"
)

//============Deck Implementation==================

// Attempts to add the given card to Cards. Does no error checking
func (deck *Deck) AddCardToCollection(cardToAdd Card) {
	deck.Cards = append(deck.Cards, cardToAdd)
}

// Attempts to remove any Cards with an ID == [card].Id -- Does not do any error checking
func (deck *Deck) RemoveCardFromCollection(card Card) {
	deck.Cards = slices.DeleteFunc(deck.Cards, func(c Card) bool { return c.Id == card.Id })
}

// Attempts to find a card with the given id in Cards. Returns a pointer to the found card
// if found, or nil otherwise
func (deck *Deck) FindCardInCollection(cardId string) *Card {
	foundIndex := slices.IndexFunc(deck.Cards, func(c Card) bool { return c.Id == cardId })
	if foundIndex != -1 {
		return &deck.Cards[foundIndex]
	}
	return nil
}

func (deck *Deck) PickRandomCardFromCollection() *Card {
	index := rand.Intn(len(deck.Cards))
	return &(deck.Cards[index])
}

//============CardPlace Implementation==================

// Attempts to add the given card to PlacedCards. Does no error checking
func (cp *CardPlace) AddCardToCollection(cardToAdd Card) {
	cp.PlacedCards = append(cp.PlacedCards, cardToAdd)
}

// Attempts to remove any Cards with an ID == [card].Id -- Does not do any error checking
func (cp *CardPlace) RemoveCardFromCollection(card Card) {
	cp.PlacedCards = slices.DeleteFunc(cp.PlacedCards, func(c Card) bool { return c.Id == card.Id })
}

// Attempts to find a card with the given id in PlacedCards. Returns a pointer to the found card
// if found, or nil otherwise
func (cp *CardPlace) FindCardInCollection(cardId string) *Card {
	foundIndex := slices.IndexFunc(cp.PlacedCards, func(c Card) bool { return c.Id == cardId })
	if foundIndex != -1 {
		return &cp.PlacedCards[foundIndex]
	}
	return nil
}

func (cp *CardPlace) PickRandomCardFromCollection() *Card {
	index := rand.Intn(len(cp.PlacedCards))
	return &(cp.PlacedCards[index])
}
