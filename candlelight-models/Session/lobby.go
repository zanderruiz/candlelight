package Session

import "candlelight-models/Player"

//A lobby is a collection of players waiting for a game to start. This is created by the /createRoom endpoint
//which returns the room code. From there, you can pass the room code to /joinRoom which will put you in the room
//and return the state of the lobby
type Lobby struct {
	RoomCode         string          `json:"roomCode"`
	GameDefinitionId string          `json:"gameDefinitionId"`
	GameName         string          `json:"gameName"`
	NumPlayers       int             `json:"numPlayers"`
	MaxPlayers       int             `json:"maxPlayers"`
	Players          []Player.Player `json:"players"`
	Host             Player.Player   `json:"host"`
}
