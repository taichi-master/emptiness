'use strict';

var util = require('./util.js'),
	Is = util.Is,

	proto = {
		alias: function alias (name) {
			if (name) {
				this._alias = name;
				return this
			}
			return this._alias ? this._alias : this.class_.name.toLowerCase();
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
		}
	};

function typedef (clsObj, attr) {
	var enType = clsObj.create.bind(clsObj);
	enType.class_ = clsObj;
	enType.value = clsObj.name;
	enType.nature = {attr: {name:clsObj.name}, proto: clsObj};
	enType.__proto__ = proto;
	enType.__proto__.__proto__ = clsObj.objProto;
	return enType;
}

module.exports = typedef;
