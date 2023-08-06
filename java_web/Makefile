SRC_TS_FILES = $(wildcard src/*.ts)
SRC_JS_FILES = ${SRC_TS_FILES:.ts=.js}
SRC_JS_FILES_ALL = $(SRC_JS_FILES)
SRC_JS_FILES_ALL += src/index.js

node_modules:
	yarn init -p -y
	yarn add three canvas-sketch canvas-sketch-util http fs webpack webpack-cli dat.gui @types/three @types/dat.gui typescript
$(SRC_JS_FILES): $(SRC_TS_FILES) node_modules
	yarn tsc -t es6 src/*.ts
dist/main.js: $(SRC_JS_FILES_ALL)
	yarn webpack
all: dist/main.js
	cd dist; http-server

clean: 
	rm -rf node_modules
	rm dist/main.js dist/main.js.LICENSE.txt -f
	rm yarn.lock package.json -f
	rm $(SRC_JS_FILES) -f
