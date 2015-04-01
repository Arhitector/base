works:
- server [connect]
- watch [watch] (start server, watch, less, jade, imagemin)
- imagemin [imagemin]
- clear destination folder [clearDest]
- clear cache [clearCache]
- js [js]

need to do:
- some additional js tasks
- sprite for each folder
- jade: include json
-	.on('error', function (err) {
		console.error('Task failed: ' + err);
	})

#General
- Begin to work - "npm install" (install nesesary packeges) then "gulp" or "npm start" to start progect
- base or "default" task runs watch task witch consist:
	- connect - start server: localhost:8050 (port configurate in config.js)
	- watch - spy to your files and reload when the change
	- [LESS]
	- [JADE]
	- [JS]


##LESS
1. Compiling less in one file all.min.less (path and name for this file configurate in config.js)
2. Create source map near compiled less
3. Modify variables 
	* in base variant included only image variables: bg_path, tmp_path, sprites_path
	* if need add additionsl variable that need to be configurated with gulp it's need to be added into /src/styles/helpers/config.less and in gulpfile.js into less task in "pipe(less(modifyVars:{____}))" instead "____" (example in gulpfile.js).
4. Minify css by *CSSO*
5. add prefix to properties consist with support version of brouser by *Autoprefix* (version supports browser configurate in confix.js)

##JADE
1. In markups folder lie *.jade files of pages
2. markups accommodates next folders:
	- extends - templates that extends in pages.
	- includes - files witch include to extends templates: head with meta data included css and so on, footer with included scripts
	- mixins - small part of code witch can be using on many place (title etc.)
	- modules - folder with modules witch discription in BRD 
3. Compiling jade files to html (destenation folder configurate in config.js)
4. variables for jade configurate in config .js "this.destPath"

##JS
1. Compiling js in one file all.min.js (path and name for this file configurate in config.js)
2. Create source map near compiled js

##Imagemin
1. minify all images from base folder, temp folder and img folder from modules to destination img folder (destenation folder configurate in config.js)

##Copy
- copyed files from src font folder to destenation font folder

###cleanDest
- delete destaenation folder (destenation folder configurate in config.js)

###clearCache
- delete cache witch using in imagemin task