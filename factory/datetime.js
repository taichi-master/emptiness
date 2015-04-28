'use strict';

var	entityFactory = require('./entity.js'),
	util = require('../lib/util.js'),
	Is = util.Is;

function toShort (dt, len) {
	return dt.toJSON().substring(0, len ? len : 19);
}

var className = 'datetime';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			return this.classOf(className).super_.create.call(this, 
				Is.undef(value) || Is.date(value) || Is.obj(value)
					? value
					: new Date(value),
			attr);
		},
		getDefault: function getDefault (attr) {
			return new Date();
		},
		validate: function validate (value, attr) {
			if (!this.classOf(className).super_.validate(value, attr))
				return false;

			if (!Array.isArray(value))
				value = [value];

			var rc = true;
			for (var i=0, len=value.length; i < len; i++) {
				if (!Is.date(value[i])) {
					rc = false;
					break;
				}
			}
			if (rc)
				return rc;

			// var err = new Error(5006, 'Date Time object expected');
			var err = new Error('Date Time object expected');
			err.arguments = [{value: value, attr: attr}];
			err.type = this;
			throw err;

			return false;
		},
		parse: function parse (str, attr) {
			return this.classOf(className).super_.parse(new Date(str), attr);
		},
		stringify: function stringify (value, attr) {
			return value.toJSON();
		},
		toShort: toShort,
		compare: function compare (a, b) {
			return a.valueOf() - b.valueOf();
		},
		add: function add (a, b) {
			if (!Array.isArray(a))
				a = [a];
			if (Array.isArray(b))
				a.concat(b);
			else
				a.push(b);
			return a;
		},

		objProto: {
			toShort: function toShort (len) {
				return this.class_.toShort(this.value, len);
			}
		},

		objProp: {
			short: {
				get: function () {
					return this.toShort();
				}
			},
			date: {
				get: function () {
					return this.toShort(4);
				}
			},
			time: {
				get: function () {
					return this.toShort().substring(11);
				}
			}
		}
	}
};

exports = module.exports = function numberClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);

	Object.defineProperties(class_, {
		now: {
			get: function () {
				return this.getDefault();
			}
		}
	});

	if (attr)
		return class_.has(attr);
	return class_;
};

Object.defineProperties(Date.prototype, {
	'short': {
		set: function () {},
		get: function () {
			return toShort(this);
		},
		configurable: true
	}
});
