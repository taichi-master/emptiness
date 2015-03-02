var assert = require('assert'),
	intClass = require('../factory/integer.js')(),
	int = intClass.create.bind(intClass),
	floatClass = require('../factory/float.js')(),
	float = floatClass.create.bind(floatClass),
	strClass = require('../factory/string.js')(),
	str = strClass.create.bind(strClass),
	listClass = require('../factory/list.js')(),
	list = listClass.create.bind(listClass),
	dictClass = require('../factory/dict.js')(),
	dupClass = require('../factory/dup.js')(dictClass),
	dict = dictClass.create.bind(dictClass);

exports['dict'] = {
	before: function() {
		assert.throws(function () {
				new dupClass();
			}, Error);
	},

	'instantiate': function() {
		var value = {abc:123, def:456};
		assert.strictEqual(dict(value).value, value);
		assert.strictEqual(dict(value).value['abc'], 123);
		assert.strictEqual(dict(value).value['def'], 456);
		assert.strictEqual(dict(value)._attr, undefined);
	},	

	'class level default function': function() {
		assert.strictEqual(Object.prototype.toString.call( dictClass.getDefault() ), '[object Object]');
	},

	'instance level default function': function() {
		assert.strictEqual(Object.prototype.toString.call( dict().getDefault() ), '[object Object]');
	},	

	'instance level defVal property': function() {
		assert.strictEqual(Object.prototype.toString.call( dict().defVal ), '[object Object]');
	},	

	'get default value': function() {
		assert.strictEqual(Object.prototype.toString.call( dict().value ), '[object Object]');
	},	

	'set inital value': function() {
		var value = {abc:123, def:456};
		var obj = dict(value);
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(obj.value['def'], 456);
	},

	'set value': function() {
		var value = {abc:123, def:456};
		var obj = dict();
		obj.value = value;
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(obj.value['def'], 456);
	},

	'validate': function(done) {
		var value = {abc:123, def:456};
		var obj = dict({foo:999});
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(obj.value['abc'], 123);
			assert.strictEqual(obj.value['def'], 456);
			assert.strictEqual(oldValue['foo'], 999);
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = value;
	},

	'parse': function() {
		var obj = dict().parse('{"abc":123, "def":456}');
		assert.strictEqual(obj.value['abc'], 123);
		assert.strictEqual(obj.value['def'], 456);
	},

	'toString': function() {
		var obj = dict({"abc":123, "def":456});
		assert.strictEqual(obj.toString(), '{"abc":123,"def":456}');
		obj = dict({"abc":123, "def":int(456), "str":str('ABC'), 'dict':dict({inner:dict({inner2:'xyz'})}),
			'lst': [dict({a:1}), {b:2}, 3, null],
			'list': list([dict({a:1}), {b:2}, 3, null])
		});
		assert.strictEqual(obj.toString(), '{"abc":123,"def":456,"str":"ABC","dict":{"inner":{"inner2":"xyz"}},"lst":[{"a":1},{"b":2},3,null],"list":[{"a":1},{"b":2},3,null]}');
	},

	'valueOf': function() {
		var obj = dict({"abc":123, "def":456});
		assert.strictEqual(obj.toString(), '{"abc":123,"def":456}');
		obj = dict({"abc":123, "def":int(456), "str":str('ABC'), 'dict':dict({inner:dict({inner2:'xyz'})}),
			'lst': [dict({a:1}), {b:2}, 3, null],
			'list': list([dict({a:1}), {b:2}, 3, null])
		});
		var value = obj.valueOf();
		assert.strictEqual(value.abc, 123);
		assert.strictEqual(value.def, 456);
		assert.strictEqual(value.str, 'ABC');
		assert.strictEqual(value.dict.inner.inner2, 'xyz');
		assert.strictEqual(value.lst[0].a, 1);
		assert.strictEqual(value.lst[3], null);
		assert.strictEqual(value.list[0].a, 1);
		assert.strictEqual(value.list[3], null);
	},

	'dup': function() {
		var dict = dupClass.create.bind(dupClass);
		var obj = dict({"abc":123, "def":{"xyz":456}});
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value['abc'], newObj.value['abc']);
		assert.strictEqual(obj.toString(), '{"abc":123,"def":{"xyz":456}}');
		assert.strictEqual(newObj.toString(), '{"abc":123,"def":{"xyz":456}}');
		assert.strictEqual(newObj.attr(), undefined);
		assert.strictEqual(obj.getClass().name, 'Dup');
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().super_.name, 'Dict');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Entity');
	},
};

// if this module is the script being run, then run the tests:
if (module == require.main) {
	var mocha = require('child_process').spawn('mocha', [ '--colors', '--ui',
	'exports', '--reporter', 'spec', __filename ]);
	mocha.stdout.pipe(process.stdout);
	mocha.stderr.pipe(process.stderr);
}
