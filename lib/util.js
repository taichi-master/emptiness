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
	return isObj(obj) && obj.hasOwnProperty('name');
}

function isType (obj) {
	return isFunc(obj) && obj.hasOwnProperty('class_');
}

function isEntity (obj) {
	return isObj(obj) && obj.hasOwnProperty('value') && !obj.hasOwnProperty('class_');
	// return isObj(obj) && obj.hasOwnProperty('value') && obj.hasOwnProperty('getClass') && !obj.hasOwnProperty('class_');
}

function isAttr (obj) {
	return isObj(obj) && obj.hasOwnProperty('attr');
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
	var class_ = this_.getClass(),
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
		str: isStr,
		undef: isUndef
	},
	dict_stringify: dict_stringify,
	list_stringify: list_stringify,
	list_valueOf: list_valueOf,
	deepMixIn: deepMixIn,
	cp: cp,
	dup: dup,
	clone: function clone (obj) {
		return Object.create(obj);
	},
	reload: reload
};
