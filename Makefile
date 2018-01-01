# Makefile for upworker

.PHONY: all config run

all: run

config:
	cp -u config.def.js config.js

run: config
	npm run-script run
