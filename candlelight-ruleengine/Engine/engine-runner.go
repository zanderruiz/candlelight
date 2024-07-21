package Engine

import (
	"candlelight-api/LogUtil"
	"candlelight-models/Actions"
	"candlelight-models/Game"
	"candlelight-models/Pieces"
	"candlelight-models/Player"
	"candlelight-models/Session"
	"slices"

	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

// Saves the given [game] in the database, which is currently Redis. If the save is successful, [error] will be nil
func SaveGameDefToDB(game Game.Game) (Game.Game, error) {
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)
	funcLogPrefix := "==SaveGameDefToDB==:"
	log.Printf("%s Saving Game with id=={%s}", funcLogPrefix, game.Id)

	// If the Game doesn't have an ID yet, generate one
	id := game.Id
	if id == "" {
		log.Printf("%s Game doesn't have an Id. Generating one...", funcLogPrefix)
		id = GenerateId()
		log.Printf("%s Id successfully generated. Assigning Id {%s} to Game", funcLogPrefix, id)
		game.Id = id
	}

	asJson, err := json.Marshal(game)
	if err != nil {
		LogError(funcLogPrefix, err)
		return game, err
	}

	key := "game:" + id
	err = rdb.Set(ctx, key, asJson, 0).Err()
	if err != nil {
		LogError(funcLogPrefix, err)
		return game, err
	}

	log.Printf("%s GameDefinition saved with key == {%s}", funcLogPrefix, key)

	return game, nil
}

// Grabs a game from Redis for the given [id]. Returns nil for [error] if the returned Game is an actual Game that can be used
func GetGameDefFromDB(id string) (Game.Game, error) {
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)
	funcLogPrefix := "==GetGameDefFromDB==:"

	log.Printf("%s Retrieving Game with id=={%s} from DB", funcLogPrefix, id)

	game := Game.Game{}

	//Catch empty ID
	if id == "" {
		log.Printf("%s ERROR! Id cannot be empty. Returning empty Game Definition", funcLogPrefix)
		return game, fmt.Errorf("%s Id cannot be empty", funcLogPrefix)
	}

	//Try to get the Game from Redis. If it doesn't exist, give a specific error for that
	def, err := rdb.Get(ctx, "game:"+id).Result()
	if err == redis.Nil {
		log.Printf("%s Could not find cached Game for id \"%s\"...Returning Empty Game", funcLogPrefix, id)
		return game, fmt.Errorf("%s No game for Id=={%s} found", funcLogPrefix, id)
	} else if err != nil {
		LogError(funcLogPrefix, err)
		return game, err
	}

	//Result is just a JSON string, so we still need to deserialize/unmarshal it
	err = json.Unmarshal([]byte(def), &game)
	if err != nil {
		LogError(funcLogPrefix, err)
		return game, err
	}

	log.Printf("%s Found a Game, returning result", funcLogPrefix)
	return game, nil
}

// Retrieves all games in the DB and returns them in a list
func GetAllGamesFromDB() ([]Game.Game, error) {
	funcLogPrefix := "==GetAllGamesFromDB_Slimmed=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Gettings all GAMES from DB...", funcLogPrefix)

	var cursor uint64
	toReturn := []Game.Game{}
	for { //Iterate through all keys beginning with "game:" and break when cursor is 0.
		var keys []string
		var err error
		keys, cursor, err = rdb.Scan(ctx, cursor, "game:*", 10).Result()
		if err != nil {
			LogError(funcLogPrefix, err)
			return toReturn, err
		}

		//SCAN returns subsets of matching keys, so we need to iterate through each subset
		//as it comes back, get each game for the keys returned, and add it to the results
		for _, k := range keys {
			//Get Key from DB
			gameJSON, err := rdb.Get(ctx, k).Result()
			if err != nil {
				LogError(funcLogPrefix, err)
				return toReturn, err
			}

			//Result is a JSON string, so deserialize it and append to results
			game := Game.Game{}
			err = json.Unmarshal([]byte(gameJSON), &game)
			if err != nil {
				LogError(funcLogPrefix, err)
				return toReturn, err
			}

			toReturn = append(toReturn, game)
		}

		if cursor == 0 {
			break
		}
	}

	return toReturn, nil
}

