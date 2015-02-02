# roots-ualib
The Word Press Roots.io child theme for the University of Alabama Libraries

## Dependencies
- [NodeJS](http://nodejs.org/)
    - [GruntJS](http://gruntjs.com/)
    - [Bower.io](http://bower.io/)
        
## Before you being

The theme CSS is generated from [LESS](http://lesscss.org/) files under `/assets/css/less/`. Any edits to the CSS files themselves will be overwritten
after the theme files are built using both the `dev` and `default` grunt tasks.

## Getting Started

### Installing NodeJS

You need [Node.js](http://nodejs.org/) to use the tools that build the CSS and the Styleguide. Download the proper Node.js package from their [download page](http://nodejs.org/download/).

After Node.js is installed, then you need to install [Grunt.js](http://gruntjs.com/getting-started) and [Bower](http://bower.io/#install-bower).
To do so, run the following commands:

```bash
npm install -g grunt-cli
npm install -g bower
```