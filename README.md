# gulp-project-automation

# Installation

  Open up the terminal, and run these commands

    mv ~/Desktop/path-to-my-project/gulp-project-automation/**/  ~/Desktop/path-to-my-project/

    rm -rf "gulp-project-automation"
  
    bower install (Optional: in case there's no bower.json file in the current project)
    
    npm install

    Then, run 

      gulp env-development

      gulp env-build
      
    For Testing, run

      karma start karma.conf.js (Results can be seen successfully passed using karma-spec-reporter)
    
    
# About this Gulp

    This Gulp file prepares an AngularJs app that is mixed with Typescript to be ready for publishing. 
    
    The App passes through two phases
    
        Development Phase
        
        Building/Production Phase

    In the development phase all Typescript files are compiled, all Less files are converted to CSS, 
    browser prefixes are added to the main CSS file, all bower components are added to the index.html, 
    and all JS/CSS scripts are also added to the index.html. 

    Two watchers are also implemented to watch for all Typescript and Less changes in files. 
    Any new TS file will be compiled and added automatically to the index.html through a specific 
    additional watcher. Once a TS file is deleted, it will be automatically removed from the index.html. 
    BrowserSync module is also implemented that reloads the browser on any file change.
    
    In the building phase images are compressed, HTML/CSS/JS files are minifed, fonts are copied to the 
    build destination, angular dependencies get fixed, and html files are added to the angular template 
    cache to minimize Ajax calls.


# App Structure

 App
 
  _public
  
    Img
    
    Styles
    
      Less
      
      Fonts
      
  Component
  
    Component.ts
    
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
  
  
  
Note: In the first phase the root folder is Development, and in the last phase the root folder is Build.