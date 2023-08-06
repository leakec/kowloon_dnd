SRC_JS_FILES = $(wildcard src/*.js)

node_modules:
	yarn add three canvas-sketch canvas-sketch-util http fs webpack webpack-cli dat.gui
dist/main.js: $(SRC_JS_FILES)
	yarn webpack
all: dist/main.js
	cd dist; http-server
