module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['./src/*.js'],
                tasks: ['shell:rollup', 'copy']
            }
        },
        shell: {
            rollup: {
                command: 'node rollup.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['README-build.md'],
                        dest: 'build/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/weather-icons/font/**'],
                        dest: 'build/font/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['node_modules/font-awesome/fonts/**'],
                        dest: 'build/fonts/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'node_modules/bootstrap/dist/css/bootstrap.min.css',
                            'node_modules/weather-icons/css/weather-icons.min.css',
                            'node_modules/font-awesome/css/font-awesome.min.css'
                        ],
                        dest: 'build/css/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'node_modules/jquery/dist/jquery.min.js',
                            'node_modules/bootstrap/dist/js/bootstrap.min.js',
                            'node_modules/tether/dist/js/tether.min.js'
                        ],
                        dest: 'build/js/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('deploy', ['shell:rollup', 'copy']);
};