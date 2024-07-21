package RuleEngine

import (
	"candlelight-api/LogUtil"
	"candlelight-models/Game"
	"candlelight-ruleengine/Engine"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func SaveGame(w http.ResponseWriter, r *http.Request) {
	funcLogPrefix := "==SaveGame==:"
	defer LogUtil.EnsureLogPrefixIsReset()
	LogUtil.SetLogPrefix(LogUtil.ModuleLogPrefix, PackagePrefix)

	log.Printf("%s Received request to save a game!", funcLogPrefix)

	d := json.NewDecoder(r.Body)
	req := Game.Game{}

	err := d.Decode(&req)
	if err != nil {
		log.Printf("%s ERROR! %s", funcLogPrefix, err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("%s Sending game to be saved...", funcLogPrefix)
	saved, err := Engine.SaveGameDefToDB(req)
	if err != nil {
		log.Printf("%s ERROR! %s", funcLogPrefix, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("%s Save successful, sending response to client...", funcLogPrefix)

	asJson, _ := json.Marshal(saved)
	fmt.Fprint(w, string(asJson))
}

func GetGame(w http.ResponseWriter, r *http.Request) {
	funcLogPrefix := "==GetGame==:"

	log.Printf("%s Received request to get a game!", funcLogPrefix)

	// Assuming the game ID is passed as a query parameter
	gameID := r.URL.Query().Get("id")
	if gameID == "" {
		log.Printf("%s No game ID provided", funcLogPrefix)
		http.Error(w, "No game ID provided", http.StatusBadRequest)
		return
	}

	log.Printf("%s Sending request for game from DB", funcLogPrefix)
	game, err := Engine.GetGameDefFromDB(gameID)
	if err != nil {
		log.Printf("%s ERROR: %s", funcLogPrefix, err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("%s Load successful, sending response to client", funcLogPrefix)
	// Return the game data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(game)
}

func GetAllGames(w http.ResponseWriter, r *http.Request) {
	funcLogPrefix := "==GetAllGames=="

	log.Printf("%s Received request for ALL games", funcLogPrefix)

	games, err := Engine.GetAllGamesFromDB()
	if err != nil {
		log.Printf("%s ERROR: %s", funcLogPrefix, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	log.Printf("%s Load successful, checking if client wants it slimmed or not", funcLogPrefix)
	w.Header().Set("Content-Type", "application/json")

	slimmedReq := r.URL.Query().Get("slimmed")
	if slimmedReq == "" {
		log.Printf("%s [slimmed] URL param not detected. Returning full object...", funcLogPrefix)
		json.NewEncoder(w).Encode(games)
	} else if slimmedReq == "true" {
		//TODO: This is kinda a terrible way to slim this down. Definitely will need optimization as the system gets bigger
		log.Printf("%s Client requested slimmed object. Returning array with just IDs and Names...", funcLogPrefix)
		type SlimmedGame struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		}
		slimmedArr := []SlimmedGame{}

		for _, g := range games {
			new := SlimmedGame{
				Id:   g.Id,
				Name: g.Name,
			}

			slimmedArr = append(slimmedArr, new)
		}

		json.NewEncoder(w).Encode(slimmedArr)
	} else {
		log.Printf("%s [slimmed] URL param set to unrecognized value {%s}. Returning full object...", funcLogPrefix, slimmedReq)
		json.NewEncoder(w).Encode(games)
	}
}
