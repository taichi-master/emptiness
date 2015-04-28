'use strict';

var	entityFactory = require('./entity.js');

var className = 'required';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function (value, attr) {
			if (value) {
				return this.classOf(className).super_.create.call(this, value, attr);
			}
			else {
				var err = new Error('Value expected');
				err.arguments = [{value: value, attr: attr}];
				err.type = this;
				throw err;
			}
		}
	}
};

exports = module.exports = function requiredClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
