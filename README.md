Emptiness
=========
### An entity level modeling library.

The key concept is to create an entity and entity is like an object in Javascript.  In fact it is an object with the `value` property.

Moreover, entity has a default value (`defVal`) and validation.  Value has to be validated before storing into the entity.  Such that behavior can be specified in the validation. 


Usage:
-----
```javascript
var spawn = require('emptiness').spawn,
	en = spawn('entity');	// i.e. enType = spawn('factory name');

var obj = en('something');	// i.e. entity = entityClass.create('something');
assert(obj.value === 'something');
```

More usage examples can be found under the `test` folder.


Pre-defined entities:
--------------------
For all other pre-defined entities, please see the `factory` folder.

	
Some other brief concepts:
-------------------------
- Factory creates class.
- Class creates entity.
- Entity is the object which has value property that stores the actual value.

Moreover, there is a helper layer called `enType` (entity type) between the class and entity.

The fundamental definition of `enType` is just
```javascript
enType = entityClass.create.bind(entityClass);
```
such that we can just type to create an entity.
```javascript
obj = enType('something');
```

However, it is better to use typedef.js to create enType.
```javascript
var typedef = require('emptiness/lib/typedef'),
	entityFactory = require('emptiness/factory/entity'),
	entityClass = entityFactory(),
	en = typedef(entityClass);
```
For more about `enType`, please see the `lib/typedef.js`.

>Nevertheless, I would suggest just use `spawn` for everything.


License:
-------
MIT &copy; 2015 Kei Sing Wong
