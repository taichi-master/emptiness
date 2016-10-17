'use strict';

var util = require('./util.js'),
	Is = util.Is,

	proto = {
		alias: function alias (name) {
			if (name) {
				this._alias = name;
				return this;
			}
			return this._alias ? this._alias : this.class_.name;
			// return this._alias ? this._alias : this.class_.name.toLowerCase();
		},
		is: function is (clsObj) {	// has the nature of something.  // class level proto only
			if (Is.type(clsObj))
				clsObj = clsObj.class_;
			return typedef(
					this.class_.has({attr: {name: clsObj.name}, proto: clsObj})
				).alias(this.alias());
		},
		has: function has (attr) {		// note: attr could be anything
			var class_ = this.class_.has(attr);		// which will let the class to handle it.
			if (this.class_ !== class_)
				return typedef(class_);
			return this;
		},
		assume: function assume (value, attr) {	// set default value
			this.class_.getDefault = function getDefault (attr) {
				return value;
			};
			return this;
		},
		getClass: function getClass () {
			return this.class_;
		},
		objProto: function objProto (obj) {
			var class_ = this.class_;
			if (Is.func(obj))
				class_.objProto[obj.name] = obj;
			else {
				Object.keys(obj).forEach(function (key) {
					class_.objProto[key] = obj[key];
				});
			}
			return this;
		},
		objProp: function objProto (obj) {
			var class_ = this.class_;
			Object.keys(obj).forEach(function (key) {
				class_.objProp[key] = obj[key];
			});
			return this;
		}
	};

function typedef (clsObj, attr) {
	if (clsObj || Is.num(clsObj)) {		// also needs to trap 0 value
		if (Is.type(clsObj))
			return clsObj;

		if (Is.str(clsObj) && Is.undef(attr)) {
			attr = clsObj;
			clsObj = null;
		} else {
			if (!Is.clsObj(clsObj)) {
				switch(typeof clsObj) {
					case 'object':
						if (Is.date(clsObj)) {
							clsObj = exports.datetimeFactory ? exports.datetimeFactory() : require('../factory/datetime.js')();
							break;
						}
						if (Is.regex(clsObj)) {
							clsObj = exports.regexFactory ? exports.regexFactory() : require('../factory/regex.js')();
							break;
						}
						clsObj = Array.isArray(clsObj) ?
							exports.listFactory ? exports.listFactory() : require('../factory/list.js')() :
							exports.dictFactory ? exports.dictFactory() : require('../factory/dict.js')();
						break;
					case 'string':
						clsObj = exports.stringFactory ? exports.stringFactory() : require('../factory/string.js')();
						break;
					case 'number':
						clsObj = exports.numberFactory ? exports.numberFactory() : require('../factory/number.js')();
						break;
					case 'boolean':
						clsObj = exports.booleanFactory ? exports.booleanFactory() : require('../factory/bool.js')();
						break;
					default:
						clsObj = null;
						break;
				}
			}
		}
	}
	clsObj || (clsObj = exports.entityFactory ? exports.entityFactory() : require('../factory/entity.js')());

	attr && (clsObj = clsObj.has(attr));

	var enType = clsObj.create.bind(clsObj);	// <== key definition of enType

	enType.class_ = clsObj;
	enType.value = clsObj.name;
	enType.nature = {attr: {name:clsObj.name}, proto: clsObj};
	enType.__proto__ = proto;
	enType.__proto__.__proto__ = clsObj.objProto;

	enType.IsTypeOf = function IsTypeOf (className) {
		return this.class_.classOf(className) !== null;
	}

	return enType;
}

exports = module.exports = typedef;
