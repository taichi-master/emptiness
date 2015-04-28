var assert = require('assert'),
	util = require('../lib/util.js'),
	Is = util.Is,
	typedef = require('../lib/typedef.js'),
	entityFactory = require('../factory/entity.js'),
	dupFactory = require('../factory/dup.js'),
	typelistFactory = require('../factory/typelist.js'),
	typelistClass = typelistFactory(),
	typelist = typelistClass.create.bind(typelistClass);

var first = typedef(entityFactory(null, 'first')),
	last = typedef(entityFactory().has('last'));

exports['typelist'] = {
	before: function() {
		assert.throws(function () {
				new enTypesClass();
			}, Error);		
		assert.strictEqual(first.alias(), 'first');
		assert.strictEqual(first.class_.name, 'first');
		assert.strictEqual(first.class_.super_.name, 'entity');
		assert.strictEqual(last.alias(), 'last');
		assert.strictEqual(last.class_.name, 'last');
		assert.strictEqual(last.class_.super_.name, 'entity');
	},
	'instantiate': function() {
		// case 1
		var enTypes = typelistFactory().create([first, last]);
		assert.strictEqual(enTypes.length, 2);
		assert.strictEqual(enTypes.class_.name, 'typelist');
		assert.strictEqual(enTypes.class_.super_.name, 'list');
		assert.strictEqual(enTypes.class_.super_.super_.name, 'entity');

		// case 2
		enTypes = typelist([first, last]);
		assert.strictEqual(enTypes.length, 2);
		assert.strictEqual(enTypes.class_.name, 'typelist');
		assert.strictEqual(enTypes.class_.super_.name, 'list');
		assert.strictEqual(enTypes.class_.super_.super_.name, 'entity');

		// case 3
		enTypes = typelist(['first', entityFactory().has('last')]);
		assert.strictEqual(enTypes.length, 2);
		assert.strictEqual(enTypes.class_.name, 'typelist');
		assert.strictEqual(enTypes.class_.super_.name, 'list');
		assert.strictEqual(enTypes.class_.super_.super_.name, 'entity');
		assert.strictEqual(enTypes.value[0].class_.name, first.class_.name);
		assert.strictEqual(enTypes.value[1].class_.name, last.class_.name);
	},

	'length': function() {
		var enTypes = typelist([first, last]);
		assert.strictEqual(enTypes.length, 2);
	},

	'valueOf': function() {
		var enTypes = typelist([first, last]);
		assert.strictEqual(enTypes.valueOf()[0], 'first');
		assert.strictEqual(enTypes.valueOf()[1], 'last');
	},

	'getType': function() {
		var enTypes = typelist([first, last]);
		assert.strictEqual(enTypes.getType('first'), first);
		assert.strictEqual(enTypes.getType('last'), last);
		assert.strictEqual(enTypes.getType('name'), undefined);
	},

	'push': function() {
		var enTypes = typelist();
		assert.strictEqual(enTypes.length, 0);
		enTypes.push(first);
		assert.strictEqual(enTypes.length, 1);
		assert.strictEqual(enTypes.getType('first'), first);
		enTypes.push('last');
		assert.strictEqual(enTypes.length, 2);
		assert.notStrictEqual(enTypes.getType('last'), last);
		assert.strictEqual(enTypes.getType('last').alias(), last.alias());

		// or
		enTypes = typelist();
		assert.strictEqual(enTypes.length, 0);
		enTypes.push(first).push(last);
		assert.strictEqual(enTypes.length, 2);
		assert.strictEqual(enTypes.getType('first'), first);
		assert.strictEqual(enTypes.getType('last'), last);
	},

	'dup': function() {
		typelistFactory.entityClass = dupFactory();

		typelistClass = typelistFactory(),
		typelist = typelistClass.create.bind(typelistClass);
		assert.throws(function () {
				var name = typelist({});
			}, /Array or arguments object expected/);
		var enTypes1 = typelist([first, last]);
		assert.strictEqual(enTypes1.class_.name, 'typelist');
		assert.strictEqual(enTypes1.class_.super_.name, 'list');
		assert.strictEqual(enTypes1.class_.super_.super_.name, 'dup');
		assert.strictEqual(enTypes1.class_.super_.super_.super_.name, 'entity');

		var enTypes2 = enTypes1.dup();
		assert.strictEqual(enTypes2.class_.name, 'typelist');
		assert.strictEqual(enTypes2.class_.super_.name, 'list');
		assert.strictEqual(enTypes2.class_.super_.super_.name, 'dup');
		assert.strictEqual(enTypes2.class_.super_.super_.super_.name, 'entity');

		enTypes2.value.pop();
		assert.strictEqual(enTypes1.length, 2);
		assert.strictEqual(enTypes2.length, 1);

		typelistFactory.entityClass = null;
	},};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
