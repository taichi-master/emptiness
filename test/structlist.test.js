var assert = require('assert'),
	util = require('../lib/util.js'),
	Is = util.Is,
	typedef = require('../lib/typedef.js'),
	entityFactory = require('../factory/entity.js'),
	dupFactory = require('../factory/dup.js'),

	structFactory = require('../factory/struct.js'),
	structClass = structFactory(),
	struct = structClass.create.bind(structClass),

	structlistFactory = require('../factory/structlist.js'),
	structlistClass = structlistFactory(),
	structlist = structlistClass.create.bind(structlistClass);

var first = typedef(entityFactory(null, 'first')),
	last = typedef(entityFactory().has('last'));

exports['structlist'] = {
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
		var temp = structlistFactory.structFactory,
			lstCls = structlistFactory(),
			lst = lstCls.create([{first:'John', last:'Doe'}]),
			enType = lst.class_.enType;
		assert.strictEqual(enType.alias(), 'dict');
		assert.strictEqual(lst.value.length, 1);
		assert.strictEqual(lst.value[0].class_.name, 'dict');
		assert.strictEqual(lst.value[0].value.first, 'John');
		assert.strictEqual(lst.value[0].value.last, 'Doe');

		structlistFactory.structFactory = structFactory;
		lstCls = structlistFactory();
		lst = lstCls.create([{first:'John', last:'Doe'}]);
		enType = lst.class_.enType;
		assert.strictEqual(enType.alias(), 'struct');
		assert.strictEqual(lst.value.length, 1);
		assert.strictEqual(lst.value[0].class_.name, 'struct');
		assert.strictEqual(lst.value[0].value.first.class_.name, 'first');
		assert.strictEqual(lst.value[0].value.first.value, 'John');
		assert.strictEqual(lst.value[0].value.last.class_.name, 'last');
		assert.strictEqual(lst.value[0].value.last.value, 'Doe');

		// case 2
		lstCls = structlistFactory();
		lst = lstCls.create([{x:1, y:2}, {x:0.3, y:0.4}]);
		assert.strictEqual(lst.summary.value.x.value, 1.3);
		assert.strictEqual(lst.summary.value.y.value, 2.4);

		structlistFactory.structFactory = temp;
	},

	'toString': function() {
		lstCls = structlistFactory();
		lst = lstCls.create([{x:1, y:2}, {x:0.3, y:0.4}]);
		assert.strictEqual(lst.toString(), '[{"x":1,"y":2},{"x":0.3,"y":0.4}]');
	},

	'valueOf': function() {
		lstCls = structlistFactory();
		lst = lstCls.create([{x:1, y:2}, {x:0.3, y:0.4}]);
		var value = lst.valueOf();
		assert.strictEqual(value.length, 2);
		assert.strictEqual(value[0].x, 1);
		assert.strictEqual(value[0].y, 2);
		assert.strictEqual(value[1].x, 0.3);
		assert.strictEqual(value[1].y, 0.4);
	},

	'push': function() {
		lstCls = structlistFactory();
		lst = lstCls.create([{x:1, y:2}, {x:0.3, y:0.4}]);
		assert.strictEqual(lst.value.length, 2);
		lst.push({x:0.5, y:0.6});
		assert.strictEqual(lst.value.length, 3);
		assert.strictEqual(lst.summary.value.x, 1.8);
		assert.strictEqual(lst.summary.value.y, 4);
	},

	'dup': function() {
		structlistFactory.entityClass = dupFactory();

		structlistClass = structlistFactory(),
		structlist = structlistClass.create.bind(structlistClass);
		assert.throws(function () {
				var name = structlist({});
			}, /Array or arguments object expected/);
		var lst1 = structlist([{first:'John', last:'Doe'}]);
		assert.strictEqual(lst1.class_.name, 'structlist');
		assert.strictEqual(lst1.class_.super_.name, 'list');
		assert.strictEqual(lst1.class_.super_.super_.name, 'dup');
		assert.strictEqual(lst1.class_.super_.super_.super_.name, 'entity');

		var lst2 = lst1.dup();
		assert.strictEqual(lst2.class_.name, 'structlist');
		assert.strictEqual(lst2.class_.super_.name, 'list');
		assert.strictEqual(lst2.class_.super_.super_.name, 'dup');
		assert.strictEqual(lst2.class_.super_.super_.super_.name, 'entity');

		lst2.value.pop();
		assert.strictEqual(lst1.length, 1);
		assert.strictEqual(lst2.length, 0);

		structlistFactory.entityClass = null;
	},

};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
