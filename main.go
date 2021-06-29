package main

import (
	"net/http"
	"strings"
)

func handleSlashCommand(w http.ResponseWriter, r *http.Request) {
	message := r.URL.Path
	message = strings.TrimPrefix(message, "/")
	message = "hello " + message
	w.Write([]byte(message))
}

func main() {
	http.HandleFunc("/", handleSlashCommand)
	if err := http.ListenAndServe(":8088", nil); err != nil {
		panic(err)
	}
}
