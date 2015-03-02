'use strict';

// http://oranlooney.com/functional-javascript/

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js');

var className = 'Dup';

var nature = {
	attr: {
		name: className
	},
	proto: {
		cp: util.cp,
		objProto: {
			dup: function dup () {
				return util.dup(this);
			}
		}
	}
};

exports = module.exports = function dupClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
