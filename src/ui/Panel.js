var domUtils     = require('domUtils');
var createDiv    = domUtils.createDiv;
var makeDragable = domUtils.makeDragable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Panel
 *
 * @author Cedric Stoquer
 */
function Panel() {
	this._dom = createDiv('panel');
	var handle = createDiv('handle', this._dom);
	makeDragable(handle, this._dom);

	// TODO: close button

	// TODO: title
}

// TODO hide and show

module.exports = Panel;
