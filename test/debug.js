var util = require('../lib/util.js'),
	reload = util.reload,
	test;

// test = require('./entity.test.js');
// test.entity.clone();

// test = require('./enumerator.test.js');
// test.enumerator.instantiate();
// test.enumerator.clone();

// test = require('./email.test.js');
// test.email.clone();

// test = require('./record.test.js');
// test.record.instantiate();
// test.record.clone();

// test = require('./struct.test.js');
// test.struct.before();
// test.struct.instantiate();

// test = require('./typedef.test.js');
// test.typedef['.has()']();

// test = require('./spawn.test.js');
// test.spawn.enumerator();
// test.spawn.struct();
// test.spawn.required();

test = require('./structlist.test.js');
test.structlist.instantiate();
