'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	deepMixIn = util.deepMixIn,
	merge = util.merge,
	chainObjProp = util.chainObjProp,
	linkUpObjProto = util.linkUpObjProto,
	events = require('events'),
	classFactory = require('./_class.js');

var none = {val: null, str: 'null'};

function createObject (clsObj, value, attr) {	// create instance object.
	var _value,		// only validated value will be stored.
		none = clsObj.root.getDefault(attr),	// = null
		proto = clsObj.__proto__.hasOwnProperty('objProto') ? clsObj.__proto__.objProto : {},
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

	var obj = Object.create(proto, chainObjProp(clsObj, prop));

	linkUpObjProto(obj, clsObj);

	typeof attr !== 'undefined' && obj.attr(attr);
	if (typeof value === 'undefined' || value === none)
		_value = none;
	else {
		if ('value' in obj)
			obj.value = value;
		else 
			_value = value;
	}

	return obj;	
}

var objectProto = deepMixIn({
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
		// return this.isNull ? 'null' : this.getClass().stringify(this.value, this._attr);
	},
	valueOf: function valueOf () {
		return this.getClass().valueOf(this.value, this._attr);
		// return this.isNull ? this.getClass().granniest.getDefault(this.attr): this.getClass().valueOf(this.value, this._attr);
	},
	compareTo: function compareTo (b) {
		return this.getClass().compare(this.value, b);
	},
	attr: function attr (attr) {
		if (attr) {
			if (typeof this._attr === 'undefined') {
				this._attr = attr;
			} else {
				if (Object.prototype.toString.call(attr) === '[object Object]') {
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
},	events.EventEmitter.prototype);

var classProto = {
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
		return none.val;
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
			return none.str;
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
	objProto: objectProto,
	objProp: {
		defVal: {	// default value
			get: function () {
				return this.getDefault(this._attr);
			}
		}
	}
}

function entityClassFactory (clsObj, attr) {
	var _private = {
			name: 'Entity'
		},
		nature = {
			proto: (Is.obj(attr) && 'proto' in attr) ? attr.proto : (clsObj ? undefined : classProto),
			prop: {
				name: {
					get: function () {
						return _private.name;
					}
				}
			}
		};

	if (attr) {
		attr.attr && deepMixIn(_private, attr.attr);
		attr.prop && deepMixIn(nature.prop, attr.prop);
	}

	return classFactory(clsObj, nature);
}

module.exports = entityClassFactory;
