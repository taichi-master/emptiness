'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	Is = util.Is,
	dict_stringify = util.dict_stringify,
	list_valueOf = util.list_valueOf;

var className = 'dict';

var nature = {
	attr: {
		name: className
	},
	proto: {
		getDefault: function getDefault (attr) {
			return {};
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
				return false;

			// no need validate all contents because all the values are validated already.
			if (Object.prototype.toString.call( value ) === '[object Object]')
				return true;

			// var err = new Error(5007, 'Object expected');
			var err = new Error('Object expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			return this.classOf(className).super_.parse(JSON.parse(str), attr);
		},
		stringify: dict_stringify,
		valueOf: function valueOf (value, attr) {
			var sb = {};
			Object.keys(value).forEach(function (key) {
				var obj = value[key];
				sb[key] = Array.isArray(obj) ? list_valueOf(obj) : obj.valueOf();
			});
			return sb;
		},
		add: function add (a, b) {
			Object.keys(b).forEach(function (key) {
				if (a.hasOwnProperty(key)) {
					if (Is.entity(a))
						a[key].value = a[key].add(b[key]);
					else
						a[key] += b[key];
				}
				else
					a[key] = b[key];
			});
			return a;
		}
	}
};

exports = module.exports = function dictClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
