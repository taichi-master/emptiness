var assert = require('assert'),
	dupFactory = require('../factory/dup.js'),
	emailFactory = require('../factory/email.js'),
	emailClass = emailFactory(),
	email = emailClass.create.bind(emailClass);

exports['email'] = {
	before: function() {
		assert.throws(function () {
				new emailClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = email('abc');
			}, /Invalid email address/);
		assert.strictEqual(email().value, '');
		assert.strictEqual(email()._attr, undefined);
		assert.strictEqual(email('abc@email.com').value, 'abc@email.com');

		var newClass = emailFactory(null, {}),
			re = newClass.re;
		newClass.re = /.*/;
		assert.strictEqual(newClass.re.toString(), '/.*/');
		assert.strictEqual(newClass.super_.re, re);
		assert.doesNotThrow(function () {
				var i = newClass.create('abc');
			}, /Invalid email address/);
	},	

	'class level default function': function() {
		assert.strictEqual(emailClass.getDefault(), '');
	},	

	'instance level default function': function() {
		assert.strictEqual(email().getDefault(), '');
	},	

	'instance level defVal property': function() {
		assert.strictEqual(email().defVal, '');
	},	

	'get default value': function() {
		var obj = email();
		assert.strictEqual(obj.value, '');
	},	

	'set inital value': function() {
		var value = 'abc@email.com';
		assert.strictEqual(email(value).value, value);
	},

	'set value': function() {
		var value = 'abc@email.com';
		var obj = email();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = email();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, 'abc@email.com');
			assert.strictEqual(oldValue, null);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = 'abc@email.com';
	},

	'dup': function() {
		var dupClass = dupFactory(emailClass),
			email = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = email('');
			}, /Invalid email address/);
		var obj = email('abc@email.com');
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 'abc@email.com');
		assert.strictEqual(obj.class_.name, 'dup');
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.class_.super_.name, 'email');
		assert.strictEqual(obj.class_.super_.super_.name, 'string');
		assert.strictEqual(obj.class_.super_.super_.super_.name, 'entity');
		newObj.value = 'John@email.com';
		assert.strictEqual(obj.value, 'abc@email.com');
		assert.strictEqual(newObj.value, 'John@email.com');

		// or
		emailFactory.entityClass = dupFactory();
		emailClass = emailFactory();
		email = emailClass.create.bind(emailClass);

		assert.throws(function () {
				var i = email('');
			}, /Invalid email address/);
		obj = email('abc@email.com');
		newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 'abc@email.com');
		assert.strictEqual(obj.class_, newObj.class_);
		assert.strictEqual(obj.class_.name, 'email');
		assert.strictEqual(obj.class_.super_.name, 'string');
		assert.strictEqual(obj.class_.super_.super_.name, 'dup');
		assert.strictEqual(obj.class_.super_.super_.super_.name, 'entity');
		newObj.value = 'John@email.com';
		assert.strictEqual(obj.value, 'abc@email.com');
		assert.strictEqual(newObj.value, 'John@email.com');

		emailFactory.entityClass = null;
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
