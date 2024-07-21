package main

import (
	"github.com/gorilla/websocket"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

/*
	func TestHostLobbyMissingParameters(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(hostLobby))
		defer server.Close()

		scenarios := []string{
			"?gameId=game123",      // Missing playerName
			"?playerName=JohnDoe", // Missing gameId
			"",                 // Missing both
		}

		for _, scenario := range scenarios {
			resp, err := http.Get(server.URL + scenario)
			if err != nil {
				t.Errorf("Unexpected error: %v", err)
			}
			if resp.StatusCode != http.StatusBadRequest {
				t.Errorf("Expected status code 400, got %d", resp.StatusCode)
			}
		}
	}
*/

func TestHostLobby(t *testing.T) {
	// Setup
	gameDefId := "game123"
	playerName := "JohnDoe"

	// Create a test server using the hostLobby handler
	server := httptest.NewServer(http.HandlerFunc(hostLobby))
	defer server.Close()

	// Modify the URL for WebSocket usage
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "?gameId=" + gameDefId + "&playerName=" + playerName

	// Connect to the WebSocket server
	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to open ws connection on %s: %v", wsURL, err)
	}
	defer ws.Close()

	// Read the message from the WebSocket connection
	_, p, err := ws.ReadMessage()
	if err != nil {
		t.Errorf("Failed to read message from WebSocket connection: %v", err)
		return
	}

	// Check that the received lobby code is not empty
	receivedLobbyCode := string(p)
	if receivedLobbyCode == "" {
		t.Errorf("Received an empty lobby code, expected a non-empty value")
	}
	//ws.WriteJSON("Quit")
}
