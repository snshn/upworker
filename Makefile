#!/usr/bin/make -f

# Makefile for upworker

ifeq ($(OS),Windows_NT)
    CWD ?= "$(shell echo %CD%)"
    DOCKER ?= docker
else
    CWD ?= "$(shell pwd)"
    DOCKER ?= $(if $(shell docker -v 2>/dev/null),docker,podman)
endif
DOCKER_IMAGE_TAG ?= upworker

.DEFAULT_GOAL := help

all: dev
.PHONY: all

include Prebuild.mk

help: ## Show this helpful message
	@for ML in $(MAKEFILE_LIST); do \
		grep -E '^[a-zA-Z_-]+:.*?## .*$$' $$ML | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'; \
	done
.PHONY: help

build_dev: ## Build development container
	@$(DOCKER) build -t $(DOCKER_IMAGE_TAG)/development -f Dockerfile.dev .
.PHONY: build_dev

config.js: ## Create config file
	@cp -u config.def.js config.js

run: build_dev ## Run development web server using containers
	@$(DOCKER) run -it --rm -v $(CWD):/src/upworker/ $(DOCKER_IMAGE_TAG)/development
.PHONY: run

RUN: config.js ## Run
	@npm run run
.PHONY: RUN

shell: ## Enter container's shell
	@$(DOCKER) run -it --rm -v $(CWD):/src/upworker/ $(DOCKER_IMAGE_TAG)/development sh
.PHONY: shell

update-lock-file: build_dev ## Update package-lock.json
	@$(DOCKER) run --rm --entrypoint "/bin/sh" $(DOCKER_IMAGE_TAG)/development -c "make -f Prebuild.mk UPDATE_LOCK_FILE && cat package-lock.json" > package-lock.json
.PHONY: update-lock-file
