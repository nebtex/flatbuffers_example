CURRENT_DIR=$(shell pwd)
GOLANG_MAIN=$(CURRENT_DIR)/cmd/main.go
GOLANG_MAIN_BUILD=$(CURRENT_DIR)/.build

all: compile_main compile_js
	$(GOLANG_MAIN_BUILD)/main > data.bytes
	@node index.js $(CURRENT_DIR)/data.bytes

compile_js:js_dep
	@flatc -o $(CURRENT_DIR)/js -s $(CURRENT_DIR)/schemas/User.fbs $(CURRENT_DIR)/schemas/Group.fbs

js_dep:clean_js
	@mkdir -p js 2>/dev/null

clean_js:
	@rm -rf $(CURRENT_DIR)/js

compile_main:compile_golang
	@rm -rf $(GOLANG_MAIN_BUILD)
	@go build -o $(GOLANG_MAIN_BUILD)/main $(GOLANG_MAIN)

compile_golang:clean_golang
	@flatc -g $(CURRENT_DIR)/schemas/User.fbs $(CURRENT_DIR)/schemas/Group.fbs

clean_golang:
	@rm -rf $(CURRENT_DIR)/Chat

.PHONY: all compile_main compile_golang clean_golang compile_js js_dep clean_js
