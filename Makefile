BIN = ./node_modules/.bin

bootstrap: node_modules

node_modules: yarn.lock package.json
	@yarn
	@touch node_modules

start:
	@NODE_ENV=development $(BIN)/nodemon .

lint:
	@$(BIN)/standard -v

test: deploy
	@$(BIN)/jest tests

deploy:
	@NODE_ENV=production docker-compose up -d

teardown:
	@docker-compose down --rmi local
