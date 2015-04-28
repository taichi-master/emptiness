'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	list_stringify = util.list_stringify,
	list_valueOf = util.list_valueOf;

var className = 'list';

var nature = {
	attr: {
		name: className
	},
	proto: {
		getDefault: function getDefault (attr) {
			return [];
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
				return false;


			// no need validate all contents because all the values are validated already.
			if (Array.isArray(value))
				return true;

			// var err = new Error(5028, 'Array or arguments object expected');
			var err = new Error('Array or arguments object expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			var _delimit = attr && attr.delimit ? attr.delimit : 
							(this._attr && this._attr.delimit ? this._attr.delimit : ' ');
			return this.classOf(className).super_.parse(str.split(_delimit));
		},
		stringify: list_stringify,
		valueOf: list_valueOf,
		add: function add (a, b) {
			return a.concat(b);
		},
		objProto: {
			push: function push (obj) {
				this.value = this.value;
				this.value.push(obj);
				return this;
			},
			pop: function pop () {
				return this.value.pop();
			},
		},
		objProp: {
			length: {
				get: function () {
					return this.value.length;
				}
			}
		}
	}
};

exports = module.exports = function listClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
