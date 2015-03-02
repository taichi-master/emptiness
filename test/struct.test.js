var assert = require('assert'),
	util = require('../lib/util.js'),
	Is = util.Is,
	spawn = require('../lib/spawn.js'),
	dupFactory = require('../factory/dup.js'),
	structFactory = require('../factory/struct.js'),
	structClass = structFactory(),
	struct = structClass.create.bind(structClass);

var first = spawn('first'),
	last = spawn('last'),
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
		name = structFactory().create([first, last]);
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, '(anonymous)');
		name = struct([first, last], 'name');
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.struct.getClass().name, 'Struct');
		assert.strictEqual(name.struct.getClass().super_.name, 'List');
		assert.strictEqual(name.struct.getClass().super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		assert.strictEqual(user.getClass().name, 'name');
		assert.strictEqual(user.getClass().struct.getClass().name, 'Struct');

		// case 2
		name = struct()
					.has(first)
					.has(last);
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, '(anonymous)');
		name = struct([], 'name')
					.has(first)
					.has(last);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.struct.getClass().name, 'Struct');
		assert.strictEqual(name.struct.getClass().super_.name, 'List');
		assert.strictEqual(name.struct.getClass().super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		assert.strictEqual(user.getClass().name, 'name');
		assert.strictEqual(user.getClass().struct.getClass().name, 'Struct');

		// case 3
		name = struct().has([first, last]);
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, '(anonymous)');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.struct.getClass().name, 'Struct');
		assert.strictEqual(name.struct.getClass().super_.name, 'List');
		assert.strictEqual(name.struct.getClass().super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		assert.strictEqual(user.getClass().name, '(anonymous)');
		assert.strictEqual(user.getClass().struct.getClass().name, 'Struct');

		// case 4
		name = struct([first, last]);
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, '(anonymous)');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.__proto__.name, 'Rec');
		assert.strictEqual(name.__proto__.__proto__.name, 'Dict');
		assert.strictEqual(name.__proto__.__proto__.__proto__.name, 'Entity');
		assert.strictEqual(name.struct.getClass().name, 'Struct');
		assert.strictEqual(name.struct.getClass().super_.name, 'List');
		assert.strictEqual(name.struct.getClass().super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		assert.strictEqual(user.getClass().name, '(anonymous)');
		assert.strictEqual(user.getClass().struct.getClass().name, 'Struct');
	},

	'dup': function() {
		structFactory.entityClass = dupFactory();
		structClass = structFactory(),
		struct = structClass.create.bind(structClass);
		assert.throws(function () {
				var name = struct({});
			}, /Array or arguments object expected/);
		name = struct([first, last], 'name')
		assert.strictEqual(name.struct.value.length, 2);
		assert.strictEqual(name.name, 'name');
		assert.strictEqual(name.super_.name, 'Rec');
		assert.strictEqual(name.super_.super_.name, 'Dict');
		assert.strictEqual(name.super_.super_.super_.name, 'Dup');
		assert.strictEqual(name.super_.super_.super_.super_.name, 'Entity');
		assert.strictEqual(name.struct.getClass().name, 'Struct');
		assert.strictEqual(name.struct.getClass().super_.name, 'List');
		assert.strictEqual(name.struct.getClass().super_.super_.name, 'Dup');
		assert.strictEqual(name.struct.getClass().super_.super_.super_.name, 'Entity');
		user = name.create(nameVal);
		assert.strictEqual(user.toString(), nameStr);
		var user2 = user.dup();
		assert.notStrictEqual(user, user2);
		assert.notStrictEqual(user.value, user2.value);
		assert.strictEqual(user.getClass(), user2.getClass());
		assert.strictEqual(user.getClass().struct, user2.getClass().struct);
		assert.strictEqual(user.toString(), user2.toString());
		assert.strictEqual(user2.toString(), nameStr);
	},};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
