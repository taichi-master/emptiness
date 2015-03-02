var assert = require('assert'),
	dupFactory = require('../factory/dup.js'),
	dtFactory = require('../factory/datetime.js'),
	dtClass = dtFactory(),
	dt = dtClass.create.bind(dtClass);

exports['datetime'] = {
	before: function() {
		assert.throws(function () {
				new dtClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = dt({});
			}, /Date Time object expected/);
		assert.strictEqual(dt().value.short, dtClass.now.short);
		assert.strictEqual(dt().short, dtClass.now.short);
		assert.strictEqual(dt().date, dtClass.now.short.substring(0,4));
		assert.strictEqual(dt().time, dtClass.now.short.substring(11));
		assert.strictEqual(dt()._attr, undefined);
		assert.strictEqual(dt(24*3600*1000).value.short, '1970-01-02T00:00:00');
		assert.strictEqual(dt(24*3600*1000)._attr, undefined);
		assert.strictEqual(dt(new Date(2011, 0, 1, 2, 3, 4, 567)).toString(), '2011-01-01T07:03:04.567Z');
		assert.strictEqual(dt('2011-01-26T13:51:50.417').toString(), '2011-01-26T13:51:50.417Z');
		assert.strictEqual(dt('January 26, 2011 13:51:50').toString(), '2011-01-26T18:51:50.000Z');
	},	

	'class level default function': function() {
		assert.strictEqual(dtClass.getDefault().short, dtClass.now.short);	// always now
	},	

	'instance level default function': function() {
		assert.strictEqual(dt().getDefault().short, dtClass.now.short);
	},	

	'instance level default property': function() {
		assert.strictEqual(dt().defVal.short, dtClass.now.short);
	},	

	'get default value': function() {
		var obj = dt();
		assert.strictEqual(obj.toShort(), dtClass.now.short);
	},	

	'set inital value': function() {
		var value = new Date();
		assert.strictEqual(dt(value).value, value);
	},

	'set value': function() {
		var value = new Date();
		var obj = dt();
		obj.value = value;
		assert.strictEqual(obj.value, value);
	},

	'validate': function(done) {
		var obj = dt(),
			now = new Date();
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, now);
			assert.strictEqual(oldValue.short, dtClass.now.short);	// date is not set before there the default is always now
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = now;
	},

	'parse': function() {
		var obj = dt();
		assert.strictEqual(obj.parse('2011-01-26T13:51:50.417').toString(), '2011-01-26T13:51:50.417Z');
	},

	'toString': function() {
		var obj = dt();
		assert.strictEqual(obj.parse('January 26, 2011 13:51:50').value.toJSON(), (new Date('January 26, 2011 13:51:50')).toJSON());
		assert.strictEqual(obj.toString(), (new Date('January 26, 2011 13:51:50')).toJSON());
	},

	'class level compare': function() {
		assert.strictEqual(dtClass.compare(dt(123), dt(456)), -333);
		assert.strictEqual(dtClass.compare(dt(456), dt(123)), 333);
		assert.strictEqual(dtClass.compare(dt(123), dt(123)), 0);
	},

	'compareTo': function() {
		var obj = dt(123);
		assert.strictEqual(obj.compareTo(dt(456)), -333);
		assert.strictEqual(obj.compareTo(dt(4)), 119);
		assert.strictEqual(obj.compareTo(dt(123)), 0);
	},

	'dup': function() {
		var dupClass = dupFactory(dtClass);
		var dt = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = dt({});
			}, /Date Time object expected/);
		var obj = dt(123);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value.short, newObj.value.short);
		assert.strictEqual(newObj.getClass().name, 'Dup');
		assert.strictEqual(newObj.getClass().super_.name, 'DateTime');
		assert.strictEqual(newObj.getClass().super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
