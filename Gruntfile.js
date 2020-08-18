"use strict";
module.exports = function (grunt) {
  // Load all tasks
  require("load-grunt-tasks")(grunt);
  // Show elapsed time
  require("time-grunt")(grunt);

  var jsFileList = [
    "assets/js/ualib-templates.js",
    "assets/js/plugins/*.js",
    "assets/js/_*.js",
    "!assets/js/_main.js",
    "!assets/js/scripts.js",
    "!assets/js/_scripts-local.js",
    "!assets/**/*.min.js",
  ];

  var lessFileList = ["tmp/assets/less/main.less"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bower: grunt.file.readJSON(".bowerrc"),
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporterOutput: "",
      },
      all: [
        "Gruntfile.js",
        "assets/js/*.js",
        "!assets/js/*_bower.js",
        "!assets/js/scripts.js",
        "!assets/**/*.min.*",
        "!assets/js/header-footer-export.js",
        "!assets/js/_scripts-local.js",
      ],
    },
    clean: {
      tmp: ["tmp"],
    },
    less: {
      dev: {
        files: {
          "assets/css/main.css": [lessFileList],
        },
        options: {
          paths: ["assets/less"],
          compress: false,
          // LESS source map
          // To enable, set sourceMap to true and update sourceMapRootpath based on your install
          sourceMap: true,
          sourceMapFilename: "assets/css/main.css.map",
          sourceMapRootpath: "/wp-content/themes/roots/",
        },
      },
      live: {
        files: {
          "assets/css/main.min.css": [lessFileList],
        },
        options: {
          paths: ["assets/less"],
          compress: true,
        },
      },
      header_footer_export: {
        options: {
          compress: true,
        },
        files: {
          "assets/css/header-footer-export.min.css": [
            "assets/less/layouts/_header-footer-export.less",
          ],
        },
      },
    },
    html2js: {
      dev: {
        options: {
          base: "tmp/assets/js",
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
          },
        },
        src: "tmp/assets/js/**/*.tpl.html",
        dest: "tmp/assets/js/ualib-templates.js",
        module: "ualib.templates",
      },
      header_footer_export: {
        src: ["vendor/onesearch/src/app/common/directives/suggest.tpl.html"],
        dest: "tmp/assets/js/header-footer-export-templates.js",
      },
    },
    concat: {
      options: {
        separator: ";",
      },
      live: {
        src: [
          "tmp/assets/js/ualib-templates.js",
          "tmp/assets/js/plugins/*.js",
          "tmp/assets/js/_*.js",
          "!tmp/assets/js/_main.js",
          "!tmp/assets/js/_scripts-local.js",
          "!tmp/assets/**/*.min.js",
        ],
        dest: "tmp/assets/js/scripts.js",
      },
      dev: {
        src: [
          "tmp/assets/js/ualib-templates.js",
          "tmp/assets/js/plugins/*.js",
          "tmp/assets/js/_*.js",
          "!tmp/assets/js/_main.js",
          "!tmp/assets/js/_scripts-local.js",
          "!tmp/assets/**/*.min.js",
        ],
        dest: "assets/js/scripts.js",
      },
      local: {
        src: [
          "tmp/assets/js/ualib-templates.js",
          "tmp/assets/js/plugins/*.js",
          "tmp/assets/js/_*.js",
          "!tmp/assets/js/_main.js",
          "!tmp/assets/js/_scripts-local.js",
          "!tmp/assets/**/*.min.js",
        ],
        dest: "assets/js/_scripts-local.js",
      },
      header_footer_export: {
        options: {
          banner:
            "angular.module('ualib', ['ngAnimate', 'ui.bootstrap','ualib.ui', 'oneSearch']);angular.module('ui.bootstrap', ['ui.bootstrap.collapse']);angular.module('ualib.ui', []);\n",
        },
        src: [
          "tmp/assets/js/header-footer-export-templates.js",
          "tmp/assets/js/header-footer-export.js",
        ],
        dest: "tmp/assets/js/header-footer-export.js",
      },
    },
    bower_concat: {
      dev: {
        dest: {
          js: "assets/js/scripts_bower.js",
          css: "assets/css/main_bower.css",
        },
        exclude: [
          "angular",
          "angular-animate",
          "angular-route",
          "angular-sanitize",
          "angular-resource",
          "angular-ui-bootstrap-bower",
          "angular-bootstrap",
          "bootstrap",
          "yamm3",
          "tinymce-dist",
          "jquery",
          "modernizr",
          "roots-ualib",
          "compfinder",
          "angular-lazy-img",
          "hamsterjs",
          "angular-google-maps",
          "lodash",
          "angular-mousewheel",
        ],
        callback: function (mainFiles, component) {
          return mainFiles.map(function (filepath) {
            // Use minified files if available
            var min = filepath.replace(/\.min(?=\.)/, "");
            return grunt.file.exists(min) ? min : filepath;
          });
        },
      },
      build: {
        dest: {
          js: "assets/js/scripts_bower.min.js",
          css: "assets/css/main_bower.min.css",
        },
        exclude: [
          "angular",
          "angular-animate",
          "angular-route",
          "angular-sanitize",
          "angular-resource",
          "angular-ui-bootstrap-bower",
          "angular-bootstrap",
          "bootstrap",
          "yamm3",
          "tinymce-dist",
          "jquery",
          "modernizr",
          "roots-ualib",
          "compfinder",
          "angular-lazy-img",
          "hamsterjs",
          "angular-google-maps",
          "lodash",
          "angular-mousewheel",
        ],
        callback: function (mainFiles, component) {
          return mainFiles.map(function (filepath) {
            // Use minified files if available
            var min = filepath.replace(/\.(js|css)$/, ".min$&");
            return grunt.file.exists(min) ? min : filepath;
          });
        },
      },
      header_footer_export: {
        dest: "tmp/assets/js/header-footer-export.js",
        include: [
          "angular-bootstrap",
          "ualib-ui",
          "onesearch",
          "angular-filter",
          "angular-scroll",
        ],
        mainFiles: {
          "ualib-ui": [
            "src/dropdown/dropdown.js",
            "src/dropdown/dropdown-sticky.js",
          ],
          "angular-bootstrap": [
            "src/transition/transition.js",
            "src/collapse/collapse.js",
          ],
        },
      },
    },
    copy: {
      fontawesome: {
        files: [
          {
            expand: true,
            cwd: "<%= bower.directory %>/fontawesome/fonts",
            src: ["**"],
            dest: "assets/fonts",
            filter: "isFile",
          },
        ],
      },
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files: [
          {
            "tmp/assets/js/scripts.js": ["tmp/assets/js/scripts.js"],
          },
        ],
      },
      header_footer_export: {
        files: [
          {
            "tmp/assets/js/header-footer-export.min.js": [
              "tmp/assets/js/header-footer-export.min.js",
            ],
          },
        ],
      },
    },
    uglify: {
      dist: {
        options: {
          mangle: false,
        },
        files: {
          "assets/js/scripts.min.js": ["tmp/assets/js/scripts.js"],
          "assets/js/scripts_bower.min.js": ["assets/js/scripts_bower.min.js"],
        },
      },
      header_footer_export: {
        options: {
          mangle: true,
        },
        files: [
          {
            "assets/js/header-footer-export.min.js": [
              "tmp/assets/js/header-footer-export.js",
            ],
          },
        ],
      },
    },
    autoprefixer: {
      options: {
        browsers: [
          "last 2 versions",
          "ie 8",
          "ie 9",
          "android 2.3",
          "android 4",
          "opera 12",
        ],
      },
      dev: {
        options: {
          map: {
            prev: "assets/css/",
          },
        },
        src: "assets/css/main.css",
      },
      build: {
        src: "assets/css/main.min.css",
      },
    },
    modernizr: {
      build: {
        devFile: "<%= bower.directory %>/modernizr/modernizr.js",
        outputFile: "assets/js/vendor/modernizr.min.js",
        files: {
          src: [["assets/js/scripts.min.js"], ["assets/css/main.min.css"]],
        },
        extra: {
          shiv: false,
        },
        uglify: true,
        parseFiles: true,
      },
    },
    version: {
      default: {
        options: {
          format: true,
          length: 32,
          manifest: "assets/manifest.json",
          querystring: {
            style: "roots_css",
            script: "roots_js",
          },
        },
        files: {
          "lib/scripts.php":
            "assets/{css,css,js,js}/{main,main_bower,scripts,scripts_bower}.min.{css,js}",
        },
      },
    },
    replace: {
      devToLiveJS: {
        src: ["assets/js/scripts.min.js", "assets/js/scripts_bower.min.js"],
        dest: "assets/js/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
      devToLiveCSS: {
        src: ["assets/css/main.min.css", "assets/css/main_bower.min.css"],
        dest: "assets/css/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
      devToLiveTemplates: {
        src: ["templates/header.php", "templates/footer.php"],
        dest: "templates/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
      devToLiveCovidCounter: {
        src: "assets/js/covidCounter/dev/covidCounter.js",
        dest: "assets/js/covidCounter/prod/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
      devToLiveIntranetForms: {
        src: [
          "intranet/inc/actcardform-result.php",
          "intranet/inc/circ-trace-form-result.php",
          "intranet/inc/studentemployeerequest-result.php",
          "intranet/inc/voyager-request-result.php",
          "intranet/inc/tech-request-form-result.php",
          "intranet/inc/sec-auth-form.php",
          "intranet/inc/delete-form.php",
          "intranet/inc/voyager-only-form.php",
        ],
        dest: "intranet/inc/dest/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
      headerFooterExportJS: {
        src: ["assets/js/header-footer-export.min.js"],
        dest: "assets/js/",
        replacements: [
          {
            from: /(wwwdev2?)/g,
            to: "www",
          },
        ],
      },
    },
    bump: {
      options: {
        files: ["package.json", "bower.json"],
        updateConfigs: ["pkg"],
        commit: false,
        commitMessage: "Release v%VERSION%",
        commitFiles: ["package.json", "bower.json"],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: false,
        pushTo: "origin",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
        globalReplace: false,
        prereleaseName: false,
        regExp: false,
      },
    },
    preprocess: {
      local: {
        options: {
          context: {
            NODE_ENV: "local",
          },
        },
        src: [jsFileList, "assets/js/**/*.tpl.html"],
        dest: "tmp",
        expand: true,
      },
      dev: {
        options: {
          context: {
            NODE_ENV: "dev",
          },
        },
        src: [jsFileList, "assets/js/**/*.tpl.html", "assets/less/**/*.*"],
        dest: "tmp",
        expand: true,
      },
      live: {
        options: {
          context: {
            NODE_ENV: "live",
          },
        },
        src: [jsFileList, "assets/js/**/*.tpl.html", "assets/less/**/*.*"],
        dest: "tmp",
        expand: true,
      },
    },
    watch: {
      less: {
        files: ["assets/less/*.less", "assets/less/**/*.less"],
        tasks: ["preprocess:dev", "less:dev", "autoprefixer:dev", "clean:tmp"],
      },
      js: {
        files: [
          "assets/js/**/_*.js",
          "assets/js/**/*.tpl.html",
          "!assets/js/scripts.js",
          "!assets/js/**/*.min.js",
          "!assets/js/_scripts-local.js",
        ],
        tasks: [
          "preprocess:local",
          "html2js:dev",
          "concat:local",
          "preprocess:dev",
          "html2js:dev",
          "concat:dev",
          "clean:tmp",
        ],
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: 35729,
        },
        files: [
          "assets/css/main.css",
          "assets/js/scripts.js",
          "templates/*.php",
          "lib/*.php",
          "*.php",
        ],
      },
    },
    exec: {
      bower_prune: "bower prune",
      bower_update: "bower update",
    },
  });

  // Register tasks
  grunt.registerTask("default", ["dev", "watch"]);

  grunt.registerTask("dev", [
    "exec:bower_update",
    "exec:bower_prune",
    "preprocess:local",
    "html2js:dev",
    "concat:local",
    "preprocess:dev",
    "less:dev",
    "autoprefixer:dev",
    "html2js:dev",
    "concat:dev",
    "bower_concat:dev",
    "clean:tmp",
  ]);
  grunt.registerTask("live-build", [
    "jshint",
    "preprocess:live",
    "html2js",
    "concat:live",
    "ngAnnotate",
    "less:live",
    "autoprefixer:build",
    "headerFooterExport",
    "bower_concat:build",
    "uglify:dist",
    "replace",
    "version",
    "modernizr",
    "clean:tmp",
  ]);

  grunt.registerTask("headerFooterExport", [
    "less:header_footer_export",
    "bower_concat:header_footer_export",
    "concat:header_footer_export",
    "uglify:header_footer_export",
  ]);
};
