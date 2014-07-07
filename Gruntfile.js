module.exports = function(grunt) {

  grunt.initConfig({
	  targetDir: "target",
	  targetLibDir: "<%= targetDir %>/lib",
	  targetCompiledJsDir: '<%= targetDir %>/js_compiled',
	  libConsolidatedDir: "lib/consolidated",
	  bower_concat: {
		  forCompile: {
			  dest: '/tmp/web/libs.compilable.js',
			  exclude: ['angular-dialog-service',
						'angular-i18n',
						'angular-route',
						'angular-sanitize',
					    'angular',
						'angular-translate',
						'angular-bootstrap',
						'bootstrap'],
			  mainFiles: {
				  'SlickGrid': ['slick.core.js',
								'slick.grid.js',
								'slick.dataview.js',
							    'slick.editors.js',
								'slick.formatters.js',
								'controls/slick.pager.js',
								'controls/slick.columnpicker.js',
							    'plugins/slick.rowmovemanager.js',
							    'plugins/slick.cellcopymanager.js',
							    'plugins/slick.cellselectionmodel.js',
							    'plugins/slick.rowselectionmodel.js',
								'lib/jquery.event.drag-2.2.js',
								'lib/jquery.event.drop-2.2.js'],
				  'jquery-jsonp': 'src/jquery.jsonp.js'
			  },
			  bowerOptions: {
				  relative: false
			  }
		  },
		  forUncompiled: {
			  dest: 'target/web/js/libs.uncompilable.js',
			  include: ['angular-dialog-service', 'angular-i18n', 'angular-route']
		  }
	  },

	  concat: {
		  options: {
			  separator: '//------------------------------//\n'
		  },
		  concatSlickGrid: {
			  options: {

			  },
			  src: [
			  'lib/SlickGrid/lib/jquery.event.drag-2.2.js',
			  'lib/SlickGrid/lib/jquery.event.drop-2.2.js',
			  'lib/SlickGrid/slick.core.js',
			  'lib/SlickGrid/slick.grid.js',
			  'lib/SlickGrid/slick.dataview.js',
			  'lib/SlickGrid/slick.editors.js',
			  'lib/SlickGrid/slick.formatters.js',
			  'lib/SlickGrid/controls/slick.pager.js',
			  'lib/SlickGrid/controls/slick.columnpicker.js',
			  'lib/SlickGrid/plugins/slick.rowmovemanager.js',
			  'lib/SlickGrid/plugins/slick.cellcopymanager.js',
			  'lib/SlickGrid/plugins/slick.cellrangedecorator.js',
			  'lib/SlickGrid/plugins/slick.cellrangeselector.js',
			  'lib/SlickGrid/plugins/slick.cellselectionmodel.js',
			  'lib/SlickGrid/plugins/slick.rowselectionmodel.js'
				   ],
			  dest: 'lib/SlickGrid/slickgrid.concat.js'
		  }
	  },

	  closureBuilder:  {
		  options: {
			  // [REQUIRED] To find the builder executable we need either the path to
			  //    closure library or directly the filepath to the builder:
			  closureLibraryPath: './lib/GoogleClosureLibrary', // path to closure library

			  // [REQUIRED] One of the two following options is required:
//			  inputs: 'string|Array', // input files (can just be the entry point)
			  namespaces: 'codeshelf.application', // namespaces

			  // [OPTIONAL] The location of the compiler.jar
			  // This is required if you set the option "compile" to true.
			  compilerFile: './lib/GoogleClosureLibrary/compiler.jar',

			  // [OPTIONAL] output_mode can be 'list', 'script' or 'compiled'.
			  //    If compile is set to true, 'compiled' mode is enforced.
			  //    Default is 'script'.
			  output_mode: 'script',

			  // [OPTIONAL] if we want builder to perform compile
			  compile: false, // boolean

			  compilerOpts: {
				  /**
				   * Go wild here...
				   * any key will be used as an option for the compiler
				   * value can be a string or an array
				   * If no value is required use null
				   */

			  },
			  // [OPTIONAL] Set exec method options
			  execOpts: {
				  /**
				   * Set maxBuffer if you got message "Error: maxBuffer exceeded."
				   * Node default: 200*1024
				   */
				  maxBuffer: 999999 * 1024
			  }

		  },

		  // any name that describes your operation
		  buildApp: {

			  // [REQUIRED] paths to be traversed to build the dependencies
			  src: ['./src/js_uncompiled',
					'./lib/GoogleClosureLibrary/closure',
					'./lib/GoogleClosureLibrary/third_party',
					'./lib/Raphael',
					'./lib/GoogleClosureTemplates/',
					'./lib/Bacon/',
					'./lib/TwitterBootstrap',
					'target/web/js'],

			  // [OPTIONAL] if not set, will output to stdout
			  dest: '/tmp/web/app.js'
		  }
	  },
/*
	  closureCompiler:  {

		  options: {
			  // [REQUIRED] Path to closure compiler
			  compilerFile: './lib/GoogleClosureLibrary/compiler.jar',

			  // [OPTIONAL] set to true if you want to check if files were modified
			  // before starting compilation (can save some time in large sourcebases)
			  checkModified: true,

			  // [OPTIONAL] Set Closure Compiler Directives here
			  compilerOpts: {
				  /*
				   * Keys will be used as directives for the compiler
				   * values can be strings or arrays.
				   * If no value is required use null
				   *
				   * The directive 'externs' is treated as a special case
				   * allowing a grunt file syntax (<config:...>, *)
				   *
				   * Following are some directive samples...
				   /
				  compilation_level: 'ADVANCED_OPTIMIZATIONS',
				  externs: ['src/js_externs/*.js'],
				  define: ["'goog.DEBUG=false'"],
				  warning_level: 'verbose',
				  jscomp_off: ['checkTypes', 'fileoverviewTags'],
				  summary_detail_level: 3,
				  property_map_output_file: '<%= targetCompiledJsDir %>/property.map',
				  variable_map_output_file: '<%= targetCompiledJsDir %>/variable.map',
				  manage_closure_dependencies: null,
				  closure_entry_point: 'codeshelf.application',
				  jscomp_warning: 'missingProperties',
				  angular_pass: null
//				  output_wrapper: '"(function(){%output%}).call(this);"'
			  },
			  // [OPTIONAL] Set exec method options
			  execOpts: {
				  /*
				   * Set maxBuffer if you got message "Error: maxBuffer exceeded."
				   * Node default: 200*1024
				   *
                   /
				  maxBuffer: 999999 * 1024
			  },
			  // [OPTIONAL] Java VM optimization options
			  // see https://code.google.com/p/closure-compiler/wiki/FAQ#What_are_the_recommended_Java_VM_command-line_options?
			  // Setting one of these to 'true' is strongly recommended,
			  // and can reduce compile times by 50-80% depending on compilation size
			  // and hardware.
			  // On server-class hardware, such as with Github's Travis hook,
			  // TieredCompilation should be used; on standard developer hardware,
			  // d32 may be better. Set as appropriate for your environment.
			  // Default for both is 'false'; do not set both to 'true'.
			  d32: true, // will use 'java -client -d32 -jar compiler.jar'
			  TieredCompilation: true // will use 'java -server -XX:+TieredCompilation -jar compiler.jar'
		  },

		  // any name that describes your task
		  compileApp: {

			  /*
			   *[OPTIONAL] Here you can add new or override previous option of the Closure Compiler Directives.
			   * IMPORTANT! The feature is enabled as a temporary solution to [#738](https://github.com/gruntjs/grunt/issues/738).
			   * As soon as issue will be fixed this feature will be removed.
			   /
			  TEMPcompilerOpts: {
			  },

			  // [OPTIONAL] Target files to compile. Can be a string, an array of strings
			  // or grunt file syntax (<config:...>, *)
			  src: 'target/web/js/app.js',

			  // [OPTIONAL] set an output file
			  dest: 'target/webpath/to/compiled_file.js'
		  }
	  }
*/
  });

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('buildLibs', ['concat:concatSlickGrid']);
};
