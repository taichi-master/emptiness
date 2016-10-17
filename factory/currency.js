'use strict';

var util = require('../lib/util.js'),
	deepMixIn = util.deepMixIn,
	floatFactory = require('./float.js');

// Thanks to Joss Crowcroft for his formatMoney function
// http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
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
			switch (typeof attr) {
				case 'number':
					attr = {rounding: attr};
					break;
				case 'string':
					attr = {symbol: attr};
					break;
			}
			// var attr2 = {};
			// attr2.__proto__ = attr;
			var attr2 = Object.create(attr);
			typeof attr.rounding === 'undefined' && (attr2.rounding = 2);
			typeof attr.symbol === 'undefined' && (attr2.symbol = '');
			typeof attr.thousand === 'undefined' && (attr2.thousand = ',');
			typeof attr.decimal === 'undefined' && (attr2.decimal = '.');
			return this.classOf(className).super_.create.call(this, value, attr2);
			// return this.classOf(className).super_.create.call(this, value, deepMixIn({rounding: 2, symbol: '', thousand: ',', decimal: '.'}, attr));
		},
		parse: function parse (str, attr) {
			return this.classOf(className).super_.parse(str.replace(new RegExp('[^0-9-' + attr.decimal + ']', 'g'), ''), attr);
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
