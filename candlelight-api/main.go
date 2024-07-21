package main

import (
	"candlelight-api/RuleEngine"
	"candlelight-models/Game"
	"candlelight-models/Session"
	"candlelight-ruleengine/Engine"
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// Mutex to control access to the clients map
// do PlayerId instead
// Outer key is the room code
// in key is the playId
// value is the websocket
var gamesClients = make(map[string]map[string]*websocket.Conn)
var gamesClientsMutex = sync.Mutex{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  32768, // Setting read buffer size to 32 KB
	WriteBufferSize: 32768, // Setting write buffer size to 32 KB
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	startServer()
}

func startServer() {
	registerPathHandlers()

	//Go does the strangest datetime string formatting I've ever seen. You give it a specific date/time (Specifically Jan 2, 2006 3:04:05 PM GMT-7)
	//in the format you want, and it'll match whatever the object is into that format
	logName := fmt.Sprintf("./logs/%v.log", time.Now().Format("2006-01-02_15-04-05"))

	//Log file & Server startup
	log.SetPrefix("CANDLELIGHT-API: ")
	logfile, err := os.OpenFile(logName, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Error opening log file: %v", err)
	}
	defer logfile.Close()
	log.SetOutput(logfile)

	log.Println("Starting HTTP listener...")

	//Starts the server at localhost:10000
	http.ListenAndServe(":10000", nil)
}

// hostLobby creates the waiting lobby, and upgrades the host into a websocket. Anyone can connect with the room code, which they will then get upgraded into a
// websocket as well elsewhere

func hostLobby(w http.ResponseWriter, r *http.Request) {
	log.Println("Starting hostLobby")
	gameDefId := r.URL.Query().Get("gameId")
	playerName := r.URL.Query().Get("playerName")

	if gameDefId == "" || playerName == "" {
		log.Println("Missing gameId or playerName in request")
		http.Error(w, "Missing gameId or playerName in request", http.StatusBadRequest)
		return
	}

	lobbyCode, err := Engine.CreateRoom(gameDefId) // Assuming Engine.CreateRoom initializes room in DB
	if err != nil {
		http.Error(w, "Unable to create room", http.StatusInternalServerError)
		return
	}
	lobbyInfo, playerID, err := Engine.JoinRoom(lobbyCode, playerName)
	if err != nil {
		log.Printf("Error joining room: %v\n", err)
		http.Error(w, "Unable to join room", http.StatusInternalServerError)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "WebSocket upgrade failed", http.StatusInternalServerError)
		return
	}
	type GameMessage struct {
		PlayerID  string      `json:"playerID"`
		LobbyInfo interface{} `json:"lobbyInfo"`
	}
	msg := GameMessage{
		PlayerID:  playerID,
		LobbyInfo: lobbyInfo,
	}
	conn.WriteJSON(msg)
	gamesClientsMutex.Lock()
	if _, exists := gamesClients[lobbyCode]; !exists {
		gamesClients[lobbyCode] = make(map[string]*websocket.Conn)
	}
	gamesClients[lobbyCode][playerName] = conn
	gamesClientsMutex.Unlock()

	go manageLobby(lobbyCode)
}

// Manage all clients assosciated with one lobbyCode
func manageLobby(lobbyCode string) {
	for {

		gamesClientsMutex.Lock()
		lobby := gamesClients[lobbyCode]

		gamesClientsMutex.Unlock()

		for playerId, conn := range lobby {
			_, message, err := conn.ReadMessage()
			if err != nil {
				gamesClientsMutex.Lock()
				lobby[playerId].Close()
				delete(lobby, playerId)
				gamesClientsMutex.Unlock()
				log.Fatal()
				continue // I don't handle disconnection rn
			}
			processMessage(lobbyCode, playerId, message)
		}
		// Add appropriate delay or termination condition
	}
}
func handleJoinLobby(w http.ResponseWriter, r *http.Request) {
	lobbyCode := r.URL.Query().Get("roomCode")
	playerName := r.URL.Query().Get("playerName")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "WebSocket upgrade failed", http.StatusInternalServerError)
		return
	}
	lobbyInfo, playerID, err := Engine.JoinRoom(lobbyCode, playerName)
	if err != nil {
		log.Printf("Error joining room: %v\n", err)
		http.Error(w, "Unable to join room", http.StatusInternalServerError)
		return
	}

	gamesClientsMutex.Lock()
	if _, exists := gamesClients[lobbyCode]; !exists {
		http.Error(w, "Lobby does not exist", http.StatusBadRequest)
		gamesClientsMutex.Unlock()
		return
	}
	type GameMessage struct {
		PlayerID  string      `json:"playerID"`
		LobbyInfo interface{} `json:"lobbyInfo"`
	}
	msg := GameMessage{
		PlayerID:  playerID,
		LobbyInfo: lobbyInfo,
	}
	conn.WriteJSON(msg)
	gamesClients[lobbyCode][playerID] = conn
	gamesClientsMutex.Unlock()
	go handShake(lobbyCode, playerID)
}

// handShake sends out the lobby info to everyone with the player who just joined
func handShake(lobbyCode string, newPlayerId string) {
	gamesClientsMutex.Lock()
	lobby := gamesClients[lobbyCode]
	gamesClientsMutex.Unlock()
	jsonLobby, err := Engine.LoadLobbyFromRedis(lobbyCode)
	type GameMessage struct {
		PlayerID  string      `json:"playerID"`
		LobbyInfo interface{} `json:"lobbyInfo"`
	}
	msg := GameMessage{
		PlayerID:  newPlayerId,
		LobbyInfo: jsonLobby,
	}
	for playerId, conn := range lobby {
		if err != nil {
			log.Fatal("error connecting: {}", err, playerId)
		}
		err := conn.WriteJSON(msg)
		if err != nil {
			log.Println("Error sending handshake, aborting connection ", playerId)
			gamesClientsMutex.Lock()
			lobby[playerId].Close()
			delete(lobby, playerId)
			gamesClientsMutex.Unlock()
			continue // I don't handle disconnection rn
		}
	}
}

