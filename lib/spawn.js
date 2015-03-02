'use strict'

var	util = require('./util.js'),
	Is = util.Is,
	deepMixIn = util.deepMixIn,
	typedef = require('./typedef.js'),
	factory,
	structClass,
	structFactory = require('../factory/struct.js'),
	entityFactory = require('../factory/entity.js');

function entityClass () {
	return exports.entityClass ? exports.entityClass : entityFactory();
}

exports = module.exports = function spawn (value, attr) {	// spawn entity creator - typedef
	var class_,
		_attr = typeof attr === 'string' ? {attr:{name:attr}} : attr;

	Object.keys(exports).forEach(function (key) {
		entityFactory[key] = structFactory[key] = exports[key];
	});

	if (_attr && (Array.isArray(_attr))) {
		structClass = exports.structClass ? exports.structClass : structFactory();
		class_ = structClass.create(_attr, value);
	}
	else {
		try {
			if (Is.str(value)) {
				factory = require('../factory/' + value);
				Object.keys(exports).forEach(function (key) {
					factory[key] = exports[key];
				});
				class_ = value + 'Class';
				class_ = class_ in exports ? exports[class_] : factory();
			} else {
				class_ = Is.type(value) ? value.class_ : 
						(Is.entity(value) ? value.getClass() : 
						(Is.undef(value) ? entityClass() : value));
			}
			if (_attr) {
				_attr.attr = deepMixIn({name: '(anonymous)'}, _attr.attr);
				class_ = class_.has(_attr);
			}
		} catch (err) {		// if it is not defined, define it.
			_attr = _attr ? _attr : {};
			_attr.attr = deepMixIn({name: value}, _attr.attr);
			class_ = (_attr.super_ ? _attr.super_ : entityClass()).has(_attr);
		}
	}
	return typedef(class_);
}
