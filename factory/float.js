'use strict';

var	numFactory = require('./number.js');

var className = 'Float';

var nature = {
	attr: {
		name: className
	},
	proto: {
		parse: function parse (str, attr) {
			return this.getClassOf(className).super_.parse(parseFloat(str), attr);
		},
		stringify: function stringify (value, attr) {
			var str = this.getClassOf(className).super_.stringify(value, attr);
			return str.indexOf('.') > 0 ? str : str + '.0';
		}
	}
};

exports = module.exports = function floatClassFactory (clsObj, attr) {
	var temp = numFactory.__proto__;
	numFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.numberClass ? exports.numberClass : numFactory()),
		class_ = _this.has(nature);
	numFactory.__proto__ = temp;
	if (attr)
		return class_.has(attr);
	return class_;
};
