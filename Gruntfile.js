module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify", {
                     loose: "all"
                  }]
               ]
            },
            files: {
               // if the source file has an extension of es6 then
               // we change the name of the source file accordingly.
               // The result file's extension is always .js
               "./dist/d3.SimpleGraphs.js": ["./assets/js/d3.SimpleGraphs.js"]
            }
         }
      },
      less: {
         dist: {
            files: {
              "./dist/d3.SimpleGraphs.css": ["./assets/less/d3.SimpleGraphs.less"]
            }
         }
      },
      watch: {
         scripts: {
            files: ["./assets/**/*"],
            tasks: ["browserify"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");
   grunt.loadNpmTasks("grunt-contrib-less");

   grunt.registerTask("build", ["less", "browserify"]);
   grunt.registerTask("default", ["build", "watch"]);
};