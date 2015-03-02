var assert = require('assert'),
	emailFactory = require('../factory/email.js'),
	dupFactory = require('../factory/dup.js'),
	requiredFactory = require('../factory/required.js'),
	requiredClass = requiredFactory(),
	required = requiredClass.create.bind(requiredClass);

exports['required'] = {
	before: function() {
		assert.throws(function () {
				new requiredClass();
			}, Error);
	},
	'instantiate': function() {
		// email is not required.
		var emailClass = emailFactory(),
			email = emailClass.create.bind(emailClass),
			obj = email();
		assert.strictEqual(obj.getClass().name, 'Email');
		assert.strictEqual(obj.value, '');
		assert.strictEqual(obj.isNone, true);

		// required entity.
		assert.throws(function () {
				obj = required();
			}, /Value expected/);
		obj = required('whatever');
		assert.strictEqual(obj.getClass().name, 'Required');
		assert.strictEqual(obj.getClass().super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_, null);

		// email as entity
		requiredFactory.entityClass = emailClass;
		requiredClass = requiredFactory(),
		required = requiredClass.create.bind(requiredClass);
		assert.throws(function () {
				obj = required();
			}, /Value expected/);
		assert.throws(function () {
				obj = required('whatever');
			}, /Invalid email address/);
		assert.doesNotThrow(function () {
				obj = required('abc@email.com');
			}, /Invalid email address/);
		assert.strictEqual(obj.getClass().name, 'Required');
		assert.strictEqual(obj.getClass().super_.name, 'Email');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Str');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_, null);
		requiredFactory.entityClass = null;	// reset
		requiredClass = requiredFactory(),
		required = requiredClass.create.bind(requiredClass);

		// required email.
		emailClass = requiredFactory(emailClass);
		email = emailClass.create.bind(emailClass);
		assert.throws(function () {
				obj = email();
			}, /Value expected/);
		assert.throws(function () {
				obj = email('');
			}, /Value expected/);
		obj = email('abc@email.com');
		assert.strictEqual(obj.getClass().name, 'Required');
		assert.strictEqual(obj.getClass().super_.name, 'Email');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Str');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_, null);
		assert.strictEqual(obj.value, 'abc@email.com');
		assert.strictEqual(obj.isNone, false);
	},

	'dup': function() {
		var emailClass = dupFactory(requiredFactory(emailFactory())),
			email = emailClass.create.bind(emailClass),
			obj = email('abc@email.com');
			newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().name, 'Dup');
		assert.strictEqual(obj.getClass().super_.name, 'Required');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Email');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Str');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_.super_, null);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value, 'abc@email.com');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
