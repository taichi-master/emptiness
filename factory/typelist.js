'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	typedef = require('../lib/typedef.js'),
	entityFactory = require('./entity.js'),
	listFactory = require('./list.js');

var className = 'typelist';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			var obj = this.classOf(className).super_.create.call(this, value, attr);
			if (!obj.isNone)
				obj.value.forEach(function (enType, i) {
					obj.value[i] = typedef(enType);
				});
			return obj;
		},
		objProto: {
			getType: function getType (key) {
				for (var i = 0, len = this.value.length; i < len; i++) {
					var enType = this.value[i];
					if (enType.alias() === key)
						return enType;
				};
				return undefined;
			},
			contains: function contains (key) {
				return this.getType(key) !== undefined;
			},
			push: function push (enType) {
				this.value = this.value;
				this.value.push(typedef(enType));
				return this;
			}
		}
	}
};

exports = module.exports = function typelistClassFactory (clsObj, attr) {
	var temp = listFactory.__proto__;
	listFactory.__proto__ = exports;

	var _this = clsObj ? clsObj : (exports.listClass ? exports.listClass : listFactory()),
		class_ = _this.has(nature);

	listFactory.__proto__ = temp;

	if (attr)
		return class_.has(attr);
	
	return class_;
};
