var Module  = require('../core/Module');
var library = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function TestModule() {
	Module.call(this);
}
inherits(TestModule, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.doStuff = function (data) {
	if (data._type === 'color') {
		this._title.textContent = '#' + data.hex;
		this._dom.style.backgroundColor = '#' + data.hex;
	}
};

TestModule.prototype.onConnect = function (connector) {
	console.log('module has connected', this, connector);
};

TestModule.prototype.pushButton = function () {
	var hex = ('000' + (~~(Math.random() * 4096)).toString(16)).substr(-3);
	this.$B.emit({ _type: 'color', hex: hex });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.descriptor = {
	type: 'TestModule',
	name: 'TestModule',
	size: 5,
	inputs: {
		A: { type: 'event', x:0.2,  y:1, label: 'A', endPoint: 'doStuff' },
	},
	outputs: {
		B: { type: 'event', x:3.2,  y:1, label: 'B', onConnect: 'onConnect' }
	},
	controls: {
		a: { type: 'knob',   x: 0.1, y: 2.3, label: 'KNB' },
		b: { type: 'knob',   x: 2.1, y: 2.3, label: 'KNB' },
		c: { type: 'button', x: 4.1, y: 2.3, label: 'BTN', endPoint: 'pushButton' }
	}
};

library.register(TestModule);
module.exports = TestModule;