var assert = require('assert'),
	spawn = require('../lib/spawn.js'),
	structFactory = require('../factory/struct.js'),
	structClass = structFactory(),
	struct = structClass.create.bind(structClass),
	recordFactory = require('../factory/record.js'),
	recordClass = recordFactory(),
	dupFactory = require('../factory/dup.js');

var first = spawn('first'),
	last = spawn('last'),
	nameVal = {first:'John', last:'Doe'},
	nameStr = '{"first":"John","last":"Doe"}',
	name,
	user;

exports['record'] = {
	before: function() {
		assert.throws(function () {
				new recordClass();
			}, Error);
	},

	'instantiate': function() {
		// case 1
		name = recordFactory();
		name.struct.value = [first, last];
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'Rec');
		assert.strictEqual(name.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);

		// case 2
		name = recordFactory(null, {attr: {name: 'name'}});
		name.struct.value = [first, last];
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.__proto__.name, 'Rec');
		assert.strictEqual(name.__proto__.__proto__.name, 'Dict');
		assert.strictEqual(name.__proto__.__proto__.__proto__.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);

		// case 3	using struct
		name = struct([first, last], 'name')
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		name = name.create.bind(name);
		user = name(nameVal);
		assert.strictEqual(user.toString(), nameStr);
	},

	'dup': function() {
		recordFactory.entityClass = dupFactory();
		name = recordFactory(null, {attr: {name: 'name'}});
		name.struct.value = [first, last];
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Dup');
		assert.strictEqual(name.super_.super_.super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		var user2 = user.dup();
		assert.notStrictEqual(user, user2);
		assert.notStrictEqual(user.value, user2.value);
		assert.strictEqual(user.getClass(), user2.getClass());
		assert.strictEqual(user.toString(), user2.toString());
		assert.strictEqual(user2.toString(), nameStr);

		structFactory.entityClass = dupFactory();
		structClass = structFactory(),
		struct = structClass.create.bind(structClass);
		name = struct([first, last], 'name')
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Dup');
		assert.strictEqual(name.super_.super_.super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		user2 = user.dup();
		assert.notStrictEqual(user, user2);
		assert.notStrictEqual(user.value, user2.value);
		assert.strictEqual(user.getClass(), user2.getClass());
		assert.strictEqual(user.toString(), user2.toString());
		assert.strictEqual(user2.toString(), nameStr);
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
