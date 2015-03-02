var assert = require('assert'),
	util = require('../lib/util.js');

exports['conceptual'] = {
	'property': function () {
		var obj1 = {_value: null},
			obj2 = util.clone(obj1),
			// obj3 = owl.clone(obj1),
			obj3 = Object.create(obj1),
			obj4 = Object.create(obj3);
		Object.defineProperties(obj1, {
			value: {
				get: function () {
					return this._value;
				},
				set: function (value) {
					return this._value = value;
				}
			}
		});
		assert.strictEqual(obj1.value, null);
		assert.strictEqual(obj2.value, null);
		assert.strictEqual(obj3.value, null);
		assert.strictEqual(obj4.value, null);
		obj1.value = 123;
		assert.strictEqual(obj1.value, 123);
		assert.strictEqual(obj1._value, 123);
		assert.strictEqual(obj2.value, 123);
		assert.strictEqual(obj2._value, 123);
		assert.strictEqual(obj3.value, 123);
		assert.strictEqual(obj3._value, 123);
		assert.strictEqual(obj4.value, 123);
		assert.strictEqual(obj4._value, 123);
		obj2.value = 456;
		assert.strictEqual(obj2._value, 456);
		assert.strictEqual(obj1._value, 123);
		assert.strictEqual(obj3._value, 123);
		assert.strictEqual(obj4._value, 123);
		obj3.value = 789;
		assert.strictEqual(obj3._value, 789);
		assert.strictEqual(obj4._value, 789);
		assert.strictEqual(obj1._value, 123);
		assert.strictEqual(obj2._value, 456);

		Object.defineProperties(obj4, {
			value: {
				get: function () {
					return 'value = ' + this._value;
					// return 'value = ' + this.value;	// endless loop
					// return 'value = ' + this.__proto__.value; // 789
					// return 'value = ' + this.__proto__.__proto__.value; // 123
					// return 'value = ' + this.__proto__.__proto__.__proto__.value;	// undefined
					// return 'value = ' + this.__proto__.__proto__.__proto__.__proto__.value;	// obj4.obj3.obj1.Object.null
				},
				set: function (value) {
					return this._value = value;
				}
			}
		});
		assert.strictEqual(obj4._value, 789);
		assert.strictEqual(obj4.value, 'value = 789');
	},

	'clone': function () {
		var original = { a:'A', b:'B' };
		var clone = util.clone(original);
		assert.strictEqual(clone.a, 'A');	// clone.a == 'A'
		assert.strictEqual(clone.b, 'B');	// clone.b == 'B'
		clone.a = 'Apple';
		assert.strictEqual(clone.a, 'Apple');
		assert.strictEqual(original.a, 'A');	// original.a == 'A'  // unchanged
		original.b = 'Banana'
		assert.strictEqual(clone.b, 'Banana');	// clone.b == 'Banana'  // change shows through
		clone.c = 'Car'
		assert.strictEqual(original.c, undefined);	// original.c is undefined
		original.a = 'Abracadabra'
		assert.strictEqual(clone.a, 'Apple');  // clone's new value hides the original's
		delete clone.a
		assert.strictEqual(clone.a, 'Abracadabra');	// original value visible again
		delete clone.a
		assert.strictEqual(original.a, 'Abracadabra');	// repeating "delete clone.a" won't delete the original's value.
		delete original;
		assert.strictEqual(clone.a, 'Abracadabra');	// clone.a == 'A'		
	}
}

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
