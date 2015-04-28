var assert = require('assert'),
	boolClass = require('../factory/bool.js')(),
	dupClass = require('../factory/dup.js')(boolClass),
	bool = boolClass.create.bind(boolClass);

exports['bool'] = {
	before: function() {
		assert.throws(function () {
				new boolClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				bool(123);
			}, /Boolean expected/);
		assert.strictEqual(bool().value, null);
		assert.strictEqual(bool()._attr, undefined);
		assert.strictEqual(bool(true).value, true);
		assert.strictEqual(bool(true)._attr, undefined);
		assert.strictEqual(bool(false,1).value, false);
		assert.strictEqual(bool(false,1)._attr, 1);
		assert.strictEqual(bool(false,1).attr(), 1);
	},	

	'class level default function': function() {
		assert.strictEqual(boolClass.getDefault(), null);
	},	

	'instance level default function': function() {
		assert.strictEqual(bool().getDefault(), null);
	},	

	'instance level defVal property': function() {
		assert.strictEqual(bool().defVal, null);
	},	

	'get default value': function() {
		var obj = bool();
		assert.strictEqual(obj.value, null);
	},	

	'set inital value': function() {
		var value = true;
		assert.strictEqual(bool(value).value, value);
	},

	'set value': function() {
		var value = false;
		var obj = bool();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = bool();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, true);
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = true;
	},

	'parse': function() {
		var obj = bool();
		assert.strictEqual(obj.parse(true).value, true);
		assert.strictEqual(obj.parse(false).value, false);
		assert.strictEqual(obj.parse(1).value, true);
		assert.strictEqual(obj.parse(0).value, false);
		assert.strictEqual(obj.parse('true').value, true);
		assert.strictEqual(obj.parse('false').value, false);
		assert.strictEqual(obj.parse('.TRUE.').value, true);
		assert.strictEqual(obj.parse('.FALSE.').value, false);
		assert.strictEqual(obj.parse({}).value, null);
		assert.strictEqual(obj.parse([]).value, null);
		assert.strictEqual(obj.parse('dummy').value, null);
	},

	'toString': function() {
		var obj = bool();
		assert.strictEqual(obj.toString(), 'null');
		assert.strictEqual(obj.parse('false').value, false);
		assert.strictEqual(obj.toString(), 'false');
	},

	'class level compare': function() {
		assert.strictEqual(boolClass.compare(false,  true), -1);
		assert.strictEqual(boolClass.compare(true,  false), 1);
		assert.strictEqual(boolClass.compare(true,  true), 0);
		assert.strictEqual(boolClass.compare(false,  false), 0);
		assert.strictEqual(boolClass.compare(false,  null), 0);
	},

	'compareTo': function() {
		var obj = bool(false);
		assert.strictEqual(obj.compareTo(true), -1);
		assert.strictEqual(obj.compareTo(null), 0);
		assert.strictEqual(obj.compareTo(false), 0);
	},

	'dup': function() {
		var bool = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = bool('');
			}, /Boolean expected/);
		var obj = bool(true);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, true);
		assert.strictEqual(obj.class_.name, 'dup');
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.class_.super_.name, 'bool');
		assert.strictEqual(obj.class_.super_.super_.name, 'entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
