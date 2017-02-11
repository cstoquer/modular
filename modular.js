window.inherits = function (Child, Parent) {
	Child.prototype = Object.create(Parent.prototype, {
		constructor: {
			value:        Child,
			enumerable:   false,
			writable:     true,
			configurable: true
		}
	});
};

require('./src/modules/index.js');
require('./src/data/dataTypes.js');

window.MODULAR = {
	Patch: require('./src/core/Patch')
};
