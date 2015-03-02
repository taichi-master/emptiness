'use strict';

var	entityFactory = require('./entity.js');

function convert (value) {
	if (typeof value === 'boolean')
		return value;
	if (typeof value === 'number')
		return Boolean(value);
	if (typeof value === 'string') {
		if (value.toLowerCase().indexOf('t') >= 0)
			return true;
		if (value.toLowerCase().indexOf('f') >= 0)
			return false;
	}
	return null;
}

var className = 'Bool';

var nature = {
	attr: {
		name: className
	},
	proto: {
		getDefault: function getDefault (attr) {
			return null;
		},
		validate: function validate (value, attr) {
			if (!this.getClassOf(className).super_.validate(value, attr))
				return false;

			if (typeof value === 'boolean')
				return true;

			// var err = new Error(5010, 'Boolean expected');
			var err = new Error('Boolean expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			return this.getClassOf(className).super_.parse(convert(str), attr);
		},
		stringify: function stringify (value, attr) {
			return value === null ? 'null' : value.toString();
		}
	}
};

exports = module.exports = function booleanClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
