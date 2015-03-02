'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	enType = require('../lib/typedef.js'),
	dictFactory = require('./dict.js');

var className = 'Rec';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			var _private = {},
				prop = {},
				obj;

			this.struct.value.forEach(function (enType) {
				var key = enType.alias(),
					val;
				try {
					val = 'value' in value[key] ? value[key].value : value[key];
				} catch (e) {
					val = value[key];
				}
				_private[key] = enType(val);
				prop[key] = {
					get: function () {
						return _private[key];
					}
				}
			});

			obj = this.getClassOf(className).super_.create.call(this, _private, attr);

			Object.defineProperties(obj, prop);

			return obj;
		},
		stringify: function stringify (value, attr) {
			return this.getClassOf(className).super_.stringify(this.valueOf(value, attr), attr);
		},
		valueOf: function valueOf (value, attr) {
			var obj, val,
				sb = {};
			Object.keys(value).forEach(function (key) {
				obj = value[key];
				if (Is.entity(obj) && obj.isNone) {
					// console.log(obj.isNone);
				}
				else {
					val = obj.valueOf();
					if (val !== null)
						sb[key] = val;
				}
			});
			return sb;
		},
		has: function has (value) {
			var class_ = this;
			if (Is.attr(value)) {
				class_ = this.getClassOf(className).super_.has.call(this, value);
			} else {
				if (!Array.isArray(value))
					value = [value];
				value.forEach(function (obj) {
					if (Is.entity(obj))
						obj = obj.getClass();
					if (Is.clsObj(obj))
						obj = enType(obj);
					class_.struct.value.push(obj);
				});
			}
			return class_;
		},
	}
};

exports = module.exports = function recordClassFactory (clsObj, attr) {
	var temp = dictFactory.__proto__;
	dictFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.dictClass ? exports.dictClass : dictFactory()),
		_struct = {value: []},
		class_ = _this.has(nature);
	dictFactory.__proto__ = temp;

	class_.struct = _struct;

	if (attr)
		return class_.has(attr);

	return class_;
};
