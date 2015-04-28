'use strict';

var	assert = require('assert'),

	spawn = require('../lib/spawn.js'),
	str = spawn('string'),
	util = require('../lib/util.js'),
	reload = util.reload,
	Is = util.Is;

var	user = spawn('user'),
	admin = spawn('admin'),
	guest = spawn('guest'),

	role;

exports['spawn'] = {
	before: function() {
	},

	'enumerator': function () {
		var	userRole;

		role = spawn('enumerator', 'role')
				.assume(guest)
				.has(admin)
				.has(user)
				.has(guest);

		userRole = role();

		assert.strictEqual(role.alias(), 'role');
		assert.strictEqual(role.class_.name, 'role');
		assert.strictEqual(role.class_.super_.name, 'enumerator');
		assert.strictEqual(role.class_.super_.super_.name, 'entity');
		assert.strictEqual(role.class_.entities.length, 3);

		assert.ok(Is.type(role));
		assert.ok(Is.entity(userRole));

		assert.ok(userRole.Is(guest));
		userRole.value = admin;
		assert.ifError(userRole.Is(guest));
		assert.ok(userRole.Is(admin));

		userRole.value = user;
		assert.ifError(userRole.Is(admin));
		assert.ok(userRole.Is(user));
		assert.strictEqual(userRole.valueOf(), 'user');
		assert.strictEqual(userRole.toString(), 'user');
		assert.strictEqual(user.valueOf(), 'user');
		assert.strictEqual(user.toString(), 'user');
		assert.strictEqual(role.valueOf(), 'role');
		assert.strictEqual(role.toString(), 'role');
	},

	'struct': function () {
		var struct = spawn('struct'),
			name = spawn('name', [spawn('first'), spawn('last')]),	// create struct with the array
			account = spawn('account', [])
						 .has(name)
						 .has(spawn('email'))
						 .has(role),
			usr = account({name:{first:'John', last:'Doe'}, email:'doe@email.com', role:'user'});	// role can accept a string and ...			
		assert.strictEqual(usr.toString(), '{"name":{"first":"John","last":"Doe"},"email":"doe@email.com","role":"user"}');
		assert.ok(usr.role.Is(user));	// ... convert string to a proper value.

		// create struct by using struct class
		account = struct.has('account')
					.has(name)
					.has(spawn('email'))
					.has(role),
		usr = account({name:{first:'John', last:'Doe'}, email:'doe@email.com', role:admin});
		assert.strictEqual(usr.toString(), '{"name":{"first":"John","last":"Doe"},"email":"doe@email.com","role":"admin"}');

		// wrap clsObj with enType
		account = spawn(struct.has([name, spawn('email'), role]));
		usr = account({name:{first:'John', last:'Doe'}, email:'doe@email.com'});
		assert.strictEqual(usr.toString(), '{"name":{"first":"John","last":"Doe"},"email":"doe@email.com","role":"guest"}');

		var dup = spawn('dup');
		spawn.entityClass = dup.class_;
		name = spawn('name', [spawn('first'), spawn('last')]);
		account = spawn('account', [])
					 .has(name)
					 .has(spawn('email'))
					 .has(role);
		usr = account({name:{first:'John', last:'Doe'}, email:'doe@email.com', role:'user'});
		var usr2 = usr.dup();
		assert.notStrictEqual(usr, usr2);
		assert.notStrictEqual(usr.value, usr2.value);
		assert.strictEqual(usr.class_, usr2.class_);
		assert.strictEqual(usr.class_.struct, usr2.class_.struct);
		assert.strictEqual(usr.toString(), usr2.toString());
		assert.strictEqual(usr2.toString(), '{"name":{"first":"John","last":"Doe"},"email":"doe@email.com","role":"user"}');
		spawn.entityClass = null;
	},

	'required': function () {
		var	required = spawn('required'),
			email = spawn('email'),

			account = spawn('account', [spawn(str, 'name'), email]),
			user = account({name:'John', email:'doe@email.com'});

		// normal case
		assert.strictEqual(user.name.value, 'John');
		assert.strictEqual(user.email.value, 'doe@email.com');
		assert.strictEqual(user.valueOf().name, 'John');
		assert.strictEqual(user.valueOf().email, 'doe@email.com');
		assert.strictEqual(user.toString(), '{"name":"John","email":"doe@email.com"}');

		// without email
		user = account({name:'John'});
		assert.strictEqual(user.name.value, 'John');
		assert.strictEqual(user.email.value, '');
		assert.strictEqual(user.valueOf().name, 'John');
		assert.strictEqual(user.valueOf().email, undefined);
		assert.strictEqual(user.toString(), '{"name":"John"}');
		assert.strictEqual(email.alias(), 'email');
		assert.strictEqual(email.class_.name, 'email');
		assert.strictEqual(email.class_.super_.name, 'string');
		assert.strictEqual(email.class_.super_.super_.name, 'entity');

		// without email but with required modifier
		email = email.is(required);
		assert.strictEqual(email.alias(), 'email');
		assert.strictEqual(email.class_.name, 'required');
		assert.strictEqual(email.class_.super_.name, 'email');
		assert.strictEqual(email.class_.super_.super_.name, 'string');
		assert.strictEqual(email.class_.super_.super_.super_.name, 'entity');
		account = spawn('account', [spawn(str, 'name'), email]);	// note: needs to redefined account again
		assert.throws(function () {
				user = account({name:'John'})
			}, /Value expected/);
		user = account({name:'John', email:'doe@email.com'});
		assert.strictEqual(user.name.value, 'John');
		assert.strictEqual(user.email.value, 'doe@email.com');
		assert.strictEqual(user.valueOf().name, 'John');
		assert.strictEqual(user.valueOf().email, 'doe@email.com');
		assert.strictEqual(user.toString(), '{"name":"John","email":"doe@email.com"}');
	},
	
}

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
