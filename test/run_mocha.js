'use strict';

module.exports = function run_mocha (filename) {
	var mocha = require('child_process').spawn('mocha', [ 
			'--colors',
			'--ui', 'exports',
			'--reporter', 'spec',
			 filename 
		]
	 );
	mocha.stdout.pipe(process.stdout);
	mocha.stderr.pipe(process.stderr);
}
