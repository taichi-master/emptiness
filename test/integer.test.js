var assert = require('assert'),
	entityClass = require('../factory/entity.js')(),
	numClass = require('../factory/number.js')(entityClass),
	intFactory = require('../factory/integer.js'),
	intClass = intFactory(numClass),
	dupClass = require('../factory/dup.js')(intClass);
	int = intClass.create.bind(intClass);

exports['integer'] = {
	before: function() {
		assert.throws(function () {
				new intClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = int(123.5);
			}, /Integer expected/);
		var obj = int();
		assert.strictEqual(obj.getClass().super_, numClass);
		assert.strictEqual(obj.getClass().super_.super_, numClass.super_);
		assert.strictEqual(obj.getClass().super_.super_, entityClass);
		assert.strictEqual(obj.getClass().getDefault, numClass.getDefault);
		assert.strictEqual(obj.getClass().name, 'Int');
		assert.strictEqual(obj.getClass().root.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.name, 'Num');
		assert.strictEqual(obj.getClass().super_.root.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.root.name, 'Entity');
		assert.strictEqual(obj.getClass().root, obj.getClass().super_.super_);
		assert.strictEqual(obj.getClass().root.super_, obj.getClass().super_.super_.super_);
		assert.strictEqual(obj.getClass().root.super_, null);

		assert.strictEqual(int().value, 0);
		assert.strictEqual(int()._attr, undefined);
		assert.strictEqual(int(999).value, 999);
		assert.strictEqual(int(999)._attr, undefined);
		assert.strictEqual(int(123,1).value, 123);
		assert.strictEqual(int(123,1)._attr, 1);
		assert.strictEqual(int(123,1).attr(), 1);
	},	

	'class level default function': function() {
		assert.strictEqual(intClass.getDefault(), 0);
	},	

	'instance level default function': function() {
		assert.strictEqual(int().getDefault(), 0);
	},	

	'instance level defVal property': function() {
		assert.strictEqual(int().defVal, 0);
	},	

	"dynamic modify parent's behaviour": function() {
		var obj = int();
		assert.strictEqual(obj.defVal, 0);
		assert.strictEqual(int().defVal, 0);
		
		function getDefault (attr) {
			return 999;
		}
		var foo = numClass.getDefault;
		numClass.getDefault = getDefault;
		assert.strictEqual(numClass.create().defVal, 999);
		assert.strictEqual(obj.defVal, 999);			// this doesn't work
		assert.strictEqual(int().defVal, 999);
		numClass.getDefault = foo;
	},	

	'get defVal value': function() {
		var obj = int();
		assert.strictEqual(obj.value, 0);
	},	

	'set inital value': function() {
		var value = 123;
		assert.strictEqual(int(value).value, value);
	},

	'set value': function() {
		var value = 456;
		var obj = int();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = int();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, 123);
			assert.strictEqual(oldValue, 0);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = 123;
	},

	'parse': function() {
		var obj = int();
		assert.strictEqual(obj.parse('123').value, 123);
	},

	'toString': function() {
		var obj = int();
		assert.strictEqual(obj.parse('123').value, 123);
		assert.strictEqual(obj.toString(), '123');
	},

	'class level compare': function() {
		assert.strictEqual(intClass.compare(123,  456), -333);
		assert.strictEqual(intClass.compare(456,  123), 333);
		assert.strictEqual(intClass.compare(123,  123), 0);
	},

	'compareTo': function() {
		var obj = int(123);
		assert.strictEqual(obj.compareTo(456), -333);
		assert.strictEqual(obj.compareTo(4), 119);
		assert.strictEqual(obj.compareTo(123), 0);
	},

	'dup': function() {
		var int = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = int(123.5);
			}, /Integer expected/);
		var obj = int(123);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 123);
		assert.strictEqual(newObj.getClass().name, 'Dup');
		assert.strictEqual(newObj.getClass().super_.name, 'Int');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Num');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
