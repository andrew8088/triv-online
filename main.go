package main

import (
	"fmt"
	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/slack-go/slack"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func handleOk(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ok"))
}

func generateModalRequest() slack.ModalViewRequest {
	// Create a ModalViewRequest with a header and two inputs
	titleText := slack.NewTextBlockObject("plain_text", "Set up your trivia game", false, false)
	closeText := slack.NewTextBlockObject("plain_text", "Close", false, false)
	submitText := slack.NewTextBlockObject("plain_text", "Submit", false, false)

	headerText := slack.NewTextBlockObject("mrkdwn", "Please enter your name", false, false)
	headerSection := slack.NewSectionBlock(headerText, nil, nil)

	firstNameText := slack.NewTextBlockObject("plain_text", "First Name", false, false)
	firstNamePlaceholder := slack.NewTextBlockObject("plain_text", "Enter your first name", false, false)
	firstNameElement := slack.NewPlainTextInputBlockElement(firstNamePlaceholder, "firstName")
	// Notice that blockID is a unique identifier for a block
	firstName := slack.NewInputBlock("First Name", firstNameText, firstNameElement)

	lastNameText := slack.NewTextBlockObject("plain_text", "Last Name", false, false)
	lastNamePlaceholder := slack.NewTextBlockObject("plain_text", "Enter your first name", false, false)
	lastNameElement := slack.NewPlainTextInputBlockElement(lastNamePlaceholder, "lastName")
	lastName := slack.NewInputBlock("Last Name", lastNameText, lastNameElement)

	blocks := slack.Blocks{
		BlockSet: []slack.Block{
			headerSection,
			firstName,
			lastName,
		},
	}

	var modalRequest slack.ModalViewRequest
	modalRequest.Type = slack.ViewType("modal")
	modalRequest.Title = titleText
	modalRequest.Close = closeText
	modalRequest.Submit = submitText
	modalRequest.Blocks = blocks
	return modalRequest
}

func handleTrivSlashCommand(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("handling slash command");

	signingSecret := os.Getenv("SLACK_SIGNING_SECRET");

	if signingSecret == "" {
		fmt.Println("no signingSecret found")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	verifier, err := slack.NewSecretsVerifier(r.Header, signingSecret)

	if err != nil {
		fmt.Printf("Error creating verifier: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err = verifier.Ensure(); err != nil {
		fmt.Printf("Error ensuring request: %s\n", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	r.Body = ioutil.NopCloser(io.TeeReader(r.Body, &verifier))
	s, err := slack.SlashCommandParse(r)
	if err != nil {
		fmt.Printf("Error parsing slash command: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	api := slack.New(os.Getenv("SLACK_API_TOKEN"), slack.OptionDebug(true))

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("starting the game!"))
	modalRequest := generateModalRequest()
	_, err = api.OpenView(s.TriggerID, modalRequest)
	if err != nil {
		fmt.Printf("Error opening view: %s\n", err)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT must be set")
	}

	http.HandleFunc("/command/triv", handleTrivSlashCommand)

	http.HandleFunc("/", handleOk)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}
