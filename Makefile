build: bin/triv-online
	go build  -o bin/triv-online -v .

run: build
	PORT=8088 bin/triv-online

default: build
