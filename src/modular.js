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

require('./modules/index.js');
require('./data/dataTypes.js');

window.MODULAR = {
	Patch: require('./core/Patch')
};
