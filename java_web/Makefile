SRC_TS_FILES = $(wildcard src/*.ts)
SRC_JS_FILES = ${SRC_TS_FILES:.ts=.js}
SRC_JS_FILES_ALL = $(SRC_JS_FILES)
SRC_JS_FILES_ALL += src/index.js

GLSL_SRC_FILES = $(wildcard src/*.frag.in)
GLSL_SRC_FILES += $(wildcard src/*.vert.in)
GLSL_FILES = ${subst .in,,${GLSL_SRC_FILES}}

node_modules:
	yarn init -p -y
	yarn add three canvas-sketch canvas-sketch-util http fs webpack webpack-cli dat.gui @types/three @types/dat.gui typescript glslify
$(SRC_JS_FILES): $(SRC_TS_FILES) node_modules
	yarn tsc -t es6 src/*.ts
dist/main.js: $(SRC_JS_FILES_ALL) $(GLSL_FILES)
	yarn webpack
%.vert: %.vert.in node_modules
	node_modules/glslify/bin.js $< -o $@
%.frag: %.frag.in node_modules
	node_modules/glslify/bin.js $< -o $@
all: dist/main.js
	cd dist; http-server

clean: 
	rm -rf node_modules
	rm dist/main.js dist/main.js.LICENSE.txt -f
	rm yarn.lock package.json -f
	rm $(SRC_JS_FILES) $(GLSL_FILES) -f