// Caches the given [gameState] in redis. Returns nil for [error] if everything goes well
func CacheGameStateInRedis(gameState Session.GameState) (Session.GameState, error) {
	funcLogPrefix := "==CacheGameStateInRedis==:"
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Received GameState to cache", funcLogPrefix)

	//If the gameState doesn't have an ID yet,
	//Generate one for it by simply using the Current UNIX time in milliseconds
	id := gameState.Id
	if id == "" {
		log.Printf("%s GameState does not yet have an ID. Generating new one.", funcLogPrefix)
		id = GenerateId()
		log.Printf("%s ID successfully generated. Assigning ID {%s} to GameState", funcLogPrefix, id)
		gameState.Id = id
	}

	//Convert to string and save to Redis
	asJson, err := json.Marshal(gameState)
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	key := "gameState:" + id
	err = rdb.Set(ctx, key, asJson, 0).Err()
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	log.Printf("%s GameState cached with key=={%s}", funcLogPrefix, key)
	return gameState, nil
}

// Retrieves a gameState with an id == [id] from Redis. If everything goes well, then [error] is nil
func GetCachedGameStateFromRedis(id string) (Session.GameState, error) {
	funcLogPrefix := "==GetCachedGameStateFromRedis==:"
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Received request to get cached GameState from Redis", funcLogPrefix)

	gameState := Session.GameState{}

	//Catch empty id string early
	if id == "" {
		log.Printf("%s ERROR! Id cannot be empty. Returning empty GameState", funcLogPrefix)
		return gameState, fmt.Errorf("%s Id cannot be empty", funcLogPrefix)
	}

	//Try to get the game from Redis. If it doesn't exist, fail gracefully
	game, err := rdb.Get(ctx, "gameState:"+id).Result()
	if err == redis.Nil {
		log.Printf("%s Could not find cached GameState for key \"%s\"...Returning Empty GameState", funcLogPrefix, id)
		return gameState, fmt.Errorf("%s No game for Id=={%s} found", funcLogPrefix, id)
	} else if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	//game is a JSON string of a GameState, so unmarshal it
	err = json.Unmarshal([]byte(game), &gameState)
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	log.Printf("%s Found a GameState, returning result", funcLogPrefix)
	return gameState, nil
}

// Given an id to a Game defition, constructs and returns an initial GameState for it. This is essentially
// how to start the game
func GetInitialGameState(roomCode string) (Session.GameState, error) {
	funcLogPrefix := "==GetInitialGameState=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	gameState := Session.GameState{}

	lobby, err := LoadLobbyFromRedis(roomCode)
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	gameDef, err := GetGameDefFromDB(lobby.GameDefinitionId)
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	gameState.GameDefinitionId = gameDef.Id
	gameState.CurrentPhase = gameDef.BeginningPhase
	gameState.GamePieces = gameDef.Pieces //TODO: TEST THIS THOUROUGHLY TO MAKE SURE IT'S NOT SHALLOW COPYING

	startingResources := make([]Player.PlayerResource, len(gameDef.Resources))

	//Construct starting resources for each player
	for _, element := range gameDef.Resources {
		startingResources = append(startingResources, Player.PlayerResource{
			Name:         element.Name,
			CurrentValue: element.InitialValue,
			MaxValue:     element.MaxValue,
		})
	}

	gameState.PlayerStates = []Session.PlayerState{}

	for _, element := range lobby.Players {
		gameState.PlayerStates = append(gameState.PlayerStates, Session.PlayerState{
			AllowedActions: Actions.ActionSet{},
			Player: Player.Player{
				Id:   element.Id,
				Name: element.Name,
				Hand: Pieces.PieceSet{ //TODO: Let the game definition decide what should go in the Player's hand at the start
					Decks: []Pieces.Deck{
						{
							GamePiece: Pieces.GamePiece{
								Id:   GenerateId(),
								Name: "Deck 1",
								Tags: map[string]string{},
							},
							PieceContainer: Pieces.PieceContainer{
								TagsWhitelist: map[string][]string{},
							},
							Cards: []Pieces.Card{},
						},
					},
					CardPlaces: []Pieces.CardPlace{
						{
							GamePiece: Pieces.GamePiece{
								Id:   GenerateId(),
								Name: "CardPlace 1",
								Tags: map[string]string{},
							},
							PieceContainer: Pieces.PieceContainer{
								TagsWhitelist: map[string][]string{},
							},
							PlacedCards: []Pieces.Card{},
						},
					},
				},
				Resources: slices.Clone(startingResources),
			},
		})
	}

	gameState.CurrentPlayer = gameState.PlayerStates[0] //TODO: Make a better way to determine a starting player maybe?
	gameState.CurrentPlayer.AllowedActions = DeterminePlayerAllowedActions(&gameState, &gameDef)

	gameState, err = CacheGameStateInRedis(gameState)
	if err != nil {
		LogError(funcLogPrefix, err)
		return gameState, err
	}

	return gameState, nil
}

