var assert = require('assert'),
	floatClass = require('../factory/float.js')(),
	float = floatClass.create.bind(floatClass),
	strClass = require('../factory/string.js')(),
	dupClass = require('../factory/dup.js')(strClass),
	str = strClass.create.bind(strClass);

exports['string'] = {
	before: function() {
		assert.throws(function () {
				new strClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = str({});
			}, /String expected/);
		assert.strictEqual(str().value, '');
		assert.strictEqual(str()._attr, undefined);
		assert.strictEqual(str(null).value, '');
		assert.strictEqual(str(null)._attr, undefined);
		assert.strictEqual(float(123).toString(), '123.0');
		assert.strictEqual(str(float(123)).value, '123.0');
		assert.strictEqual(str([]).value, '');
		assert.strictEqual(str([])._attr, undefined);
		assert.strictEqual(str([1,'2',3,'abc']).value, '1,2,3,abc');
		assert.strictEqual(str([1,'2',3,'abc'])._attr, undefined);
		assert.strictEqual(str('999').value, '999');
		assert.strictEqual(str('999')._attr, undefined);
		assert.strictEqual(str('123',1).value, '123');
		assert.strictEqual(str('123',1)._attr, 1);
		assert.strictEqual(str('123',1).attr(), 1);
	},	

	'class level default function': function() {
		assert.strictEqual(strClass.getDefault(), '');
	},	

	'instance level default function': function() {
		assert.strictEqual(str().getDefault(), '');
	},	

	'instance level defVal property': function() {
		assert.strictEqual(str().defVal, '');
	},	

	'get default value': function() {
		var obj = str();
		assert.strictEqual(obj.value, '');
	},	

	'set inital value': function() {
		var value = '123';
		assert.strictEqual(str(value).value, value);
	},

	'set value': function() {
		var value = '456';
		var obj = str();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = str();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, '123');
			assert.strictEqual(oldValue, '');
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = '123';
	},

	'parse': function() {
		var obj = str();
		assert.strictEqual(obj.parse('123').value, '123');
	},

	'str': function() {
		var obj = str();
		assert.strictEqual(obj.parse('123').value, '123');
		assert.strictEqual(obj.toString(), '"123"');
	},

	'class level compare': function() {
		assert.strictEqual(strClass.compare('123',  '456'), -1);
		assert.strictEqual(strClass.compare('456',  '123'), 1);
		assert.strictEqual(strClass.compare('123',  '123'), 0);
	},

	'compareTo': function() {
		var obj = str('123');
		assert.strictEqual(obj.compareTo('456'), -1);
		assert.strictEqual(obj.compareTo('001'), 1);
		assert.strictEqual(obj.compareTo('123'), 0);
	},

	'dup': function() {
		var str = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = str({});
			}, /String expected/);
		var obj = str(123);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, '123');
		assert.strictEqual(newObj.getClass().name, 'Dup');
		assert.strictEqual(newObj.getClass().super_.name, 'Str');
		assert.strictEqual(newObj.getClass().super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
