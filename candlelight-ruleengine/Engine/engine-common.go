package Engine

import (
	"fmt"
	"log"
	"math/rand" //May want to change this to crypto/rand for better security, but for the prototype this is more than fine
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	ModuleLogPrefix  = "CANDLELIGHT-RULEENGINE"
	PackageLogPrefix = "Engine"
	RedisAddress     = "localhost:6379"
)

var rdb = redis.NewClient(&redis.Options{
	Addr: RedisAddress,
})

// Generates an ID for something. To ensure it's unique, I'm just using the current UNIX time in
// milliseconds. Will probably need to change to something more random later
func GenerateId() string {
	const lettersAndNumbers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	code := make([]byte, 10)
	for i := range code {
		code[i] = lettersAndNumbers[rand.Intn(len(lettersAndNumbers))]
	}

	return fmt.Sprint(time.Now().UnixMilli(), string(code))
}

// Generates a random 4-character room code. For use in creating lobbies
func generateRoomCode() string {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	code := make([]byte, 4)
	for i := range code {
		code[i] = letters[rand.Intn(len(letters))]
	}

	return string(code)
}

// Logs the error in the format of "[funcLogPrefix] ERROR! [err]"
func LogError(funcLogPrefix string, err error) {
	log.Printf("%s ERROR! %s", funcLogPrefix, err)
}