func DeterminePlayerAllowedActions(gameState *Session.GameState, gameDef *Game.Game) Actions.ActionSet {
	//TODO: Implement
	return Actions.ActionSet{}
}

// Submits an Action to the GameState with id == [gameId]. Will always return some GameState, even if something goes wrong, in which case [error] will not be nil.
// If the action is not allowed, [error] will indicate so, and it will simply return the GameState without any changes
func SubmitAction(gameId string, action Session.SubmittedAction) (Session.GameState, error) {
	funcLogPrefix := "==SubmitAction=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	//Grab last cached gameState
	gameState, err := GetCachedGameStateFromRedis(gameId)
	if err != nil {
		LogError(funcLogPrefix, err)
		return Session.GameState{}, err
	}

	//Only allow the player whose turn it is to take an action
	// if action.Player.Name != gameState.CurrentPlayer.Player.Name { TODO: Turn this back on when it's time
	// 	return gameState, fmt.Errorf("%s Error - Submitted player {%s} does not match gameState's current player {%s}", funcLogPrefix, action.Player.Name, gameState.CurrentPlayer.Player.Name)
	// }

	switch action.Type {
	case Session.MoveTurnType:
		turn := Session.MoveTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into MoveTurn: %s", funcLogPrefix, err)
		}
		turn.Execute(&gameState, action.Player)
	case Session.PieceUpdateTurnType:
		turn := Session.PieceUpdateTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into PieceUpdateTurn: %s", funcLogPrefix, err)
		}
		turn.Execute(&gameState, action.Player)
	case Session.PlacementTurnType:
		turn := Session.PlacementTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into PlacementTurn: %s", funcLogPrefix, err)
		}
		turn.Execute(&gameState, action.Player)
	case Session.TakeTurnType:
		turn := Session.TakeTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into TakeTurn: %s", funcLogPrefix, err)
		}
		err = turn.Execute(&gameState, action.Player)
		if err != nil {
			return gameState, fmt.Errorf("%s Error trying to execute TakeTurn: %s", funcLogPrefix, err)
		}
	case Session.TradeTurnType:
		turn := Session.TradeTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into TradeTurn: %s", funcLogPrefix, err)
		}
		turn.Execute(&gameState, action.Player)
	case Session.TransitionTurnType:
		turn := Session.TransitionTurn{}
		err = json.Unmarshal(action.Turn, &turn)
		if err != nil {
			LogError(funcLogPrefix, err)
			return gameState, fmt.Errorf("%s Error trying to unmarshal turn into TransitionTurn: %s", funcLogPrefix, err)
		}
		turn.Execute(&gameState, action.Player)
	default:
		return gameState, fmt.Errorf("%s Error - Submitted Action's type {%s} not recognized", funcLogPrefix, action.Type)
	}

	//Cache the updated gameState in Redis
	updated, err := CacheGameStateInRedis(gameState)
	if err != nil {
		return gameState, fmt.Errorf("%s Error trying to cache updated gameState. Action may not properly persist! %s", funcLogPrefix, err)
	}

	return updated, nil
}

func SaveLobbyInRedis(lobby Session.Lobby) (Session.Lobby, error) {
	funcLogPrefix := "==SaveLobbyInRedis=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Recieved request to save lobby in Redis", funcLogPrefix)

	asJson, err := json.Marshal(lobby)
	if err != nil {
		LogError(funcLogPrefix, err)
		return Session.Lobby{}, err
	}

	key := "lobby:" + lobby.RoomCode
	err = rdb.Set(ctx, key, asJson, 0).Err()
	if err != nil {
		LogError(funcLogPrefix, err)
		return Session.Lobby{}, err
	}

	log.Printf("%s Lobby saved in Redis with key == {%s}", funcLogPrefix, key)
	return lobby, nil
}

func LoadLobbyFromRedis(roomCode string) (Session.Lobby, error) {
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)
	funcLogPrefix := "==LoadLobbyFromRedis==:"

	log.Printf("%s Retrieving Lobby with RoomCode=={%s} from DB", funcLogPrefix, roomCode)

	lobby := Session.Lobby{}

	//Catch empty ID
	if roomCode == "" {
		log.Printf("%s ERROR! RoomCode cannot be empty. Returning empty Lobby", funcLogPrefix)
		return lobby, fmt.Errorf("%s Id cannot be empty", funcLogPrefix)
	}

	//Try to get the Game from Redis. If it doesn't exist, give a specific error for that
	def, err := rdb.Get(ctx, "lobby:"+roomCode).Result()
	if err == redis.Nil {
		log.Printf("%s Could not find cached lobby for roomCode \"%s\"...Returning Empty Lobby", funcLogPrefix, roomCode)
		return lobby, fmt.Errorf("%s No game for Id=={%s} found", funcLogPrefix, roomCode)
	} else if err != nil {
		LogError(funcLogPrefix, err)
		return lobby, err
	}

	//Result is just a JSON string, so we still need to deserialize/unmarshal it
	err = json.Unmarshal([]byte(def), &lobby)
	if err != nil {
		LogError(funcLogPrefix, err)
		return lobby, err
	}

	log.Printf("%s Found a lobby, returning result", funcLogPrefix)
	return lobby, nil
}

