UA Libraries Style Guide
========================

This styleguide is intended for web developers (e.g., not 'content creators/editors'). It gives basic information about the primary classes/features available.
For now, this styleguide is being generating using [kss-node](https://github.com/kss-node/kss-node). Unforunately, kss-node doesn't offer
all the features we will need, so it will likely be abandoned for another method when we need to development the styleguide for content creators.

## First Steps

The UA Libraries website CSS is modified from [Bootstrap 3.2.0](http://getbootstrap.com/). The current build of the CSS supports all Bootstrap features,
but the features will likely be narrowed down to only what is essential. The list below links to Bootstrap topics/features that the UA Libraries CSS will
likely be features of the finalized UA Libraries Styles.

Although all of Bootstrap's capabilities are currently available (subject to change),
it is strongly recommended you read through the the linked _recommended Bootstrap capabilities_ linked below:
* CSS
    * [Containers](http://getbootstrap.com/css/#overview-container)
    * [Grid system](http://getbootstrap.com/css/#grid)
        * Read through every sub-topic except "Less mixins and variables"
    * Tables
        * [Responsive Tables](http://getbootstrap.com/css/#tables-responsive)
    * [Forms](http://getbootstrap.com/css/#forms)
    * Images
        * [Responsive images](http://getbootstrap.com/css/#images-responsive)
    * Helper classes
        * [Carets](http://getbootstrap.com/css/#helper-classes-carets)
        * [Quick floats](http://getbootstrap.com/css/#helper-classes-floats)
        * [Screen reader content](http://getbootstrap.com/css/#helper-classes-screen-readers)
* Components
    * [Dropdowns](http://getbootstrap.com/components/#dropdowns)
    * [Button groups](http://getbootstrap.com/components/#btn-groups)
    * [Button dropdowns](http://getbootstrap.com/components/#btn-dropdowns)
    * [Input groups](http://getbootstrap.com/components/#input-groups)
    * [Navs](http://getbootstrap.com/components/#nav)
    * [Navbar](http://getbootstrap.com/components/#navbar)
    * [Labels](http://getbootstrap.com/components/#labels)
    * [Thumbnails](http://getbootstrap.com/components/#thumbnails)
    * Alerts
        * [Dissmissable alerts](http://getbootstrap.com/components/#alerts-dismissible)
        * [Links in alerts](http://getbootstrap.com/components/#alerts-links)
    * [Media object](http://getbootstrap.com/components/#media)
       
## Using the CSS
For development use the [RawGit](https://rawgit.com/) service for the header include. You can change the link to your own fork as well.

**Note:** Only use this link for low-traffic dev or demo sites.
```
<link rel="stylesheet" href="https://rawgit.com/ualibweb/ualib-styles/gh-pages/dist/ualib-styles.min.css">
```


### Issues and feature requests
Use github's [issues system](https://github.com/ualibweb/ualib-styles/issues) to report problems or make feature requests. To do this, you must first create a github account. Afterwards, let me know you account name and I'll add you as a contributor.

---

## Forking, installing, and building the UA Libraries styles and styleguide

### Requirements
You must have the following software install on your computer to build the CSS and Styleguide. Grunt and Bower both require Node.js, so install Node first.
1. [Node.js](http://nodejs.org/)
    * Go to their [downloads page](http://nodejs.org/download/) and install the appropriate package
2. [Grunt.js](http://gruntjs.com/)
    * [See here](http://gruntjs.com/getting-started#installing-the-cli) for installation instructions
3. [Bower](http://bower.io/)
    * [See here](http://bower.io/#install-bower) for installation

---

### Forking repo and Installing dependencies

1. Create you own fork of the [ualibweb/ualib-styles](https://github.com/ualibweb/ualib-styles) repo. [See here](https://help.github.com/articles/fork-a-repo/) for instructions on forking a github repo.
    * The default branch for this repo is `gh-pages`. Any [pull requests](https://help.github.com/articles/using-pull-requests/) will be merged with this branch.
2. Run `npm install -g kss` in the command line to install `kss-node` globally.
3. Run `npm install` to install dependencies for `grunt` (ensure you're in the same folder as the `package.json` file).
3. Run `bower install` in the command line (ensure you're in the same folder as the `bower.json` file).

---

### Build everything (CSS and Styleguide)

1. Run `grunt` or `grunt default`

### Build CSS only

1. Run `grunt css`

---

#### The final CSS file(s) are build to
```
dist/css/
```


#### The Styleguide is build to
```
styleguide/
```