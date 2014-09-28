#Markup boilerplate.

Modules:
- jade
- sprites
- less (or sass), less by default
- image minifier
- livereload
- server
- clear
- copy
- marge-json

##Steps:
- Go to the directory with the project
- In the console: npm install (and wait)
- npm start or grunt (for more info see point grunt)
- open [http://localhost:8080/markup/](http://localhost:8080/markup/)
- base configuration variable you can change in app/css/less/components/var.less && app/jade/source/var.jade
- enjoy

Reload works while maintaining and autobuild sass, less files.

##Grunt
- 4 base task
	- grunt or npm start (compile start server, compile less or sass, jade, marge json, crate sprites from "for_sprite" folder and start watch)
	- grunt all (like first task exept start server and watch)
	- grunt clear (clear folder build, markup, delete all.min.css, delete installed npm-modules)
	- grunt copy (copy files from project in separate folder(all.min.css, image folder, murkup folder, js folder),  look gruntfile.js -> task "copy")

##Jade 
- for use some mixin, first of all you need include it in top (example in example.jade)
- there are already few global mixins are included(list, pagination)

##less architecture
- all.* - import all style here (sourcemap require import all styles into one common file).
- components - folder for style components like, _table, _buttons, _forms, etc.
- modules - some kind of interface or layouts _header, _footer, _article, etc.
- lib - libs, plugins styles.

##JS plugin
- there are included few useful plugins:
	- bxslider (slider)
	- scroll-pane (custom scroll)
	- chosen (suctom select)
	- tablesaw (script for responsive table)
- the examples you may see in app/jade/example.jade
- you may delete them from 
	- css: from app/css/lib/all.less (//lib part)
	- js: from app/jade/source/footer.jade
	- css files: app/css/less/lib/[plugin name].css
	- js files: app/js/[plugin name].js

##Important:
- a markup language sass has two dependences, they are  Ruby and of course sass for Ruby itself. It's nesessary to install these dependences before using your platform
- sass sourcemap require (Sass 3.3.0, which can be installed with gem install sass --pre) and uncomment sourcemap in Gruntfile.js
- if you need one of the languages in your project it's better to disable the second one to avoid errors (see the file Gruntfile.js and params "CSSBuilder").
- use one common file to import less or sass styles (require for sourcemap) all.less, all.scss

###SASS
	1. change var CSSBuilder to 'sass' (gruntfile.js)
	2. install Ruby http://www.rubyinstaller.org/downloads/
	- Don't forget to note add ruby into PATH
	3. in consol do 'gem install sass'
	4. enjoy