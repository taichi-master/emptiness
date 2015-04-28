'use strict';

var util = require('../lib/util.js'),
	deepMixIn = util.deepMixIn,
	floatFactory = require('./float.js');

function formatMoney(number, places, symbol, thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

var className = 'currency';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			return this.classOf(className).super_.create.call(this, value, deepMixIn({rounding: 2, symbol: '', thousand: ',', decimal: '.'}, attr));
		},
		parse: function parse (str, attr) {
			return this.classOf(className).super_.parse(str, attr);
		},
		stringify: function stringify (value, attr) {
			return formatMoney(value, attr.rounding, attr.symbol, attr.thousand, attr.decimal);
		},
		valueOf: function valueOf (value, attr) {
			var places = Math.pow(10, attr.rounding);
			return Math.round(value * places) / places;
		},
		formatMoney: formatMoney
	}
};

exports = module.exports = function floatClassFactory (clsObj, attr) {
	var temp = floatFactory.__proto__;
	floatFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.floatClass ? exports.floatClass : floatFactory()),
		class_ = _this.has(nature);
	floatFactory.__proto__ = temp;
	if (attr)
		return class_.has(attr);
	return class_;
};
