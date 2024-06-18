##@ General

# Default branch is the current branch
BRANCH ?= $(shell git for-each-ref --format='%(objectname) %(refname:short)' refs/heads | awk "/^$$(git rev-parse HEAD)/ {print \$$2}")

# The help target prints out all targets with their descriptions organized
# beneath their categories. The categories are represented by '##@' and the
# target descriptions by '##'. The awk commands is responsible for reading the
# entire set of makefiles included in this invocation, looking for lines of the
# file as xyz: ## something, and then pretty-format the target and help. Then,
# if there's a line with ##@ something, that gets pretty-printed as a category.
# More info on the usage of ANSI control characters for terminal formatting:
# https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters
# More info on the awk command:
# http://linuxcommand.org/lc3_adv_awk.php
.PHONY: help
help: ## Show help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ AHT

# Usage example: make aht-deploy BRANCH=release/24.6.2
# Usage example: make aht-deploy
.PHONY: aht-deploy
aht-deploy: ## Deploy the app in the chosen branch or current branch
	./scripts/aht-deploy.sh $(BRANCH)

.PHONY: aht-status
aht-status: ## Show status of containers
	docker compose -f docker-compose.aht.dev.yml ps

.PHONY: aht-logs
aht-logs: ## Show logs for all containers
	docker compose -f docker-compose.aht.dev.yml logs --tail=100 -f

.PHONY: aht-clean
aht-clean: ## Clean up containers
	docker compose -f docker-compose.aht.dev.yml down

##@ SAPP