// This gets called on loop per lobby
func processMessage(lobbyCode string, playerId string, message []byte) {

	var msg struct {
		JsonType string          `json:"jsonType"`
		Data     json.RawMessage `json:"data"` //Raw message delays the parsing
	}
	json.Unmarshal(message, &msg)
	switch msg.JsonType {
	case "startGame":
		game, err := Engine.GetInitialGameState(lobbyCode)
		if err != nil {
			log.Fatal("GAME NOT STARTED, ABORTING", err, playerId)
			return
		}

		lobby := gamesClients[lobbyCode]
		for playerId, conn := range lobby {
			if err != nil {
				log.Fatal("error connecting: {}", err, playerId)
			}
			err := conn.WriteJSON(game)
			if err != nil {
				log.Println("Error sending sending lobby, skipping meesage to ", playerId)
				continue // I don't handle disconnection rn
			}
		}
	case "submitAction":
		var action struct {
			GameId string                  `json:"gameId"`
			Action Session.SubmittedAction `json:"action"`
		}
		if err := json.Unmarshal(msg.Data, &action); err != nil {
			log.Fatal("error decoding submitAction: {}", err, playerId)
		}

		lobby := gamesClients[lobbyCode]
		gameState, err := Engine.SubmitAction(action.GameId, action.Action)
		if err != nil {
			log.Fatal("error with submitAction: {}", err, playerId)
		}

		for playerId, conn := range lobby {
			log.Println("Sending updated gameState to", playerId)
			if err := conn.WriteJSON(gameState); err != nil {
				log.Println("Error sending gameState, skipping meesage to ", playerId)

				continue // Assuming you will handle disconnections later
			}
		}
	default:
		log.Println("Unknown type sent, ignoring message recieved", msg)
	}
}

func registerPathHandlers() {
	http.HandleFunc("/", heartbeat)
	http.HandleFunc("/studio", handleRules) // Handle rule collection
	http.HandleFunc("/dummy", generateJSON)
	http.HandleFunc("/saveGame", RuleEngine.SaveGame)
	http.HandleFunc("/allGames", RuleEngine.GetAllGames)
	http.HandleFunc("/joinLobby", handleJoinLobby)
	http.HandleFunc("/hostLobby", hostLobby) //TODO Zach is correcting how saveGame works.
	//TODO it just needs a correction in it's pathing
	//http.HandleFunc("/saveGame", RuleEngine.SaveGame)

	//Zander's logic with the game
	/**
	Client will send action, understand that it just sent that
	ping api, or response from post request
	Easy refactor for multiple clients
	FRONTEND will just spam the backend api... No special thing on
	my end?
	LONGTERM QUESTION: Do you want to see other peoples actions live?

	*/
	//game

	//http.HandleFunc("/dummystate", Engine.GetGameFromDB)
	/*
	* eventually needs
	* launch_pod(not needed until summer/fall semester)
	*
	* requestGames
	* requestHost
	 */
}
func heartbeat(w http.ResponseWriter, r *http.Request) {
	log.Println("==Heartbeat==: Returning dummy response...")
	fmt.Fprintf(w, "Buh-dump, buh-dump")
}
func generateJSON(w http.ResponseWriter, r *http.Request) {
	game := Game.Game{
		Id:         "game123",
		Name:       "Epic Adventure",
		Genre:      "Strategy",
		MaxPlayers: 4,
		Resources: []Game.GameResource{
			{
				Id:           "resource1",
				Name:         "Gold",
				Description:  "Used to buy items and upgrades",
				InitialValue: 100,
				MaxValue:     1000,
				MinValue:     0,
			},
			{
				Id:           "resource2",
				Name:         "Mana",
				Description:  "Required for casting spells",
				InitialValue: 50,
				MaxValue:     500,
				MinValue:     0,
			},
		},
	}
	Engine.SaveGameDefToDB(game)
	w.Header().Set("Content-Type", "application/json")
	//json.NewEncoder(w).Encode(game)
	asJson, _ := json.Marshal(game)
	fmt.Fprint(w, string(asJson))
}

/**
* Reminder on REST api structuring
* CREATE -> POST
* READ -> GET
* UPDATE -> PUT
* DELETE -> DELETE
 */
func handleRules(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		RuleEngine.GetGame(w, r) //right now just gets specific ID ruleset
	case "POST":
		RuleEngine.SaveGame(w, r) // Handle POST - Create a new rule
	case "UPDATE":
		//don't do update
	default:
		http.Error(w, "Method not allowed or implemented", http.StatusMethodNotAllowed)
	}
}

// handleSpecificRule handles individual rules (GET, PUT, DELETE)
func handleSpecificRule(w http.ResponseWriter, r *http.Request) {
	ruleID := strings.TrimPrefix(r.URL.Path, "/studio/rules/")
	if ruleID == "" {
		http.Error(w, "Rule ID required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		// Handle GET - Fetch a specific ruleSet using ruleID
	case "PUT":
		// Handle PUT - Update a specific ruleSet using ruleID
	case "DELETE":
		// Handle DELETE - Delete a specific ruleSet using ruleID
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
