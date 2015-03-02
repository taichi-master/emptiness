var assert = require('assert'),
	dictClass = require('../factory/dict.js')(),
	dict = dictClass.create.bind(dictClass);
	numClass = require('../factory/number.js')(),
	num = numClass.create.bind(numClass),
	strClass = require('../factory/string.js')(),
	str = strClass.create.bind(strClass),
	listClass = require('../factory/list.js')(),
	dupClass = require('../factory/dup.js')(listClass),
	list = listClass.create.bind(listClass);

exports['list'] = {
	before: function() {
		assert.throws(function () {
				new listClass();
			}, Error);
	},

	'instantiate': function() {
		assert.throws(function () {
				var i = list({});
			}, /Array or arguments object expected/);
		var lst = list();
		assert.strictEqual(lst.isNone, true);
		assert.strictEqual(lst.value.length, 0);
		assert.strictEqual(lst._attr, undefined);
		assert.strictEqual(lst.pop(), undefined);
		lst.push('123');
		assert.strictEqual(lst.isNone, false);
		assert.strictEqual(lst.value.length, 1);
		assert.strictEqual(lst._attr, undefined);
		assert.strictEqual(lst.pop(), '123');
	},
	
	'class level default function': function() {
		assert.strictEqual(Array.isArray( listClass.getDefault() ), true);
	},

	'instance level default function': function() {
		assert.strictEqual(Object.prototype.toString.call( list().getDefault() ), '[object Array]');
	},	

	'instance level defVal property': function() {
		assert.strictEqual(Object.prototype.toString.call( list().defVal ), '[object Array]');
	},	

	'get default value': function() {
		assert.strictEqual(Object.prototype.toString.call( list().value ), '[object Array]');
	},	

	'set inital value': function() {
		var value = [1, 2, 3];
		var lst = list(value);
		assert.strictEqual(lst.value.length, 3);
		assert.strictEqual(lst.value[0], 1);
		assert.strictEqual(lst.value[1], 2);
		assert.strictEqual(lst.value[2], 3);
	},

	'set value': function() {
		var value = [1, 2, 3];
		var lst = list();
		lst.value = value;
		assert.strictEqual(lst.value.length, 3);
		assert.strictEqual(lst.value[0], 1);
		assert.strictEqual(lst.value[1], 2);
		assert.strictEqual(lst.value[2], 3);
	},

	'validate': function(done) {
		var value = [1, 2, 3];
		var lst = list();
		lst.on('change', function(value, oldValue, self) {
			assert.strictEqual(value.length, 3);
			assert.strictEqual(value[0], 1);
			assert.strictEqual(value[1], 2);
			assert.strictEqual(value[2], 3);
			assert.strictEqual(oldValue.length, 0);
			assert.strictEqual(lst, self);
			done();			
		});
		lst.value = value;
	},

	'parse': function() {
		var lst = list().parse('1 2.2 3 abc def').valueOf();
		assert.strictEqual(lst[0], '1');
		assert.strictEqual(lst[1], '2.2');
		assert.strictEqual(lst[2], '3');
		assert.strictEqual(lst[3], 'abc');
		assert.strictEqual(lst[4], 'def');
	},

	'toString': function() {
		var lst = list([1,num(2.2),num(3.0), str('abc'), 'def']);
		assert.strictEqual(lst.toString(), '[1,2.2,3,"abc","def"]');
	},

	'valueOf': function() {
		var lst = list([1,num(2.2),num(3.0), str('abc'), 'def']);
		var lst = lst.valueOf();
		assert.strictEqual(lst[0], 1);
		assert.strictEqual(lst[1], 2.2);
		assert.strictEqual(lst[2], 3);
		assert.strictEqual(lst[3], 'abc');
		assert.strictEqual(lst[4], 'def');

		lst = list([[0, null, 'abc', {'abc':123}, [[num(0.1),'a'],[1,{'def':456}]]],
			 [1, null, 'def', [[1,'x'],[2,'y'],[3,dict({r:1, c:dict({z:2})})]]]]);
		lst = lst.valueOf();
		assert.strictEqual(lst[0][4][0][0], 0.1);
		assert.strictEqual(lst[1][3][2][1]['c']['z'], 2);
	},

	'dup': function() {
		var list = dupClass.create.bind(dupClass);
		assert.throws(function () {
				var i = list({});
			}, /Array or arguments object expected/);
		var obj = list([1,num(2.2),num(3.0), str('abc'), 'def']);
		var newObj = obj.dup();
		assert.notStrictEqual(obj, newObj);
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.notStrictEqual(obj.value, newObj.value);
		assert.strictEqual(obj.value[0], newObj.value[0]);
		assert.strictEqual(obj.value[1].value, newObj.value[1].value);
		assert.strictEqual(obj.value[2].value, newObj.value[2].value);
		assert.strictEqual(obj.value[3].value, newObj.value[3].value);
		assert.strictEqual(obj.value[4], newObj.value[4]);
		assert.strictEqual(obj.toString(), '[1,2.2,3,"abc","def"]');
		assert.strictEqual(newObj.toString(), '[1,2.2,3,"abc","def"]');
		assert.strictEqual(obj.value[4], newObj.value[4]);
		newObj.value[2].value = 456;
		assert.strictEqual(obj.value[2].value, 3);
		assert.strictEqual(newObj.value['2'].value, 456);
		assert.strictEqual(newObj.attr(), undefined);
		assert.strictEqual(obj.getClass().name, 'Dup');
		assert.strictEqual(obj.getClass(), newObj.getClass());
		assert.strictEqual(obj.getClass().super_.name, 'List');
		assert.strictEqual(obj.getClass().super_.super_.name, 'Entity');
	},
};

if (module == require.main) {
	require('./run_mocha.js')(__filename);
}
