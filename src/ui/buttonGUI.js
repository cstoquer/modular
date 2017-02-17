var Button    = require('../core/Button');
var constants = require('./constants');
var domUtils  = require('./domUtils');
var createDiv = domUtils.createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Button.prototype.initGUI = function (module, id, descriptor) {
	// create dom
	var dom = this._dom = createDiv('moduleButton', module._dom);
	dom.style.left = (descriptor.x * constants.CONNECTOR_GRID_SIZE) + 'px';
	dom.style.top  = (descriptor.y * constants.CONNECTOR_GRID_SIZE) + 'px';
	if (descriptor.label) createDiv('label knobLabel', dom).innerText = descriptor.label;
	this._title = createDiv('moduleButtonTitle', dom);

	// set mouse event
	var t = this;
	dom.addEventListener('mousedown', function click(e) {
		e.stopPropagation();
		e.preventDefault();
		t.endPoint.call(t.caller);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Button.prototype.setTitle = function (text) {
	this._title.innerText = text;
};
