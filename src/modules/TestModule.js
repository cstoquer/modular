var Module  = require('../core/Module');
var library = require('../core/library');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function TestModule(params) {
	Module.call(this, params);
}
inherits(TestModule, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.descriptor = {
	name: 'TestModule',
	size: 5,
	inputs: {
		a1_00:  { type: 'none', x:0.2,  y:1, label: 'A' },
		a2_00:  { type: 'none', x:3.2,  y:1, label: 'B' }
	},
	outputs: {},
	params:  {
		a: { type: 'knob', x: 0.1, y: 2.3, label: 'KNB' },
		b: { type: 'knob', x: 2.1, y: 2.3, label: 'KNB' },
		c: { type: 'knob', x: 4.1, y: 2.3, label: 'KNB' }
	}
};

library.register(TestModule);
module.exports = TestModule;