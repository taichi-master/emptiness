var assert = require('assert'),
	regexClass = require('../factory/regex.js')(),
	dupClass = require('../factory/dup.js')(regexClass),
	regex = regexClass.create.bind(regexClass);

exports['regex'] = {
	before: function() {
		assert.throws(function () {
				new regexClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = regex({});
			}, /Regular Expression object expected/);
		assert.strictEqual(regex().value.toString(), '/(?:)/');
		assert.strictEqual(regex()._attr, undefined);
	},	

	'class level default function': function() {
		assert.strictEqual(regexClass.getDefault().toString(), '/(?:)/');
	},	

	'instance level default function': function() {
		assert.strictEqual(regex().getDefault().toString(), '/(?:)/');
	},	

	'instance level default property': function() {
		assert.strictEqual(regex().defVal.toString(), '/(?:)/');
	},	

	'get default value': function() {
		var obj = regex();
		assert.strictEqual(obj.value.toString(), '/(?:)/');
	},	

	'set inital value': function() {
		var value = /.*/;
		assert.strictEqual(regex(value).value.toString(), '/.*/');
	},

	'set value': function() {
		var value = /.*/;
		var obj = regex();
		obj.value = value;
		assert.strictEqual(obj.value.toString(), value.toString());
	},

	'validate': function(done) {
		var obj = regex(),
			val = /.*/;
		obj.on('change', function(value, oldValue, self) {
			assert.strictEqual(value, val);
			assert.strictEqual(oldValue.toString(), '/(?:)/');
			assert.strictEqual(obj, self);
			done();			
		});
		obj.value = val;
	},

	'parse': function() {
		var obj = regex();
		assert.strictEqual(obj.parse('.*').value.toString(), '/.*/');
	},

	'toString': function() {
		var obj = regex();
		assert.strictEqual(obj.parse('.*').value.toString(), '/.*/');
		assert.strictEqual(obj.toString(), '/.*/');
	},

	'dup': function() {
		var regex = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = regex({});
			}, /Regular Expression object expected/);
		var val = /.*/;
		var obj = regex(val);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value.toString(), newObj.value.toString());
		assert.strictEqual(newObj.value.toString(), '/.*/');
		assert.strictEqual(newObj.getClass().name, 'Dup');
		assert.strictEqual(newObj.getClass().super_.name, 'RegEx');
		assert.strictEqual(newObj.getClass().super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
