var assert = require('assert'),
	floatClass = require('../factory/float.js')(),
	dupClass = require('../factory/dup.js')(floatClass),
	float = floatClass.create.bind(floatClass);

exports['float'] = {
	before: function() {
		assert.throws(function () {
				new floatClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				float('123');
			}, /Number expected/);
		assert.strictEqual(float().value, 0);
		assert.strictEqual(float()._attr, undefined);
		assert.strictEqual(float(999).value, 999);
		assert.strictEqual(float(999)._attr, undefined);
		assert.strictEqual(float(123,1).value, 123);
		assert.strictEqual(float(123,1)._attr, 1);
		assert.strictEqual(float(123,1).attr(), 1);
	},	

	'class level default function': function() {
		assert.strictEqual(floatClass.getDefault(), 0);
	},	

	'instance level default function': function() {
		assert.strictEqual(float().getDefault(), 0);
	},	

	'instance level defVal property': function() {
		assert.strictEqual(float().defVal, 0);
	},	

	'get default value': function() {
		var obj = float();
		assert.strictEqual(obj.value, 0);
	},	

	'set inital value': function() {
		var value = 123.456;
		assert.strictEqual(float(value).value, value);
	},

	'set value': function() {
		var value = 456.123;
		var obj = float();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate integer': function(done) {
		var value = 123;
		var obj = float();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, value);
			assert.strictEqual(oldValue, 0);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = value;
	},

	'validate float': function(done) {
		var value = 123.5;
		var obj = float();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, value);
			assert.strictEqual(oldValue, 0);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = value;
		obj.removeAllListeners('change');
	},

	'invalid Num': function() {
		var obj = float();
		try {
			obj.value = '123.5';
		} catch (err) {
			assert.strictEqual(err.message, 'Number expected');
		}
	},

	'parse': function() {
		var obj = float();
		assert.strictEqual(obj.parse('123.5').value, 123.5);
	},

	'toString': function() {
		var obj = float();
		assert.strictEqual(obj.parse('123.5').value, 123.5);
		assert.strictEqual(obj.toString(), '123.5');
	},

	'class level compare': function() {
		assert.strictEqual(floatClass.compare(123,  456), -333);
		assert.strictEqual(floatClass.compare(456,  123), 333);
		assert.strictEqual(floatClass.compare(123,  123), 0);
	},

	'compareTo': function() {
		var obj = float(123);
		assert.strictEqual(obj.compareTo(456), -333);
		assert.strictEqual(obj.compareTo(4), 119);
		assert.strictEqual(obj.compareTo(123), 0);
	},

	'dup': function() {
		var float = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = float('');
			}, /Number expected/);
		var obj = float(123.5);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 123.5);
		assert.strictEqual(obj.getClass().name, 'Dup');
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().super_.name, 'Float');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Num');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
