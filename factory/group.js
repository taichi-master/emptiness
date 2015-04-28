'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	listFactory = require('./list.js');

function getList (value, key) {
	if (key) {
		var lst = [];
		value.forEach(function (val) {
			var val = val.value[key];
			if (val) {
				if (Array.isArray(val.value)) {
					for (var i=0, len=val.value.length; i < len; i++) {
						lst.push(val.value[i]);
					}
				} else
					lst.push(val);
			}
			// } else 
			// 	console.log(key + ': ' + val);
		});
		return lst;
	} else
		return value;
}

function summarize (lst) {
	var sum;
	for (var i=0, len=lst.length; i < len; i++) {
		if (lst[i]) {
			if (sum)
				sum.value = sum.add(lst[i]);
			else
				sum = lst[i].class_.create(lst[i].value, lst[i].attr());
		}
	}
	return sum;
}

var className = 'group';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			var	_summary = undefined,
				lst = getList(value, attr);

			this.objProto.summarize = function summarize () {
				_summary = summarize(this.value);
				return _summary;
			};

			this.objProp = {
				data: {
					value: lst
				},
				key: {
					value: attr
				},
				summary: {
					get: function () {
						return Is.undef(_summary) ? summarize(this.value) : _summary;
					},
					set: function (value) {
						return _summary = value;
					}
				}
			}

			return this.classOf(className).super_.create.call(this, lst, attr);
		},
		objProto: {
			push: function push (obj) {	// no push
				return this;
			}
		}
	}
};

exports = module.exports = function groupClassFactory (clsObj, attr) {
	var temp = listFactory.__proto__;
	listFactory.__proto__ = exports;

	var _this = clsObj ? clsObj : (exports.listClass ? exports.listClass : listFactory()),
		class_ = _this.has(nature);

	listFactory.__proto__ = temp;

	if (attr)
		return class_.has(attr);
	
	return class_;
};
