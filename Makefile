
all: public/application.js

public/application.js: public/javascripts/*.js
	cat public/javascripts/*.js | node_modules/uglify-js/bin/uglifyjs > public/application.js
clean:
	rm -f public/application.js
