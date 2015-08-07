# gulp
This Gulp file prepares an app to be ready for publishing. 

The app first passes through a first phase which is the development phase, and then it goes through another phase 
which is the building phase.

In the development phase all Typescript files are compiled, all Less files are converted to CSS, browser prefixes 
are added to the CSS file, all bowser components are added to the index.html, and all JS/CSS scripts are also added 
to the index.html. Two watchers are implemented to watch for all Typescript and Less changes in files. 

In the building phase images are compressed, HTML/CSS/JS files are minifed, fonts are copied to the build destination, angular dependencies get fixed, and html files are added to the angular template cache to minimize 
Ajax calls.

Sources to the files can be simply specified in the gulp.config.js


This gulp file takes into consideration the following App structure:

Note: In the first phase the root folder is Development, and in the last phase the root folder is Build

 App

  _public
  
    Img
    
    Styles
    
      Less
      
      Fonts
      
  Component
  
    Component.js
    
    Component.html
    
  Layout
  
    directive.ts
    
  Services
  
    service.ts
    
  Filters
  
    filter.ts
    
  App.ts
  
  App.config.ts
  
  App.routes.ts
  
  MainCtrl.ts
  
 Index.html

 gulpFile.js
 
 gulp.config.js

 package.json

 bower.json
