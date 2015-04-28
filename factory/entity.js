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
			class_: {
				value: clsObj
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
						// var oldValue = this.value;
						var oldValue = _value;
						_value = newValue;
						this.emit('change', newValue, oldValue, this);
						// this.emit('change', this.value, oldValue, this);
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
		name: 'entity'
	},
	proto: {
		create: function create (value, attr) {
			return createObject(this, value, attr);
		},
		classOf: function classOf (clsName) {
			var class_ = this;
			while (class_ && class_.name !== clsName)
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
		add: function add (a, b) {
			return a + b;
		},

		objProto: {
			__proto__: events.EventEmitter.prototype,
			getDefault: function getDefault (attr) {
				return this.class_.getDefault(Is.undef(attr) ? this._attr : attr);
			},
			getValue: function getValue (rawValue, isEntityDefault) {
				return this.class_.getValue(rawValue, this._attr, isEntityDefault);
			},
			validate: function validate (value, attr) {
				return this.class_.validate(value, Is.undef(attr) ? this._attr : attr);
			},
			parse: function parse (object, attr) {
				var obj = this.class_.parse(object, Is.undef(attr) ? this._attr : attr);
				this.value = obj.value;
				typeof obj.attr !== 'undefined' && this.attr(obj.attr);
				return this;
			},
			toString: function toString () {
				return this.class_.stringify(this.value, this._attr);
			},
			valueOf: function valueOf () {
				return this.class_.valueOf(this.value, this._attr);
			},
			compareTo: function compareTo (b) {
				return this.class_.compare(this.value, b);
			},
			add: function add (en, attr) {
				return this.class_.add(this.value, en.value);
			},
			instanceOf: function instanceOf (className) {
				return this.class_.classOf(className) !== null;
			},
			attr: function attr (attr) {
				if (Is.undef(attr)) {
					return this._attr;
				} else {
					if (Is.undef(this._attr)) {
						this._attr = attr;
					} else {
						if (Is.obj(attr)) {
							this._attr = deepMixIn(this._attr, attr);
						} else {
							return this._attr[attr];	// use parameter 'attr' as key or index.  It is okay to cause exception.
						}
					}
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
	clsObj === null && (clsObj = entityClassFactory());
	var	class_ = Object.create(clsObj ? clsObj : exports.none, {
				name: {
					value: Is.str(attr) ? attr : (Is.obj(attr) && Is.obj(attr.attr) && attr.attr.name ? attr.attr.name : (clsObj ? '(anonymous)' : entity.attr.name))
				},
				super_: {
					value: clsObj ? clsObj : null,
					// writable: true
				},
				links: {
					get: function () {
						var cls = this,
							lst = [];
						while (cls) {
							lst.push(cls.name);
							cls = cls.super_;
						}
						return lst;
					}
				}
			});

	if (class_.name === entity.attr.name) {
		Object.defineProperty(class_, 'root', {
			value: class_
		});
	}

	attr && attr.prop && Object.defineProperties(class_, attr.prop);

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
