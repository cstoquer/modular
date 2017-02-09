
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Cable
 *  link two connectors
 *
 * @author Cedric Stoquer
 */
function Cable(a, b, color) {
	this.endPointA = a;
	this.endPointB = b;
	this.color     = color || '#555';
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
Cable.prototype.draw = function () {};
Cable.prototype.update = function () {};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.disconnect = function () {
	if (this.endPointA) {
		// remove connections
		this.endPointA.disconnect(this.endPointB);
		this.endPointB.disconnect(this.endPointA);

		// remove cables references from modules
		this.endPointA.module.removeCable(this);
		this.endPointB.module.removeCable(this);
	}
	this.endPointA = null;
	this.endPointB = null;
};
