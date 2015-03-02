'use strict';

var	numFactory = require('./number.js');

var className = 'Int';

var nature = {
	attr: {
		name: className
	},
	proto: {
		validate: function validate (value, attr) {
			if (!this.getClassOf(className).super_.validate(value, attr))
				return false;

			if (value % 1 === 0)
				return true;

			var err = new Error('Integer expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			return this.getClassOf(className).super_.parse(parseInt(str), attr);
		}
	}
};

exports = module.exports = function integerClassFactory (clsObj, attr) {
	var temp = numFactory.__proto__;
	numFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.numberClass ? exports.numberClass : numFactory()),
		class_ = _this.has(nature);
	numFactory.__proto__ = temp;
	if (attr)
		return class_.has(attr);
	return class_;
};
