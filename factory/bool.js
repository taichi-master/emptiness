'use strict';

var	entityFactory = require('./entity.js');

function convert (value) {
	if (typeof value === 'boolean')
		return value;
	if (typeof value === 'number')
		return Boolean(value);
	if (typeof value === 'string') {
		var val = value.toLowerCase();
		switch (val) {
			case 'true':
			case '.true.':
			case '.t.':
			case 't':
				return true;

			case 'false':
			case '.false.':
			case '.f.':
			case 'f':
				return false;

			default:
				return null;
		}
	}
	return null;
}

var className = 'bool';

var nature = {
	attr: {
		name: className
	},
	proto: {
		getDefault: function getDefault (attr) {
			return null;
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
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
			return this.classOf(className).super_.parse(convert(str), attr);
		},
		stringify: function stringify (value, attr) {
			return value === null ? 'null' : value.toString();
		}
	}
};

exports = module.exports = function boolClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
