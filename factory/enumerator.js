'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	Is = util.Is;

function getLookUp (value) {
	var lookup = value ? value.valueOf(): value;
	if (Is.type(value))
		lookup = value.alias();
	else if (Is.clsObj(value))
		lookup = value.name;
	return lookup;
}

var className = 'Enum';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function (value, attr) {
			var _value,
				target = getLookUp(value),
				entities = this.entities;

			for (var i=0, len=entities.length; i < len; i++) {
				var member = entities[i],
					lookupVal = getLookUp(member);

				if (target === lookupVal) {
					_value = member;
					break;
				}
			}
			if (value && typeof _value === 'undefined') {
				var err = new Error('Unknown member');
				err.arguments = [{value: value, attr: attr}];
				err.type = this;
				throw err;
			}
			return this.getClassOf(className).super_.create.call(this, _value ? _value : this.getDefault(attr), attr);
		},
		validate: function validate (value, attr) {
			var this_ = this.getClassOf(className),
				entities = this.entities;

			if (!this_.super_.validate(value, attr))
				return false;

			for (var i=0, len=entities.length; i < len; i++) {
				if (value === entities[i])
					return true;
			}

			var err = new Error('Invalid member');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},		
		has: function has (value) {
			var class_ = this;
			if (Is.attr(value)) {
				class_ = this.getClassOf(className).super_.has.call(this, value);
			} else {
				if (!Array.isArray(value))
					value = [value];
				value.forEach(function (obj) {
					class_.entities.push(obj);
				});
			}
			return class_;
		},
		valueOf: function valueOf (value, attr) {
			return value ? value.valueOf() : null;
		},
		memberOf: function memberOf (value) {
			var target = getLookUp(value),
				entities = this.entities;
			for (var i=0, len=entities.length; i < len; i++) {
				var member = entities[i],
					lookupVal = getLookUp(member);

				if (target === lookupVal)
					return member;
			}
			return null;
		},
		objProto: {
			Is: function Is (value, attr) {
				return getLookUp(value) === getLookUp(this.value);
			}
		}
	}
};

exports = module.exports = function enumeratorClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		_entities = [],
		class_ = _this.has(nature);
		
	attr && attr.attr && attr.attr.entities && (_entities = attr.attr.entities);

	class_.entities = _entities;

	if (attr)
		return class_.has(attr);

	return class_;
};
