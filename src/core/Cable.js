var constants = require('./constants');
var ctx = require('./overlay').ctx;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Cable
 *  Render one cable between two connectors
 *
 * @author Cedric Stoquer
 */
function Cable(a, b, c) {
	this.endPointA = a;
	this.endPointB = b;
	this.color     = c || '#555';
	this.id        = this.getId(a, b);

	this.x = 0; // start point x
	this.y = 0; // start point y
	this.a = 0; // control point 1 x
	this.b = 0; // control point 1 y
	this.c = 0; // control point 2 x
	this.d = 0; // control point 2 y
	this.w = 0; // end point x
	this.h = 0; // end point y

	this.update();

	a.module.addCable(this);
	b.module.addCable(this);
}
module.exports = Cable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.getId = function (a, b) {
	return a.module.id + ':' + a.id + '--' + b.module.id + ':' + b.id;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.draw = function () {
	var t = this;

	ctx.strokeStyle = t.color;
	ctx.beginPath();
	ctx.moveTo(t.x, t.y);
	ctx.bezierCurveTo(t.a, t.b, t.c, t.d, t.w, t.h);
	ctx.stroke();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.update = function () {
	var t = this;

	t.x = t.endPointA.module.x * constants.MODULE_WIDTH  + t.endPointA.x * constants.CONNECTOR_GRID_SIZE + 8;
	t.y = t.endPointA.module.y * constants.MODULE_HEIGHT + t.endPointA.y * constants.CONNECTOR_GRID_SIZE + 8;
	t.w = t.endPointB.module.x * constants.MODULE_WIDTH  + t.endPointB.x * constants.CONNECTOR_GRID_SIZE + 8;
	t.h = t.endPointB.module.y * constants.MODULE_HEIGHT + t.endPointB.y * constants.CONNECTOR_GRID_SIZE + 8;

	var w = (t.w - t.x) / 2;
	var h = (t.h - t.y) / 2;

	t.a = ~~(t.x + w *  Math.random()      + 10 * Math.random() - 5);
	t.b = ~~(t.y + h *  Math.random()      + 10 * Math.random() - 5);
	t.c = ~~(t.x + w * (Math.random() + 1) + 10 * Math.random() - 5);
	t.d = ~~(t.y + h * (Math.random() + 1) + 10 * Math.random() - 5);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.disconnect = function () {
	var t = this;
	if (t.endPointA) {
		// remove connections
		t.endPointA.disconnect(t.endPointB);
		t.endPointB.disconnect(t.endPointA);

		// remove cables references from modules
		t.endPointA.module.removeCable(t);
		t.endPointB.module.removeCable(t);
	}
	t.endPointA = null;
	t.endPointB = null;
};
