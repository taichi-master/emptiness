'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	typedef = require('../lib/typedef.js'),
	structlistFactory = require('./structlist.js'),
	typelistFactory = require('./typelist.js'),
	dictFactory = require('./dict.js');

var className = 'struct';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
// console.log(value);
			var _private = {},
				self = this,
				prop = {},
				obj,
				enTypes = this.enTypes;

			if (value === null || Is.undef(value))
				return this.classOf(className).super_.create.call(this, value, attr);

			var dictFactory = typedef.dictFactory,
				listFactory = typedef.listFactory,
				structFactory = structlistFactory.structFactory;
			typedef.dictFactory = exports.dictFactory ? exports.dictFactory : structClassFactory;
			typedef.listFactory = exports.listFactory ? exports.listFactory : structlistFactory;
			structlistFactory.structFactory = structClassFactory;

			Object.keys(value).forEach(function (key) {	// build structure on-the-fly based on data
				var arr = key.split('|');
				var k = arr[0].trim().toLowerCase().replace(/[\s-]/g, '_');
				var v = value[key],
					val =  v ? (Is.date(v) ? v : v.valueOf()) : (Is.undef(v) ? null : v),
					enType = enTypes.getType(k);

// console.log(val);
// console.log(key);

				if (Is.undef(enType))
					enTypes.push( enType = typedef(val, k) );

// console.log(enType.class_.links);
				_private[k] = enType(val, attr);
// console.log(enType.class_.links);
				
				_private[k].title = arr[1] ? arr[1].trim() : arr[0];
				_private[k].desciption = arr.length > 2 ? arr[2].trim() : '';
			});

			structlistFactory.structFactory = structFactory;
			typedef.dictFactory = dictFactory;
			typedef.listFactory = listFactory;

			enTypes.value.forEach(function (enType) {	// set structure properties
				var key = enType.alias();
				if (Is.undef(_private[key])){
					// console.log(key);
					_private[key] = enType();
				}
				prop[key] = {
					get: function () {
						return _private[key];
					}
				}
				prop[key].title = _private[key].title;
				prop[key].description = _private[key].description;
				// if (!Is.undef(_private[key])){
				// 	prop[key] = {
				// 		get: function () {
				// 			return _private[key];
				// 		}
				// 	}
				// }
			});

			obj = this.classOf(className).super_.create.call(this, _private, attr);

			Object.defineProperties(obj, prop);

			return obj;
		},
		stringify: function stringify (value, attr) {
			return this.classOf(className).super_.stringify(this.valueOf(value, attr), attr);
		},
		valueOf: function valueOf (value, attr) {
			var obj, val,
				sb = {};
			Object.keys(value).forEach(function (key) {
				obj = value[key];
				if (obj === null)
					console.log(key)
				else {
					if (!obj.isNone) {
						val = obj.valueOf();
						if (val !== null)
							sb[key] = val;
					}
				}
			});
			return sb;
		},
		has: function has (value) {
			var class_ = this;
			if (Is.str(value) || Is.attr(value)) {
				// class_ = this.classOf(className).super_.has.call(this, value);
				class_ = this.classOf('dict').has.call(this, value);
			} else {
				if (!Array.isArray(value))
					value = [value];
				value.forEach(function (obj) {
					class_.enTypes.push(obj);
				});
			}
			return class_;
		},
		objProp: {
			summary: { 
				get: function () {
					var self = this,
						class_ = self.class_,
						dictClass = class_.classOf('dict'),
						summ = {};
					class_.enTypes.value.forEach(function (enType) {
						var key = enType.alias();
						if (self.hasOwnProperty(key))
							summ[key] = self[key].hasOwnProperty('summary')  ? self[key].summary : self[key];
					});
					return dictClass.create(summ);
				}
			}
		}
	}
};

function structClassFactory (clsObj, attr) {
	var temp = dictFactory.__proto__;
	dictFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.dictClass ? exports.dictClass : dictFactory()),
		class_ = _this.has(nature);
	dictFactory.__proto__ = temp;

	var _enTypes = (exports.typelistClass ? exports.typelistClass : typelistFactory()).create(
		Array.isArray(attr) ?
			attr : 
			(Is.attr(attr) && attr.attr.enTypes ? attr.attr.enTypes : [])
	);
	Object.defineProperty(class_, 'enTypes', {
		get: function () {
			return _enTypes;
		},
		set: function (value) {
			_enTypes = value;
		}
	}); 

	if (Is.attr(attr) || Is.str(attr))
		class_ = class_.has(attr);

	return class_;
};

exports = module.exports = structClassFactory
