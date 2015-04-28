'use strict';

var assert = require('assert'),
	entityClass = require('../factory/entity.js')(),
	dupClass = require('../factory/dup.js')(entityClass),
	en = entityClass.create.bind(entityClass);

exports['entity'] = {
	before: function() {
		assert.throws(function () {
				new entityClass();
			}, Error);
	},

	'instantiate': function() {
		assert.strictEqual(en().value, null);
		assert.strictEqual(en()._attr, undefined);
		assert.strictEqual(en(null).value, null);
		assert.strictEqual(en(null)._attr, undefined);
		assert.strictEqual(en(false).value, false);
		assert.strictEqual(en(false)._attr, undefined);
		assert.strictEqual(en(0,1).value, 0);
		assert.strictEqual(en(0,1)._attr, 1);
		assert.strictEqual(en(0,1).attr(), 1);
		var value = {abc: 123},
			attr = {def: 456},
			obj = en(value, attr);
		assert.strictEqual(obj.value, value);
		assert.strictEqual(obj.attr(), attr);
		assert.strictEqual(obj.class_.root, obj.class_);
		assert.strictEqual(obj.class_.super_, null);
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(obj.attr('def'), 456);
		assert.strictEqual(obj.attr({name:'entity'}), obj);
		assert.strictEqual(obj.attr('def'), 456);
		assert.strictEqual(obj.attr('name'), 'entity');
		value['abc'] = 'a';
		attr['def'] = 'd';
		assert.strictEqual(obj.value, value);
		assert.strictEqual(obj.attr(), attr);
		assert.strictEqual(obj.value['abc'], 'a');
		assert.strictEqual(obj.attr('def'), 'd');
		assert.strictEqual(obj.attr('name'), 'entity');
		assert.strictEqual(attr['name'], 'entity');
	},	

	'class level default function': function() {
		assert.strictEqual(entityClass.getDefault(), null);
	},	

	'instance level default function': function() {
		assert.strictEqual(en().getDefault(), null);
	},	

	'instance level defVal property': function() {
		assert.strictEqual(en().defVal, null);
	},	

	'get default value': function() {
		assert.strictEqual(en().value, null);
	},	

	'isNone': function() {
		var obj = en();
		assert.strictEqual(obj.isNone, true);
		obj.value = 123;
		assert.strictEqual(obj.isNone, false);
	},	

	'set inital value': function() {
		var value = 123;
		assert.strictEqual(en(value).value, value);
	},

	'set value': function() {
		var value = 456;
		var obj = en();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'Validate': function(done) {
		var obj = en();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, 123);
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = 123;
	},

	'parse': function() {
		var obj = en();
		obj.parse('123');
		assert.strictEqual(obj.value, '123');
		assert.strictEqual(obj.attr(), undefined);
		obj.parse('123', 123);
		assert.strictEqual(obj.value, '123');
		assert.strictEqual(obj.attr(), 123);
		obj.parse('456');
		assert.strictEqual(obj.value, '456');
		assert.strictEqual(obj.attr(), 123);
	},

	'toString': function() {
		var obj = en();
		assert.strictEqual(obj.toString(), 'null');
		assert.strictEqual(obj.parse(123).value, 123);
		assert.strictEqual(obj.toString(), '123');
	},

	'class level compare': function() {
		assert.strictEqual(entityClass.compare(123,  456), -1);
		assert.strictEqual(entityClass.compare(456,  123), 1);
		assert.strictEqual(entityClass.compare(123,  123), 0);
	},

	'compareTo': function() {
		var obj = en(123);
		assert.strictEqual(obj.compareTo(456), -1);
		assert.strictEqual(obj.compareTo(4), 1);
		assert.strictEqual(obj.compareTo(123), 0);
	},

	'dup': function() {
		en = dupClass.create.bind(dupClass);
		var obj = en({abc:123});
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value['abc'], newObj.value['abc']);
		newObj.value['abc'] = 456;
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(newObj.value['abc'], 456);
		assert.strictEqual(newObj.attr(), undefined);
		obj = en(123);
		assert.strictEqual(obj.class_.name, 'dup');
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.class_.super_.name, 'entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
