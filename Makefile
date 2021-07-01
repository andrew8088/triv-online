build: main.go
	go build  -o bin/triv-online -v .

run: build
	./run.sh

default: build
