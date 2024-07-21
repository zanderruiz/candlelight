module candlelight-api

go 1.22.0

replace candlelight-ruleengine => ../candlelight-ruleengine

replace candlelight-models => ../candlelight-models

require (
	candlelight-models v0.0.0-00010101000000-000000000000
	candlelight-ruleengine v0.0.0-00010101000000-000000000000
	github.com/go-redis/redis/v8 v8.11.5
	github.com/gorilla/websocket v1.5.1
	github.com/stretchr/testify v1.9.0
)

require (
	github.com/cespare/xxhash/v2 v2.1.2 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/stretchr/objx v0.5.2 // indirect
	golang.org/x/net v0.17.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
