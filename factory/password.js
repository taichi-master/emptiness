'use strict';

var	entityFactory = require('./entity.js'),
	crypto = require('crypto');

var className = 'password';

var nature = {
	attr: {
		name: className
	},
	proto: {
		create: function (value, attr) {
			var salt = this.makeSalt(),
				_value = typeof value === 'string' || typeof value === 'number' ? {
						salt: salt,
						hashedPassword: this.encryptPassword(this.policy(value), salt)
					} : 
						value,
				pw = this.classOf(className).super_.create.call(this, _value, attr);

			Object.defineProperties(pw, {
				salt: {
					get: function () {
						return _value.salt;
					}
				},
				hashedPassword: {
					get: function () {
						return _value.hashedPassword;
					}
				}
			});

			return pw;
		},
		valueOf: function valueOf (value, attr) {
			return value;
		},
		makeSalt: function () {
			return crypto.randomBytes(16).toString('base64');
		},
		encryptPassword: function (password, salt) {
			if (!password || !salt)
				return '';
			salt = new Buffer(salt, 'base64');
			return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
		},
		policy: function policy (value) {
			return value.toString();
		},

    	objProto: {
    		authenticate: function (plainText) {
				return this.class_.encryptPassword(plainText, this.salt) === this.hashedPassword;
    		},
    	}
	}
};

exports = module.exports = function passwordClassFactory (clsObj, attr) {
	var _this = clsObj ? clsObj : (exports.entityClass ? exports.entityClass : entityFactory()),
		class_ = _this.has(nature);
	if (attr)
		return class_.has(attr);
	return class_;
};
