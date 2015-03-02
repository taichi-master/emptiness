'use strict';

var	stringFactory = require('./string.js');

var className = 'Email';

var nature = {
	attr: {
		name: className
	},
	proto: {
		validate: function validate (value, attr) {
			if (!this.getClassOf(className).super_.validate(value, attr))
				return false;

			if (this.re.test(value))
				return true;

			var err = new Error('Invalid email address');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
	}
};

exports = module.exports = function emailClassFactory (clsObj, attr) {
	var temp = stringFactory.__proto__;
	stringFactory.__proto__ = exports;
	var _this = clsObj ? clsObj : (exports.stringClass ? exports.stringClass : stringFactory()),
		class_ = _this.has(nature);
	stringFactory.__proto__ = temp;

	class_.re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (attr)
		return class_.has(attr);

	return class_;
};
