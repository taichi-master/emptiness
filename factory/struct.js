'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	recordFactory = require('./record.js'),
	listFactory = require('./list.js');

var className = 'Struct';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			var	struct = value ? value : [],
				recCls = this.recCls.has({attr: {name: Is.str(attr) ? attr : '(anonymous)'}});

			recCls.struct = this.getClassOf(className).super_.create.call(this, struct, attr);

			return recCls;
		}
	}
};

exports = module.exports = function structClassFactory (clsObj, attr) {
	var temp = listFactory.__proto__,
		temp2 = recordFactory.__proto__;
	listFactory.__proto__ = recordFactory.__proto__ = exports;

	var _this = clsObj ? clsObj : (exports.listClass ? exports.listClass : listFactory()),
		class_ = _this.has(nature);

	class_.recCls = exports.recordClass ? exports.recordClass : recordFactory();
	
	listFactory.__proto__ = temp;
	recordFactory.__proto__ = temp2;

	if (attr)
		return class_.has(attr);
	
	return class_;
};