// Given a GameDefinition's ID and a player name, creates and saves a new lobby for that player's game, returning the Lobby's room code. The player is automatically added
// to the Lobby
func CreateRoom(gameDefId string) (string, error) {
	funcLogPrefix := "==CreateRoom=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Getting GameDef for Id == {%s}", funcLogPrefix, gameDefId)
	requestedGame, err := GetGameDefFromDB(gameDefId)
	if err != nil {
		LogError(funcLogPrefix, err)
		return "", err
	}

	log.Printf("%s Creating lobby object", funcLogPrefix)
	lobby := Session.Lobby{
		GameDefinitionId: requestedGame.Id,
		GameName:         requestedGame.Name,
		MaxPlayers:       requestedGame.MaxPlayers,
		NumPlayers:       0,
		Players:          []Player.Player{},
		Host:             Player.Player{},
	}

	log.Printf("%s Generating Room Code", funcLogPrefix)
	roomCode := generateRoomCode()

	log.Printf("%s Room Code successfully generated. Assigning RoomCode {%s} to Lobby", funcLogPrefix, roomCode)
	lobby.RoomCode = roomCode

	log.Printf("%s Saving Lobby to Redis", funcLogPrefix)
	lobby, err = SaveLobbyInRedis(lobby)
	if err != nil {
		LogError(funcLogPrefix, err)
		return "", err
	}

	log.Printf("%s Lobby Created & Saved. Returning RoomCode", funcLogPrefix)
	return roomCode, nil
}

func JoinRoom(roomCode string, playerName string) (Session.Lobby, string, error) {
	funcLogPrefix := "==JoinRoom=="
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)

	log.Printf("%s Recieved request from Player {%s} to join lobby with RoomCode == {%s}", funcLogPrefix, playerName, roomCode)

	lobby, err := LoadLobbyFromRedis(roomCode)
	if err != nil {
		LogError(funcLogPrefix, err)
		return Session.Lobby{}, "", err
	}

	//Only allow player to join if there's room
	if lobby.NumPlayers >= lobby.MaxPlayers {
		log.Printf("%s ERROR: Lobby's max player count {%d} already reached. Player cannot join!", funcLogPrefix, lobby.MaxPlayers)
		return Session.Lobby{}, "", fmt.Errorf("ERROR: Lobby's max player count {%d} already reached", lobby.MaxPlayers)
	}

	thisPlayer := CreatePlayerObject(playerName)

	//Create a copy, in case anything goes wrong
	updatedLobby := lobby
	updatedLobby.Players = slices.Clone(lobby.Players)

	log.Printf("%s Adding player {%s} to lobby's Player List", funcLogPrefix, playerName)

	//If this player is the first to join, set them as the host
	if updatedLobby.NumPlayers == 0 {
		updatedLobby.Host = thisPlayer
	}

	updatedLobby.Players = append(lobby.Players, thisPlayer)
	updatedLobby.NumPlayers++

	log.Printf("%s Player added. Caching new Lobby", funcLogPrefix)
	saved, err := SaveLobbyInRedis(updatedLobby)
	if err != nil { //If something goes wrong, re-save and return the version without any changes
		SaveLobbyInRedis(lobby)
		return Session.Lobby{}, "", err
	}

	log.Printf("%s Lobby joined and saved. Returning Lobby", funcLogPrefix)
	return saved, thisPlayer.Id, nil
}

func CreatePlayerObject(name string) Player.Player {
	funcLogPrefix := "==CreatePlayerObject=="
	LogUtil.SetLogPrefix(ModuleLogPrefix, PackageLogPrefix)
	defer LogUtil.EnsureLogPrefixIsReset()

	log.Printf("%s Creating Player object for Player name {%s}", funcLogPrefix, name)

	return Player.Player{
		Id:        GenerateId(),
		Name:      name,
		Hand:      Pieces.PieceSet{},
		Resources: []Player.PlayerResource{},
	}
}
