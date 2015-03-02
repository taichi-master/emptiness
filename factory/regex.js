'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	Is = util.Is;

var className = 'RegEx';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			return this.getClassOf(className).super_.create.call(this, Is.str(value) ? new RegExp(value) : value, attr);
		},
		getDefault: function getDefault (attr) {
			return new RegExp();
		},
		validate: function validate (value, attr) {
			if (!this.getClassOf(className).super_.validate(value, attr))
				return false;

			if (Is.regex(value))
				return true;

			// var err = new Error(5016, 'Regular Expression object expected');
			var err = new Error('Regular Expression object expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (pattern, flags) {
			return this.getClassOf(className).super_.parse(new RegExp(pattern, flags));
		}
	}
};

exports = module.exports = function regexClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
