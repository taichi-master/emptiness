var assert = require('assert'),
	numClass = require('../factory/number.js')(),
	dupClass = require('../factory/dup.js')(numClass),
	num = numClass.create.bind(numClass);

exports['number'] = {
	before: function() {
		assert.throws(function () {
				new numClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = num('123');
			}, /Number expected/);
		assert.strictEqual(num().value, 0);
		assert.strictEqual(num()._attr, undefined);
		assert.strictEqual(num(999).value, 999);
		assert.strictEqual(num(999)._attr, undefined);
		assert.strictEqual(num(123,1).value, 123);
		assert.strictEqual(num(123,1)._attr, 1);
		assert.strictEqual(num(123,1).attr(), 1);
	},	

	'class level default function': function() {
		assert.strictEqual(numClass.getDefault(), 0);
	},	

	'instance level default function': function() {
		assert.strictEqual(num().getDefault(), 0);
	},	

	'instance level default property': function() {
		assert.strictEqual(num().defVal, 0);
	},	

	'get default value': function() {
		var obj = num();
		assert.strictEqual(obj.value, 0);
	},	

	'set inital value': function() {
		var value = 123;
		assert.strictEqual(num(value).value, value);
	},

	'set value': function() {
		var value = 456;
		var obj = num();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = num();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, 123);
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = 123;
	},

	'parse': function() {
		var obj = num();
		assert.strictEqual(obj.parse('123').value, 123);
	},

	'toString': function() {
		var obj = num();
		assert.strictEqual(obj.parse('123').value, 123);
		assert.strictEqual(obj.toString(), '123');
	},

	'class level compare': function() {
		assert.strictEqual(numClass.compare(123,  456), -333);
		assert.strictEqual(numClass.compare(456,  123), 333);
		assert.strictEqual(numClass.compare(123,  123), 0);
	},

	'compareTo': function() {
		var obj = num(123);
		assert.strictEqual(obj.compareTo(456), -333);
		assert.strictEqual(obj.compareTo(4), 119);
		assert.strictEqual(obj.compareTo(123), 0);
	},

	'dup': function() {
		var num = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = num('abc');
			}, /Number expected/);
		var obj = num(123);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.class_.name, 'dup');
		assert.strictEqual(newObj.class_.super_.name, 'number');
		assert.strictEqual(newObj.class_.super_.super_.name, 'entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
