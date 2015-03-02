'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	deepMixIn = util.deepMixIn,
	events = require('events');

var none = {
	name: 'None',
	super_: null,
	_value: null,
	toString: function toString () {
		return this._value ? this._value.toString() : 'null';
	},
	valueOf: function valueOf () {
		return this._value;
	},
};

function createObject (clsObj, value, attr) {	// create instance object.
	var _value,		// only validated value will be stored.
		none = clsObj.root.getDefault(attr),	// = null
		prop = {
			constructor: {
				value: clsObj,
				enumerable: false,
				writable: true,
				configurable: true
			},
			isNone: {
				get: function () {
					return _value === none;
				}
			},
			value: {
				get: function () {
					return this.getValue(_value, _value === none);
				},
				set: function (newValue) {
					if (newValue === none || this.validate(newValue, this._attr)) {
						var oldValue = this.value;
						_value = newValue;
						this.emit('change', this.value, oldValue, this);
					}
				}
			},
		};

	Object.keys(clsObj.objProp).forEach(function (key) {
		prop[key] = clsObj.objProp[key];
	});
	// Object.keys(prop).forEach(function (key) {
	// 	if (prop[key] === null) 
	// 		delete prop[key];
	// })

	var obj = Object.create(clsObj.objProto, prop);

	!Is.undef(attr) && obj.attr(attr);
	if (Is.undef(value) || value === none)
		_value = none;
	else {
		if ('value' in obj)
			obj.value = value;
		else 
			_value = value;
	}

	return obj;	
}

var entity = {
	attr: {
		name: 'Entity'
	},
	proto: {
		create: function create (value, attr) {
			return createObject(this, value, attr);
		},
		getClassOf: function getSuperOf (clsName) {
			var class_ = this;
			while (class_.name !== clsName)
				class_ = class_.super_;
			return class_;
		},
		has: function has (attr) {	// nature
			return entityClassFactory(this, attr);
		},
		getDefault: function getDefault (attr) {
			return none.valueOf();
		},
		getValue: function getValue (rawValue, attr, isNone) {
			return isNone ? this.getDefault(attr) : rawValue;
		},
		validate: function validate (value, attr) {
			if (this.super_ && this.super_.validate)
				return this.super_.validate(value, attr);
			return true;
		},
		parse: function parse (object, attr) {
			var obj = {value: object};
			typeof attr !== 'undefined' && (obj.attr = attr);
		 	return obj;
		},
		stringify: function stringify (value, attr) {
			try {
				return value.toString();
			} catch (err) {
				return none.toString();
			}
		},
		valueOf: function valueOf (value, attr) {
			return value;
		},
		compare: function compare (a, b) {
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		},

		objProto: {
			__proto__: events.EventEmitter.prototype,
			getClass: function getClass () {
				return this.constructor;
			},
			getDefault: function getDefault (attr) {
				return this.getClass().getDefault(attr);
			},
			getValue: function getValue (rawValue, isEntityDefault) {
				return this.getClass().getValue(rawValue, this._attr, isEntityDefault);
			},
			validate: function validate (value, attr) {
				return this.getClass().validate(value, attr);
			},
			parse: function parse (object, attr) {
				var obj = this.getClass().parse(object, attr);
				this.value = obj.value;
				typeof obj.attr !== 'undefined' && this.attr(obj.attr);
				return this;
			},
			toString: function toString () {
				return this.getClass().stringify(this.value, this._attr);
			},
			valueOf: function valueOf () {
				return this.getClass().valueOf(this.value, this._attr);
			},
			compareTo: function compareTo (b) {
				return this.getClass().compare(this.value, b);
			},
			attr: function attr (attr) {
				if (attr) {
					if (typeof this._attr === 'undefined') {
						this._attr = attr;
					} else {
						if (Is.obj(attr)) {
							this._attr = deepMixIn(this._attr, attr);
						} else {
							return this._attr[attr];	// use parameter 'attr' as key or index.  It is okay to cause exception.
						}
					}
				} else {
					return this._attr;
				}
				return this;
			}
		},

		objProp: {
			defVal: {	// default value
				get: function () {
					return this.getDefault(this._attr);
				}
			}
		}
	}
}

function entityClassFactory (clsObj, attr) {
	var	class_ = Object.create(clsObj ? clsObj : exports.none, {
				name: {
					value: Is.obj(attr) && Is.obj(attr.attr) && attr.attr.name ? attr.attr.name : (clsObj ? '(anonymous)' : entity.attr.name)
				},
				super_: {
					value: clsObj ? clsObj : null
				}
			});

	if (class_.name === entity.attr.name) {
		Object.defineProperty(class_, 'root', {
			value: class_
		});
	}

	attr && attr.prop && Object.defineProperty(class_, attr.prop);

	// class level link up
	var proto = (Is.obj(attr) && 'proto' in attr) ? attr.proto : (clsObj ? {} : entity.proto);
	Object.keys(proto).forEach(function (key) {
		class_[key] = proto[key];
	});
	
	// link up object level prototypes and properties
	if (clsObj) {
		class_.hasOwnProperty('objProto') || (class_.objProto = {});
		class_.objProto.__proto__ = clsObj.objProto;
		class_.hasOwnProperty('objProp') ||	(class_.objProp = {});
		Object.keys(clsObj.objProp).forEach(function (key) {
			class_.objProp.hasOwnProperty(key) || (class_.objProp[key] = clsObj.objProp[key]);
		});
	}
	
	return class_;
}

exports = module.exports = entityClassFactory;

exports.none = none;
