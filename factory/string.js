'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	Is = util.Is;

var className = 'string';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			return this.classOf(className).super_.create.call(this,
				value === null || Is.undef(value) || Is.str(value) ||
				(Is.obj(value) && !Is.entity(value))
					? value 
					: value.toString(),
 		 	attr);
		},
		getDefault: function getDefault (attr) {
			return '';
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
				return false;

			if (typeof value === 'string')
				return true;

			// var err = new Error(5005, 'String expected');
			var err = new Error('String expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (obj, attr) {
			return this.classOf(className).super_.parse(obj.toString(), attr);
		},
		stringify: function stringify (value, attr) {
			return '"' + value + '"';
		},
		add: function add (a, b) {
			return [a, b].join('+');
		},
		stringOnly: function stringOnly () {
			return 'String only';
		}
	}
};

exports = module.exports = function stringClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
