var assert = require('assert'),
	typedef = require('../lib/typedef.js'),
	entityFactory = require('../factory/entity.js'),
	dupFactory = require('../factory/dup.js'),
	structFactory = require('../factory/struct.js'),
	structClass = structFactory();

var first = typedef(entityFactory(null, 'first')),
	last = typedef(entityFactory().has('last')),
	nameVal = {first:'John', last:'Doe'},
	nameStr = '{"first":"John","last":"Doe"}',
	name,
	user;

exports['struct'] = {
	before: function() {
		assert.throws(function () {
				new structClass();
			}, Error);
	},

	'instantiate': function() {
		// case 1
		name = structFactory(null, [first, last]);
		assert.strictEqual(name.enTypes.length, 2);
		assert.strictEqual(name.name, 'struct');
		assert.strictEqual(name.super_.name, 'dict');
		assert.strictEqual(name.super_.super_.name, 'entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);

		// case 2
		name = structFactory(null, {attr: {name: 'name', enTypes: [first, last]}});
		assert.strictEqual(name.enTypes.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'struct');
		assert.strictEqual(name.super_.super_.name, 'dict');
		assert.strictEqual(name.super_.super_.super_.name, 'entity');
		assert.strictEqual(name.__proto__.name, 'struct');
		assert.strictEqual(name.__proto__.__proto__.name, 'dict');
		assert.strictEqual(name.__proto__.__proto__.__proto__.name, 'entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);

		// case 3
		name = structFactory().has('name').has([first, last]);
		assert.strictEqual(name.enTypes.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'struct');
		assert.strictEqual(name.super_.super_.name, 'dict');
		assert.strictEqual(name.super_.super_.super_.name, 'entity');
		assert.strictEqual(name.__proto__.name, 'struct');
		assert.strictEqual(name.__proto__.__proto__.name, 'dict');
		assert.strictEqual(name.__proto__.__proto__.__proto__.name, 'entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);
	},

	'dup': function() {
		structFactory.entityClass = dupFactory();
		name = structFactory().has('name').has([first, last]);
		assert.strictEqual(name.enTypes.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'struct');
		assert.strictEqual(name.super_.super_.name, 'dict');
		assert.strictEqual(name.super_.super_.super_.name, 'dup');
		assert.strictEqual(name.super_.super_.super_.super_.name, 'entity');
		assert.strictEqual(name.enTypes.class_.name, 'typelist');
		assert.strictEqual(name.enTypes.class_.super_.name, 'list');
		assert.strictEqual(name.enTypes.class_.super_.super_.name, 'entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		var user2 = user.dup();
		assert.notStrictEqual(user, user2);
		assert.notStrictEqual(user.value, user2.value);
		assert.strictEqual(user.class_, user2.class_);
		assert.strictEqual(user.toString(), user2.toString());
		assert.strictEqual(user2.toString(), nameStr);
		structFactory.entityClass = null;
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
