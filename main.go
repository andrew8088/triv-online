package main

import (
	_ "github.com/heroku/x/hmetrics/onload"
	"net/http"
	"os"
	"strings"
)

func handleSlashCommand(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Path
	message = strings.TrimPrefix(message, "/")
	message = "hello " + message
	w.Write([]byte(message))
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	http.HandleFunc("/", handleSlashCommand)

	if err := http.ListenAndServe(":" + port, nil); err != nil {
		panic(err)
	}
}
