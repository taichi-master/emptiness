var assert = require('assert'),
	floatClass = require('../factory/currency.js')(),
	dupClass = require('../factory/dup.js')(floatClass),
	currency = floatClass.create.bind(floatClass);

exports['currency'] = {
	before: function() {
		assert.throws(function () {
				new floatClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				currency('123');
			}, /Number expected/);
		assert.strictEqual(currency().value, 0);
		assert.strictEqual(currency()._attr.rounding, 2);
		assert.strictEqual(currency()._attr.symbol, '');
		assert.strictEqual(currency()._attr.thousand, ',');
		assert.strictEqual(currency()._attr.decimal, '.');
		assert.strictEqual(currency(999).value, 999);
		assert.strictEqual(currency(123,1).value, 123);
		assert.strictEqual(currency(123,1)._attr.rounding, 1);
		assert.strictEqual(currency(123,1)._attr.symbol, '');
		assert.strictEqual(currency(123,1)._attr.thousand, ',');
		assert.strictEqual(currency(123,1)._attr.decimal, '.');
		assert.strictEqual(currency(123,'$').value, 123);
		assert.strictEqual(currency(123,'$')._attr.rounding, 2);
		assert.strictEqual(currency(123,'$')._attr.symbol, '$');
		assert.strictEqual(currency(123,'$')._attr.thousand, ',');
		assert.strictEqual(currency(123,'$')._attr.decimal, '.');
	},	

	'class level default function': function() {
		assert.strictEqual(floatClass.getDefault(), 0);
	},	

	'instance level default function': function() {
		assert.strictEqual(currency().getDefault(), 0);
	},	

	'instance level defVal property': function() {
		assert.strictEqual(currency().defVal, 0);
	},	

	'get default value': function() {
		var obj = currency();
		assert.strictEqual(obj.value, 0);
	},	

	'set inital value': function() {
		var value = 123.456;
		assert.strictEqual(currency(value).value, value);
	},

	'set value': function() {
		var value = 456.123;
		var obj = currency();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate integer': function(done) {
		var value = 123;
		var obj = currency();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, value);
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = value;
	},

	'validate currency': function(done) {
		var value = 123.5;
		var obj = currency();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, value);
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = value;
		obj.removeAllListeners('change');
	},

	'invalid Num': function() {
		var obj = currency();
		assert.throws(function () {
				obj.value = '123.5';
			}, /Number expected/);
	},

	'parse': function() {
		var obj = currency();
		assert.strictEqual(obj.parse('$1,123.5').value, 1123.5);
	},

	'toString': function() {
		var obj = currency();
		assert.strictEqual(obj.parse('123.5').value, 123.5);
		assert.strictEqual(obj.toString(), '123.50');
	},

	'class level compare': function() {
		assert.strictEqual(floatClass.compare(123,  456), -333);
		assert.strictEqual(floatClass.compare(456,  123), 333);
		assert.strictEqual(floatClass.compare(123,  123), 0);
	},

	'compareTo': function() {
		var obj = currency(123);
		assert.strictEqual(obj.compareTo(456), -333);
		assert.strictEqual(obj.compareTo(4), 119);
		assert.strictEqual(obj.compareTo(123), 0);
	},

	'dup': function() {
		var currency = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = currency('');
			}, /Number expected/);
		var obj = currency(123.5);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 123.5);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.class_.links[0], 'dup');
		assert.strictEqual(obj.class_.links[1], 'currency');
		assert.strictEqual(obj.class_.links[2], 'float');
		assert.strictEqual(obj.class_.links[3], 'number');
		assert.strictEqual(obj.class_.links[4], 'entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
