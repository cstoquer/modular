var constants  = require('./constants');
var domUtils   = require('domUtils');
var createDiv  = domUtils.createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Button
 *
 * @author Cedric Stoquer
 */
function Button(module, id, descriptor) {
	// create dom
	var dom = this._dom = createDiv('moduleButton', module._dom);
	dom.style.left = (descriptor.x * constants.CONNECTOR_GRID_SIZE) + 'px';
	dom.style.top  = (descriptor.y * constants.CONNECTOR_GRID_SIZE) + 'px';
	if (descriptor.label) createDiv('label knobLabel', dom).innerText = descriptor.label;
	this._title = createDiv('moduleButtonTitle', dom);

	// init references
	this.bind(module, id, descriptor);

	// set mouse event
	var t = this;
	dom.addEventListener('mousedown', function click(e) {
		e.stopPropagation();
		e.preventDefault();
		t.endPoint.call(t.caller);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Button.prototype.setTitle = function (text) {
	this._title.innerText = text;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Button.prototype.bind = function (module, id, descriptor) {
	// button action
	var endPointDescription = descriptor.endPoint;
	if (!endPointDescription) return;

	// find endPoint function
	var endPoint = module;
	endPointDescription = endPointDescription.split('.');
	var funcName = endPointDescription.pop();
	for (var i = 0; i < endPointDescription.length; i++) {
		endPoint = endPoint[endPointDescription[i]];
	}

	// bind references
	this.caller = endPoint;
	this.endPoint = this.caller[funcName];
};

module.exports = Button;
