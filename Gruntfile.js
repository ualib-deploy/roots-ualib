'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    var jsFileList = [
        'assets/js/ualib-templates.js',
        'assets/js/plugins/*.js',
        'assets/js/_*.js'
    ];

    var lessFileList = [
        'assets/less/main.less'
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
                '!assets/js/*_bower.js',
                '!assets/js/scripts.js',
                '!assets/**/*.min.*'
            ]
        },
        less: {
            dev: {
                files: {
                    'assets/css/main.css': [lessFileList, '!*.min.css']
                },
                options: {
                    compress: false,
                    // LESS source map
                    // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                    sourceMap: true,
                    sourceMapFilename: 'assets/css/main.css.map',
                    sourceMapRootpath: '/wp-content/themes/roots/'
                }
            },
            build: {
                files: {
                    'assets/css/main.min.css': [lessFileList]
                },
                options: {
                    compress: true
                }
            }
        },
        html2js:{
            dev: {
                src: 'assets/js/**/*.tpl.html',
                dest: 'assets/js/ualib-templates.js',
                module: 'ualib.templates'
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
        bower_concat: {
            dev: {
                dest: 'assets/js/scripts_bower.js',
                cssDest: 'assets/css/main_bower.css',
                exclude: [
                    'angular',
                    'angular-animate',
                    'angular-route',
                    'angular-sanitize',
                    'angular-resource',
                    'angular-bootstrap',
                    'bootstrap',
                    'yamm3',
                    'tinymce-dist'
                ],
                callback: function(mainFiles, component) {
                    return mainFiles.map(function(filepath) {
                        // Use minified files if available
                        var min = filepath.replace(/\.min(?=\.)/, '');
                        return grunt.file.exists(min) ? min : filepath;
                    });
                }
            },
            build: {
                dest: 'assets/js/scripts_bower.min.js',
                cssDest: 'assets/css/main_bower.min.css',
                exclude: [
                    'angular',
                    'angular-animate',
                    'angular-route',
                    'angular-sanitize',
                    'angular-resource',
                    'angular-bootstrap',
                    'bootstrap',
                    'yamm3',
                    'tinymce-dist'
                ],
                callback: function(mainFiles, component) {
                    return mainFiles.map(function(filepath) {
                        // Use minified files if available
                        var min = filepath.replace(/\.(js|css)$/, '.min$&');
                        return grunt.file.exists(min) ? min : filepath;
                    });
                }
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
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        'assets/js/scripts.js': ['assets/js/scripts.js']
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'assets/js/scripts.min.js': ['assets/js/scripts.js']
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
                    'lib/scripts.php': 'assets/{css,css,js,js}/{main,main_bower,scripts,scripts_bower}.min.{css,js}'
                }
            }
        },
        replace: {
            devToLiveJS: {
                src: ['assets/js/scripts.min.js', 'assets/js/scripts_bower.min.js'],
                dest: 'assets/js/',
                replacements: [{
                    from: /(wwwdev2?)/g,
                    to: 'www'
                }]
            },
            devToLiveCSS: {
                src: ['assets/css/main.min.css', 'assets/js/main_bower.min.css'],
                dest: 'assets/css/',
                replacements: [{
                    from: /(wwwdev2?)/g,
                    to: 'www'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
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
        },
        lessToSass: {
            lessVars: {
                files: [{
                    expand: true,
                    cwd: 'assets/less',
                    src: ['_variables.less'],
                    ext: '.scss',
                    dest: 'assets/sass'
                }]
            }
        },
        htmlSnapshot: {
            all: {
                options: {
                    //that's the path where the snapshots should be placed
                    //it's empty by default which means they will go into the directory
                    //where your Gruntfile.js is placed
                    removeScripts: true,
                    snapshotPath: 'assets/snapshots/',
                    //This should be either the base path to your index.html file
                    //or your base URL. Currently the task does not use it's own
                    //webserver. So if your site needs a webserver to be fully
                    //functional configure it here.
                    sitePath: 'https://www.lib.ua.edu/',
                    //by default the task waits 500ms before fetching the html.
                    //this is to give the page enough time to to assemble itself.
                    //if your page needs more time, tweak here.
                    msWaitForPages: 1000,
                    //sanitize function to be used for filenames. Converts '#!/' to '_' as default
                    //has a filename argument, must have a return that is a sanitized string
                    sanitize: function (requestUri) {
                        //returns 'index.html' if the url is '/', otherwise a prefix
                        return requestUri.replace(/[\?=&]/g, '_');
                    },
                    //here goes the list of all urls that should be fetched
                    urls: [
                        '',
                        '#/hours',
                        '#/hours?library=gorgas',
                        '#/hours?library=music',
                        '#/hours?library=media',
                        '#/hours?library=williams',
                        '#/hours?library=rodgers',
                        '#/hours?library=mclure',
                        '#/hours?library=hoole',
                        '#/hours?library=bruno',
                        '#/databases',
                        '#/news-exhibits',
                        '#/staffdir',
                        '#/videos',
                        '#/hours?library=gorgas',
                        '#/hours?library=music',
                        '#/hours?library=media',
                        '#/hours?library=williams',
                        '#/hours?library=rodgers',
                        '#/hours?library=mclure',
                        '#/hours?library=hoole',
                        '#/hours?library=bruno'
                    ],
                    // options for phantomJs' page object
                    // see http://phantomjs.org/api/webpage/ for available options
                    pageOptions: {
                        viewportSize : {
                            width: 1200,
                            height: 800
                        }
                    }
                }
            }
        }
    });

    // Register tasks
    grunt.registerTask('default', [
        'dev'
    ]);
    grunt.registerTask('dev', [
        'html2js:dev',
        'jshint',
        'less:dev',
        'autoprefixer:dev',
        'concat',
        'bower_concat:dev'
    ]);
    grunt.registerTask('live-build', [
        'html2js',
        'jshint',
        'copy',
        'less:build',
        'autoprefixer:build',
        'concat',
        'ngAnnotate',
        'uglify',
        'modernizr',
        'version',
        'bower_concat:build',
        'replace'
    ]);
    grunt.registerTask('lessVarsToSass', ['lessToSass:lessVars']);
};