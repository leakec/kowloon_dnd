node_modules:
	yarn add three canvas-sketch canvas-sketch-util http fs webpack webpack-cli
dist/main.js: src/index.js
	yarn webpack
all: dist/main.js
	cd dist; http-server
