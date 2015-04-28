need to do:
- some additional js tasks
- retina options for spritesmith
- watch optimization
- base64 option doesn't work
- sass doesn't work

#IMPORTANT
for using project have to install globaly:
- node.js
- npm package manager
- bower
- if you want use SASS need install ruby

#General
- Begin to work - "npm install" (install nesesary packeges) then "gulp" or "npm start" to start project
- base or "default" task runs watch task witch consist:
	- connect - start server: localhost:8050 (port configurate in config.js)
	- watch - spy to your files and reload when they change
	- [LESS]
	- [JADE]
	- [JS]


##LESS
1. Compiling less in one file all.min.less (path and name for this file configurate in config.js)
2. Create source map near compiled less
3. Modify variables 
	* in base variant included only image variables: bg_path, tmp_path, sprites_path
	* if need add additional variable that need to be configurated with gulp it must be added into /src/styles/helpers/config.less and in gulpfile.js into less task in "pipe(less(modifyVars:{____}))" instead "____" (example in gulpfile.js).
4. Minify css by *CSSO*
5. small images converts into base64 
6. add prefix to properties consist with support version of brouser by *Autoprefix* (version supports browser configurate in confix.js)

##JADE
1. In markups folder lie *.jade files of pages
2. markups accommodate next folders:
	- extends - templates that extends in pages.
	- mixins - small part of code which can be used in many places (title etc.)
	- modules - folder with modules which are described in BRD 
3. Compiling jade files to html (destenation folder configurate in config.js)
4. To use Json data from file in module assign into module jade used variable a function getData(__PATH_TO_JSON__). Eample: - var data = getData('/modules/footer/footer.json')
5. variables for jade configurate in config .js "this.destPath"

##JS
1. Compiling js in one file all.min.js (path and name for this file configurate in config.js)
2. Create source map near compiled js

##SPRITE
1. General sprites must lie in src/images/sprites/
	- name folder become a name sprite img and will be sent to destanation img folder. Example: s-FOLDERNAME.png
	- name folder become a name sprite less and will be sent to "src/styles/components" folder. Example: s-FOLDERNAME.less
2. Sprites of modules must be in module folder ->/img/sprite/
	- - name module become a name sprite img and will be sent to destanation img folder. Example: s-MOUDLENAME.png
	- name module become a name sprite less and will be sent to "src/styles/components" folder. Example: s-FOLDERNAME.less
3. after generation LESS task starts.

##Imagemin
1. minify all images from base folder, temp folder and img folder from modules to one destination img folder (destenation folder configurate in config.js)
2. It caches files that have been minified. 

##Copy
- copied files from src fonts folder to destination fonts folder

###cleanDest
- delete destination folder (destination folder configurate in config.js)

###cleanCache
- delete cache which is used in imagemin task