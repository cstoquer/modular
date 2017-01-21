var Module  = require('../core/Module');
var library = require('../core/library');

var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var createDom = domUtils.createDom;
var removeDom = domUtils.removeDom;
var makeButton = domUtils.makeButton;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function TestModule(params) {
	Module.call(this, params);

	// TODO: extract button in a component
	// var t = this;
	// var btn = createDiv('moduleButton', this._dom);
	// makeButton(btn, function () {
	// 	t.pushButton();
	// });
}
inherits(TestModule, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.doStuff = function (data) {
	this._title.textContent = data;
	this._dom.style.backgroundColor = data;
};

TestModule.prototype.pushButton = function () {
	this.$b.emit('#' + (~~(Math.random() * 4096)).toString(16));
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TestModule.prototype.descriptor = {
	name: 'TestModule',
	size: 5,
	inputs: {
		a:  { type: 'event', x:0.2,  y:1, label: 'A', endPoint: 'doStuff' },
	},
	outputs: {
		b:  { type: 'event', x:3.2,  y:1, label: 'B' }
	},
	params:  {
		a: { type: 'knob',   x: 0.1, y: 2.3, label: 'KNB' },
		b: { type: 'knob',   x: 2.1, y: 2.3, label: 'KNB' },
		c: { type: 'button', x: 4.1, y: 2.3, label: 'BTN', endPoint: 'pushButton' }
	}
};

library.register(TestModule);
module.exports = TestModule;