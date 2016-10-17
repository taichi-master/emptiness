'use strict';

var util = require('../lib/util.js'),
	Is = util.Is,
	typedef = require('../lib/typedef.js'),
	grpClass = require('./group.js')(),
	grp = grpClass.create.bind(grpClass),
	listFactory = require('./list.js');

var className = 'structlist';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function create (value, attr) {
			var class_ = this.classOf(className),
				self = this,
				prop = {},
				lst = [],
				enType,
				obj;
			
			if (value && Array.isArray(value)) {
				if (class_.enType === null) {
					var dictFactory = typedef.dictFactory,
						listFactory = typedef.listFactory;
					typedef.dictFactory = exports.structFactory;
					typedef.listFactory = exports.listFactory ? exports.listFactory : structlistClassFactory;

					class_.enType = typedef(value[0]);

					typedef.dictFactory = dictFactory;
					typedef.listFactory = listFactory;
				}

				enType = class_.enType;
				value.forEach(function (val) {
					lst.push(Is.entity(val) ? val : enType(val, attr));
				});
			} else
				lst = value;

			obj = class_.super_.create.call(this, lst, attr);

			// groups
			if (class_.enType) {
				if (class_.enType.class_.enTypes) {	// set summary properties for struct

			// console.log(class_.enType.class_.links);

					var grpObj;
					obj.groups = {};
					class_.enType.class_.enTypes.value.forEach(function (enType) {
			// console.log(enType.class_.links);
						var key = enType.alias();
						obj.groups[key] = grpObj = grp(obj.value, key);
						if (enType.IsTypeOf('structlist') && enType.class_.enType.IsTypeOf('struct')) {
							var struct = enType.class_.enType.class_;
							struct.enTypes.value.forEach(function (enType) {
								var k = enType.alias();
								obj.groups[key][k] = grp(grpObj.value, k);
							});
						}
						prop[key] =  {
							value: grpObj
						};
					});
				}
				else {
					prop['group'] = {
						value: grp(obj.value)
					};
				}
				Object.defineProperties(obj, prop);
			}
			return obj;
		},
		add: function add (a, b) {
			var lst = [];
			for (var i=0, len=a.length; i < len; i++) {
				lst.push(a[i].add(b[i]));
			}
			return lst;
		},		
		has: function has (value) {
			var class_ = this;
			if (Is.str(value) || Is.attr(value)) {
				class_ = this.classOf(className).super_.has.call(this, value);
			} else {
				class_.enType = typedef(value);
			}
			return class_;
		},
		// valueOf: function valueOf (value, attr) {
		// 	var sb = [],
		// 		List = this;
		// 	value.forEach(function (obj) {
		// 		// sb.push(Array.isArray(obj) ? List.valueOf(obj) :
		// 		// 							 (obj ? obj.valueOf() : obj));
		// 		console.log(List.links);
		// 	debugger;
		// 		sb.push(obj ? obj.valueOf() : obj);
		// 	});
		// 	return sb;
		// },		
		objProto: {
			push: function push (val) {
				this.value = this.value;
				this.value.push(Is.entity(val) ? val : this.class_.enType(val, this._attr));
				return this;
			}
		},
		objProp: {
			summary: { 
				get: function () {
					if (this.hasOwnProperty('group'))
						return this.group.summary;

					if (this.hasOwnProperty('groups')) {
						var self = this,
							dictClass = this.class_.enType.class_.classOf('dict'),
							summ = {};
						Object.keys(this.groups).forEach(function (key) {
							summ[key] = self.groups[key].summary;
						});
						return dictClass.create(summ);
					}
					return undefined;
				}
			}
		}
	}
};

function structlistClassFactory (clsObj, attr) {
	var temp = listFactory.__proto__;
	listFactory.__proto__ = exports;

	var _this = clsObj ? clsObj : (exports.listClass ? exports.listClass : listFactory()),
		class_ = _this.has(nature);

	listFactory.__proto__ = temp;

	// class_.enType = Is.clsObj(attr) || Is.type(attr) ? attr : null;

	// var _enType = Is.clsObj(attr) || Is.type(attr) ? typedef(attr) : null;
	var _enType = null;
	Object.defineProperty(class_, 'enType', {
		get: function () {
			return _enType;
		},
		set: function (value) {
			_enType = value;
		}
	}); 

	if (attr)
		return class_.has(attr);
	
	return class_;
};

exports = module.exports = structlistClassFactory;
exports.structFactory = undefined;
