'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.registerTask('compass', ['stylus']);

    grunt.initConfig({
        yeoman: yeomanConfig,

        watch: {
            options: { nospawn: true },
            coffee: {
                files: ['<%= yeoman.app %>/{scripts,sketches}/{,*/}*.coffee'],
                tasks: ['coffee:dist'],
                options: { livereload: true }
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test'],
                options: { livereload: true }
            },
            stylus: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.styl'],
                tasks: ['stylus'],
                options: { livereload: true }
            },
            html: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/sketches/*.html',
                ],
                tasks: ['copy:html'],
                options: { livereload: true }
            },
            scripts: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['copy:scripts']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles']
            },
            livereload: {
                options: { livereload: LIVERELOAD_PORT },
                files: [
                    'test/*.html',
                    'test/spec/*.js',
                    '<%= yeoman.app %>/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: { port: 9000, hostname: '0.0.0.0' },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        coffeelint: {
            options: {
                'indentation': { 'level': 'ignore' }
            },
            app: ['app/{,*/}*.coffee'],
            test: ['test/{,*/}*.coffee']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        mocha: {
            all: {
                options: {
                    run: false,
                    reporter: 'Spec',
                    urls: ['http://localhost:<%= connect.test.options.port %>/test/index.html']
                }
            }
        },

        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                },{
                    expand: true,
                    cwd: '<%= yeoman.app %>/sketches',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/sketches',
                    ext: '.js'
                }],
                options: {
                    sourceMap: true
                }
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/test/spec',
                    ext: '.js'
                }],
                options: {
                    sourceMap: true
                }
            }
        },

        stylus: {
            compile: {
                options: {
                    compress: true,
                    paths: ['node_modules/grunt-contrib-stylus/node_modules']
                },
                files: {
                    '.tmp/styles/styls.css': ['app/styles/*.styl']
                },
                debugInfo: true
            }
        },

        requirejs: {
            std: {
                options: {
                    // TODO: Seems like a good idea, but seems not to work.
                    // https://github.com/asciidisco/grunt-requirejs/blob/master/docs/almondIntegration.md
                    // almond: true,
                    dir: 'dist',
                    appDir: '.tmp',
                    mainConfigFile: '.tmp/scripts/common.js',
                    optimizeCss: 'standard.keepLines',
                    modules: [
                        { name: 'common', include: [
                            'components', 'entities', 'systems', 'worlds', 'utils',
                            'Vector2D', 'jquery', 'underscore', 'pubsub', 'Hammer'
                        ] },
                        { name: 'app', exclude: ['common'] },
                        { name: 'sketches/beams', exclude: ['common'] },
                        { name: 'sketches/click-course', exclude: ['common'] },
                        { name: 'sketches/collisions', exclude: ['common'] },
                        { name: 'sketches/explosions', exclude: ['common'] },
                        { name: 'sketches/seeker', exclude: ['common'] },
                        { name: 'sketches/sprites', exclude: ['common'] }
                    ]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css'
                    ]
                }
            }
        },

        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            html: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '.tmp/',
                src: '{,*/}*.html'
            },
            scripts: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/scripts',
                dest: '.tmp/scripts/',
                src: '{,*/}*.js'
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        concurrent: {
            server: [
                'copy:html',
                'copy:scripts',
                'coffee',
                'copy:styles',
                'stylus:compile'
            ],
            test: [
                'copy:html',
                'copy:scripts',
                'coffee',
                'copy:styles',
                'stylus:compile'
            ],
            dist: [
                'copy:html',
                'copy:scripts',
                'coffee',
                'copy:styles',
                'stylus:compile',
                'imagemin',
                'svgmin'
            ]
        },

        bower: {
            options: {
                rjsConfig: 'app/scripts/config.js',
                exclude: ['modernizr']
            }
        },

        symlink: {
            js: {
                dest: '.tmp/bower_components',
                relativeSrc: '../app/bower_components',
                options: {type: 'dir'}
            }
        }

    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'copy:scripts',
            'symlink:js',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'copy:scripts',
        'symlink:js',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'copy:scripts',
        'symlink:js',
        'requirejs',
        'copy'
    ]);

    grunt.registerTask('default', [
        // 'coffeelint',
        'jshint',
        'test',
        'build'
    ]);
};
