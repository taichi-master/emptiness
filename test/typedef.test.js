'use strict';

var	assert = require('assert'),

	util = require('../lib/util.js'),
	Is = util.Is,
	entityFactory = require('../factory/entity.js'),
	dupFactory = require('../factory/dup.js'),
	numFactory = require('../factory/number.js'),
	strFactory = require('../factory/string.js'),
	strCls = strFactory(),
	typedef = require('../lib/typedef.js');

exports['typedef'] = {
	before: function() {
	},

	'.class_': function () {
		var str = typedef(strCls);
		assert.strictEqual(str.class_, strCls);
	},

	'.getClass()': function () {
		var str = typedef(strCls);
		assert.strictEqual(str.getClass(), strCls);
	},

	'.alias()': function () {
		var str = typedef(strCls);
		assert.strictEqual(str.alias(), 'str');
		assert.strictEqual(str.alias('foo'), str);
		assert.strictEqual(str.alias('foo').alias(), 'foo');
	},

	'.value': function () {
		var str = typedef(strCls);
		assert.strictEqual(str.value, strCls.name);
		assert.strictEqual(str.value, 'Str');
	},

	'.nature': function () {
		var str = typedef(strCls);
		assert.strictEqual(str.nature.proto, strCls);
	},

	'.is()': function () {
		var str = typedef(strCls),
			en = typedef(entityFactory());
		assert.strictEqual(en.alias(), 'entity');
		assert.strictEqual(en.getClass().name, 'Entity');
		assert.strictEqual(en(123).value, 123);
		en = en.is(str);
		assert.strictEqual(en.alias(), 'entity');
		assert.strictEqual(en.getClass().name, 'Str');	// added one level.
		assert.strictEqual(en.getClass().super_.name, 'Entity');
		assert.throws(function () {
			en({_value: 123});
		}, /String expected/);
	},

	'.has()': function () {
		var str = typedef(strCls),
			dup = typedef(dupFactory()),
			en = typedef(entityFactory());

		en = en.has(dup.nature);

		assert.strictEqual(en.alias(), 'dup');
		assert.strictEqual(en.class_.name, 'Dup');
		assert.strictEqual(en.class_.super_.name, 'Entity');
		assert.strictEqual(en.class_.super_.super_, null);

		var obj = en({abc:123});
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value['abc'], newObj.value['abc']);
		newObj.value['abc'] = 456;
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(newObj.value['abc'], 456);
		assert.strictEqual(newObj.attr(), undefined);
		obj = en(123);
	},

	'.assume()': function () {	// set default
		var str = typedef(strCls);
		assert.strictEqual(str().value, '');
		str.assume('abc');
		assert.strictEqual(str().value, 'abc');
		assert.strictEqual(str('def').value, 'def');
	},
}

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
