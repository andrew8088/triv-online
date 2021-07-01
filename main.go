package main

import (
	_ "github.com/heroku/x/hmetrics/onload"
	"log"
	"net/http"
	"os"
)

func handleOk(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}

func handleTrivSlashCommand(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok, let's get the game started!"))
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	http.HandleFunc("/command/triv", handleTrivSlashCommand)

	http.HandleFunc("/", handleOk)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}
