var domUtils   = require('domUtils');
var createDiv  = domUtils.createDiv;
var makeButton = domUtils.makeButton;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Connector Menu
 *
 * @author Cedric Stoquer
 */
function ConnectorMenu() {
	this.dom = createDiv('connectorMenu');
	this.selected = null;

	var t = this;
	this.dom.addEventListener('mouseleave', function menuOut() {
		t.hide();
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ConnectorMenu.prototype.hide = function () {
	this.dom.style.display = 'none';
	this.dom.innerHTML = '';
	this.selected = null;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ConnectorMenu.prototype.addEntry = function (title) {
	var dom = createDiv('connectorMenuEntry', this.dom);
	dom.innerText = title;
	dom.id = title;
	return dom;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ConnectorMenu.prototype.addDisconnectEntry = function (cable, title) {
	var dom = this.addEntry(title);
	var moduleManager = window.moduleManager; // TODO

	var t = this;
	dom.addEventListener('mousedown', function onClick() {
		moduleManager.removeCable(cable);
		t.hide();
	});

	// cable highlight
	var originalColor = cable.color;
	dom.addEventListener('mouseleave', function () {
		cable.color = originalColor;
		moduleManager.drawCables();
	});

	dom.addEventListener('mouseenter', function () {
		cable.color = '#FFF';
		moduleManager.drawCables();
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ConnectorMenu.prototype.show = function (x, y, connector, cables) {
	this.selected = connector;

	this.dom.style.left = Math.max(0, x - 10) + 'px';
	this.dom.style.top  = Math.max(0, y - 10) + 'px';
	this.dom.style.display = 'block';

	this.dom.innerHTML = '';

	// if there is only one cable, only show 'disconnect' entry
	if (cables.length === 1) {
		this.addDisconnectEntry(cables[0], 'Disconnect');
		return;
	}

	// disconnect all
	var disconnectAll = this.addEntry('Disconnect all');
	createDiv('connectorMenuSeparator', this.dom);

	var t = this;
	makeButton(disconnectAll, function () {
		t.hide();
		for (var i = 0; i < cables.length; i++) {
			// TODO: remove window reference
			window.moduleManager.removeCable(cables[i]);
		}
	});

	// all cables highlight
	var originalColors = [];
	for (var i = 0; i < cables.length; i++) originalColors.push(cables[i].color);
	disconnectAll.addEventListener('mouseleave', function () {
		for (var i = 0; i < cables.length; i++) cables[i].color = originalColors[i];
		moduleManager.drawCables();
	});

	disconnectAll.addEventListener('mouseenter', function () {
		for (var i = 0; i < cables.length; i++) cables[i].color = '#FFF';
		moduleManager.drawCables();
	});

	// button for each cable
	for (var i = 0; i < cables.length; i++) {
		var cable = cables[i];
		var endPoint = cable.endPointA === connector ? cable.endPointB : cable.endPointA;
		var title = endPoint.module.descriptor.name + ':' + endPoint.id;
		this.addDisconnectEntry(cable, title);
	}
};

module.exports = new ConnectorMenu();
