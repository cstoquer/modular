var domUtils     = require('domUtils');
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var makeDragable = domUtils.makeDragable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Panel
 *
 * @author Cedric Stoquer
 */
function Panel() {
	this._dom = createDiv('panel');

	var t = this;

	// handle header for drag & move
	var handle = createDiv('handle', this._dom);
	makeDragable(handle, this._dom);

	// title
	this.title = createDiv('panelTitle', handle);

	// close button
	var closeButton = createDiv('panelCloseButton', handle);
	makeButton(closeButton, function onPress() {
		t.close();
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Panel.prototype.close = function () {
	// TODO update checkbox in menu header
	this._dom.style.display = 'none';
};


module.exports = Panel;
