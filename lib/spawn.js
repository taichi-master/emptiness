'use strict'

var	util = require('./util.js'),
	factoryDir = require('path').resolve(__dirname, '../factory'),
	fs = require('fs'),
	Is = util.Is,
	deepMixIn = util.deepMixIn,
	typedef = require('./typedef.js'),
	structFactory = require('../factory/struct.js'),
	entityFactory = require('../factory/entity.js');

function entityClass () {
	return exports.entityClass ? exports.entityClass : entityFactory();
}

exports = module.exports = function spawn (value, attr) {	// spawn entity creator - typedef
	var class_,
		_attr = typeof attr === 'string' ? {attr:{name:attr}} : attr,
		factory, name, enTypes, temp,
		temp2 = structFactory.__proto__;

	structFactory.__proto__ = exports;

	function setAttr () {
		_attr.attr = deepMixIn({name: '(anonymous)'}, _attr.attr);
		class_ = class_.has(_attr);
	}

	if (_attr && (Array.isArray(_attr))) {
		name = value;
		enTypes = [];
		_attr.forEach(function (obj) {
			enTypes.push(Is.str(obj) ? spawn(obj) : obj);
		});
		class_ = (exports.structClass ? exports.structClass : structFactory()).has(name).has(enTypes);
	}
	else {
		if (Is.str(value)) {
			name = '/' + value + '.js';
			factory = process.cwd() + name;
			fs.existsSync(factory) ||
			((factory = factoryDir + name) && (factory = fs.existsSync(factory) ? factory : null));
			if (factory) {

				factory = require(factory);
				
				if (Is.type(factory))
					class_ = factory;
				else  {
					temp = factory.__proto__;
					factory.__proto__ = exports;

					class_ = value + 'Class';
					class_ = class_ in exports ? exports[class_] : factory();

					factory.__proto__ = temp;
				}
				_attr && setAttr();
			}
			else {								// it is not defined, define it here.
				_attr = _attr ? _attr : {};
				_attr.attr = deepMixIn({name: value}, _attr.attr);
				class_ = (_attr.super_ ? _attr.super_ : entityClass()).has(_attr);
			}

		} else {
			class_ = Is.type(value) ? value.class_ : 
					(Is.entity(value) ? value.getClass() : 
					(Is.undef(value) ? entityClass() : value));
			_attr && setAttr();
		}
	}

	structFactory.__proto__ = temp2;

	return Is.type(class_) ? class_ : exports.typedef(class_);
}

exports.typedef = typedef;
exports.util = util;
