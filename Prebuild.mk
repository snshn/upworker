#!/usr/bin/make -f

INSTALL_DEPS: ## Install required dependencies
	@npm install
.PHONY: INSTALL_DEPS

INSTALL_DEPS_GLOBAL: ## Globally install required dependencies
	@node package.js
.PHONY: INSTALL_DEPS_GLOBAL

UPDATE_LOCK_FILE: ## Generate new package-lock.json file based on contents of package.json
	@npm i --quiet --no-audit --no-progress --package-lock-only > '/dev/null' 2>&1
.PHONY: UPDATE_LOCK_FILE
