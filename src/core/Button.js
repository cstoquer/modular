var constants  = require('./constants');
var map        = require('./utils').map;
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
	var caller = endPoint;
	endPoint = caller[funcName];

	// set mouse event
	dom.addEventListener('mousedown', function click(e) {
		e.stopPropagation();
		e.preventDefault();
		endPoint.call(caller);
	});
}

module.exports = Button;
