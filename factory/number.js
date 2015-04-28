'use strict';

var	entityFactory = require('./entity.js');

var className = 'number';

var nature = {
	attr: {
		name: className
	},
	proto: {
		getDefault: function getDefault (attr) {
			return 0;
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
				return false;

			if (typeof value === 'number')
				return true;

			// var err = new Error(5001, 'Number expected');
			var err = new Error('Number expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			return this.classOf(className).super_.parse(Number(str), attr);
		},
		stringify: function stringify (value, attr) {
			return value.toString(10);
		},
		compare: function compare (a, b) {
			return a - b;
		}
	}
};

exports = module.exports = function numberClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
