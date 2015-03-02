var assert = require('assert'),
	util = require('../lib/util.js'),
	clone = util.clone,
	dupFactory = require('../factory/dup.js'),
	entityFactory = require('../factory/entity.js'),
	entityClass = entityFactory(),
	en = entityClass.create.bind(entityClass),
	enumFactory = require('../factory/enumerator.js');

exports['enumerator'] = {
	before: function() {
		assert.throws(function () {
				new enumClass();
			}, Error);
	},
	'instantiate': function() {
		// case 1
		var enumClass = enumFactory(),
			roles = enumClass.has(['user', 'admin', 'guest']).create.bind(enumClass),
			role = roles();

		assert.strictEqual(role.getClass().name, 'Enum');
		assert.strictEqual(role.getClass().super_.name, 'Entity');
		assert.strictEqual(role.getClass().super_.super_, null);

		assert.ok(role.isNone);
		assert.ifError(role.Is('user'));
		assert.ifError(role.Is('admin'));
		assert.ifError(role.Is('guest'));

		role = roles('admin')		
		assert.ifError(role.Is('user'));
		assert.ok(role.Is('admin'));
		assert.ifError(role.Is('guest'));

		role.value = 'guest';
		assert.ifError(role.Is('user'));
		assert.ifError(role.Is('admin'));
		assert.ok(role.Is('guest'));

		// case 2: add one more level
		var enumClass = enumFactory(null, {attr:{name:'Role', entities:['user', 'admin', 'guest']}}),
			roles = enumClass.create.bind(enumClass),
			role = roles();

		assert.strictEqual(role.getClass().name, 'Role');
		assert.strictEqual(role.getClass().super_.name, 'Enum');
		assert.strictEqual(role.getClass().super_.super_.name, 'Entity');
		assert.strictEqual(role.getClass().super_.super_.super_, null);

		assert.ok(role.isNone);
		assert.ifError(role.Is('user'));
		assert.ifError(role.Is('admin'));
		assert.ifError(role.Is('guest'));

		role = roles('admin');
		assert.ifError(role.Is('user'));
		assert.ok(role.Is('admin'));
		assert.ifError(role.Is('guest'));

		role.value = 'guest';
		assert.ifError(role.Is('user'));
		assert.ifError(role.Is('admin'));
		assert.ok(role.Is('guest'));
	},

	'dup': function() {
		enumFactory.entityClass = dupFactory();
		var enumClass = enumFactory(null, {attr:{name:'Role', entities:[en('user'), en('admin'), en('guest')]}}),
			roles = enumClass.create.bind(enumClass),
			obj = roles(en('admin')),
			newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().name, 'Role');
		assert.strictEqual(obj.getClass().super_.name, 'Enum');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Dup');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_, null);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value.value, 'admin');
		newObj.value = enumClass.memberOf('user');
		assert.ok(newObj.Is('user'));
		assert.ok(obj.Is('admin'));

		// cloning the class
		var enumClass2 = clone(enumClass);
		assert.notStrictEqual(enumClass, enumClass2);
		assert.strictEqual(enumClass.entities, enumClass2.entities);
		enumClass2.entities = [en('User'), en('Admin'), en('Guest')];
		assert.notStrictEqual(enumClass.entities, enumClass2.entities);
		assert.strictEqual(enumClass.entities[0].value, 'user');	// original is still user

		obj = enumClass2.create('Admin');
		newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().name, 'Role');
		assert.strictEqual(obj.getClass().super_.name, 'Enum');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Dup');
		assert.strictEqual(obj.getClass().super_.super_.super_.name, 'Entity');
		assert.strictEqual(obj.getClass().super_.super_.super_.super_, null);
		assert.strictEqual(obj.value, newObj.value);
		assert.strictEqual(newObj.value.value, 'Admin');
		obj.value = enumClass2.memberOf('User');
		assert.ok(obj.Is('User'));
		assert.ok(newObj.Is('Admin'));

		enumFactory.entityClass = null;
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
