'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  var jsFileList = [
    '<%= bower.directory %>/bootstrap/js/transition.js',
    '<%= bower.directory %>/bootstrap/js/alert.js',
    '<%= bower.directory %>/bootstrap/js/button.js',
    '<%= bower.directory %>/bootstrap/js/carousel.js',
    '<%= bower.directory %>/bootstrap/js/collapse.js',
    '<%= bower.directory %>/bootstrap/js/dropdown.js',
    '<%= bower.directory %>/bootstrap/js/modal.js',
    '<%= bower.directory %>/bootstrap/js/tooltip.js',
    '<%= bower.directory %>/bootstrap/js/popover.js',
    '<%= bower.directory %>/bootstrap/js/scrollspy.js',
    '<%= bower.directory %>/bootstrap/js/tab.js',
    '<%= bower.directory %>/bootstrap/js/affix.js',
    '<%= bower.directory %>/angular/angular.js',
    '<%= bower.directory %>/angular-animate/angular-animate.js',
    '<%= bower.directory %>/ualib-ui/dist/ui-components-templates.js',
    '<%= bower.directory %>/ualib-ui/dist/ui-components.js',
    'assets/js/plugins/*.js',
    'assets/js/_*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: grunt.file.readJSON('.bowerrc'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'assets/js/*.js',
        '!assets/js/scripts.js',
        '!assets/**/*.min.*'
      ]
    },
    less: {
      dev: {
        files: {
          'assets/css/main.css': [
            'assets/less/main.less'
          ]
        },
        options: {
          compress: false,
          // LESS source map
          // To enable, set sourceMap to true and update sourceMapRootpath based on your install
          sourceMap: true,
          sourceMapFilename: 'assets/css/main.css.map',
          sourceMapRootpath: '/app/themes/roots/'
        }
      },
      build: {
        files: {
          'assets/css/main.min.css': [
            'assets/less/main.less'
          ]
        },
        options: {
          compress: true
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [jsFileList],
        dest: 'assets/js/scripts.js'
      }
    },
    copy: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= bower.directory %>/fontawesome/fonts',
                src: ['**'],
                dest: 'assets/fonts',
                filter: 'isFile'
            }]
        }
    },
    uglify: {
      dist: {
        files: {
          'assets/js/scripts.min.js': [jsFileList]
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: 'assets/css/'
          }
        },
        src: 'assets/css/main.css'
      },
      build: {
        src: 'assets/css/main.min.css'
      }
    },
    modernizr: {
      build: {
        devFile: '<%= bower.directory %>/modernizr/modernizr.js',
        outputFile: 'assets/js/vendor/modernizr.min.js',
        files: {
          'src': [
            ['assets/js/scripts.min.js'],
            ['assets/css/main.min.css']
          ]
        },
        extra: {
          shiv: false
        },
        uglify: true,
        parseFiles: true
      }
    },
    version: {
      default: {
        options: {
          format: true,
          length: 32,
          manifest: 'assets/manifest.json',
          querystring: {
            style: 'roots_css',
            script: 'roots_js'
          }
        },
        files: {
          'lib/scripts.php': 'assets/{css,js}/{main,scripts}.min.{css,js}'
        }
      }
    },
    watch: {
      less: {
        files: [
          'assets/less/*.less',
          'assets/less/**/*.less'
        ],
        tasks: ['less:dev', 'autoprefixer:dev']
      },
      js: {
        files: [
          jsFileList,
          '<%= jshint.all %>'
        ],
        tasks: ['jshint', 'concat']
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: false
        },
        files: [
          'assets/css/main.css',
          'assets/js/scripts.js',
          'templates/*.php',
          '*.php'
        ]
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'less:dev',
    'autoprefixer:dev',
    'concat'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'copy',
    'less:build',
    'autoprefixer:build',
    'uglify',
    'modernizr',
    'version'
  ]);
};
