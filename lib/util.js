'use strict';

function isPureObj(value) {
	return (!!value && typeof value === 'object' &&
		value.constructor === Object);
}

function isObj (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

function isFunc (obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
}

function isDate (obj) {
	return Object.prototype.toString.call(obj) === '[object Date]';
}

function isRegEx (obj) {
	return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function isClsObj (obj) {
	return isObj(obj) && obj.hasOwnProperty('name') && ('root' in obj) && obj.root.name === 'entity';
}

function isType (obj) {
	return isFunc(obj) && obj.hasOwnProperty('class_');
}

function isEntity (obj) {
	return isObj(obj) && obj.hasOwnProperty('value');
	// return isObj(obj) && obj.hasOwnProperty('value') && !obj.hasOwnProperty('class_');
	// return isObj(obj) && obj.hasOwnProperty('value') && obj.hasOwnProperty('getClass') && !obj.hasOwnProperty('class_');
}

function isAttr (obj) {
	return isObj(obj) && obj.hasOwnProperty('attr');
}

function isBool (obj) {
	return typeof obj === 'boolean';
}

function isNum (obj) {
	return typeof obj === 'number';
}

function isStr (obj) {
	return typeof obj === 'string';
}

function isUndef (obj) {
	return typeof obj === 'undefined';
}

function deepMixIn(target, objects) {
	var i = 0,
		n = arguments.length,
		obj;
	while(++i < n){
		obj = arguments[i];
		if (obj) {
			Object.keys(obj).forEach(function (key) {
				var val = obj[key],
					existing = target[key];
				if (isPureObj(existing) && isPureObj(val)) {
					deepMixIn(existing, val);
				} else {
					target[key] = val;
				}
			});
		}
	}
	return target;
}

function skipValidate (value, attr) {
	// console.log('skipping validation');
	return true;
}

function cp (obj) {
	var copy = obj;
	if (obj && typeof obj === 'object') {
		if ('value' in obj)
			return 'clone' in obj ? obj.clone() : dup(obj);

		copy = Array.isArray(obj) ? [] :
				isDate(obj) ? new Date(obj.valueOf()) :
				isRegEx(obj) ? new RegExp(obj.valueOf()) :
				{};
		Object.keys(obj).forEach(function (k) {
			copy[k] = cp(obj[k]);
		});
	}
	return copy;
}

function dup (this_) {
	var class_ = this_.class_,
		obj,
		proto = Object.getPrototypeOf(class_),
		func = proto.hasOwnProperty('validate') ? proto.validate : false;

	proto.validate = skipValidate;

	obj = class_.create(cp(this_.value), cp(this_._attr));

	delete proto.validate;
	if (func)
		proto.validate = func;

	return obj;
}

function clone (en) {
	var _value, _attr,
			none = en.class_.root.getDefault(en.attr()),	// = null
	    obj = {
				attr: function attr (attr) {
					if (isUndef(attr)) {
						return this._attr;
					} else {
						if (!this.hasOwnProperty('_attr')) {
							this._attr = attr;
							if (this.__proto__._attr)
								this._attr.__proto__ = this.__proto__._attr;
						} else {
							if (isObj(attr)) {
								this._attr = deepMixIn(this._attr, attr);
							} else {
								return this._attr[attr];	// use parameter 'attr' as key or index.  It is okay to cause exception.
							}
						}
					}
					return this;
				}
			};
	obj.__proto__ = en;
	Object.defineProperties(obj, {
		value: {
			get: function () {
				return this.getValue(isUndef(_value) ? this.__proto__.value : _value, _value === none);
			},
			set: function (newValue) {
				if (newValue === none || this.validate(newValue, this._attr)) {
					var oldValue = _value;
					_value = newValue;
					this.emit('change', newValue, oldValue, this);
				}
			}
		}
	});
	return obj;
}

function stringify (obj) {
	if (obj === null)
		return 'null';
	return Array.isArray(obj) ? list_stringify(obj) :
		(isObj(obj) && !isEntity(obj) ? dict_stringify(obj) : (isStr(obj) ? '"' + obj + '"' : obj.toString()));
}

function dict_stringify (object, attr) {
	var sb = [];
	Object.keys(object).forEach(function (key) {
		var obj = object[key];
		sb.push('"'+ key + '":' + stringify(obj));
	});
	return '{' + sb.join(',') + '}';
}

function list_stringify (list, attr) {
	var sb = [];
	list.forEach(function (obj) {
		sb.push(stringify(obj));
	});
	return '[' + sb.join(',') + ']';
}

function list_valueOf (list, attr) {
	var sb = [],
		List = this;
	list.forEach(function (obj) {
		sb.push(Array.isArray(obj) ? List.valueOf(obj) :
									 (obj ? obj.valueOf() : obj));
	});
	return sb;
}

function reload (mod) {
	try {
		delete require.cache[require.resolve(mod)];
	} finally {
		return require(mod);
	}
}

module.exports = {
	Is: {
		pure: isPureObj,
		obj: isObj,
		func: isFunc,
		date: isDate,
		regex: isRegEx,
		clsObj: isClsObj,
		type: isType,
		entity: isEntity,
		attr: isAttr,
		num: isNum,
		bool: isBool,
		str: isStr,
		undef: isUndef
	},
	dict_stringify: dict_stringify,
	list_stringify: list_stringify,
	list_valueOf: list_valueOf,
	deepMixIn: deepMixIn,
	cp: cp,
	dup: dup,
	clone,
	// clone: function clone (obj) {
	// 	return Object.create(obj);
	// },
	reload: reload
};
