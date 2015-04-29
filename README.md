# roots-ualib
The Word Press Roots.io theme for the University of Alabama Libraries

## Dependencies
- [NodeJS](http://nodejs.org/)
    - [GruntJS](http://gruntjs.com/)
    - [Bower.io](http://bower.io/)
        
## Before you being

Please note, these docs are written for developers newer to these types of tools. If the above dependency list looks familiar to you,
you can just skim through the instructions below.

It is highly recommended that you work on a locally installed Word Press installation, and only push changes to this repo
after your commits are ready for staging/optimization.

Be aware, many of these tools do not have native GUIs and may require use of the command prompt. If you are unfamiliar with your operating system's
command prompt or terminal check out these resources before proceeding:

- OS X: [http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line]
- Windows: [http://windows.microsoft.com/en-us/windows-vista/open-a-command-prompt-window]
- Linux: You already know what to do...

### 1. Setup your environment

#### Install Node and required node modules

> Node's package manager is called via the `npm` command. You'll use this command to install tools like Grunt and Bower

1. Go to the [NodeJS](http://nodejs.org/) website and download their installer (Windows, OS X, or Linux)
2. Open a command prompt or terminal window
3. Type `npm install -g grunt-cli` to install Grunt's command line interface.
4. Type `npm install -g bower` to install Bower

Be sure to read Grunt's and Bower's docs to get better acquainted with these tools:
- [Grunt - getting stared](http://gruntjs.com/getting-started)
- [Bower](http://bower.io/)

#### Install a local dev stack

> "Local development stacks" are web servers that run from your computer. That way, you can try all types of crazy things safely. 

Our stacks will include Apache, PHP, and MySQL



### Get familiar with LESS
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