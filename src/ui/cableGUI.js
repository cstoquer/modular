var Cable     = require('../core/Cable');
var constants = require('./constants');
var ctx       = require('./overlay').ctx;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.draw = function () {
	ctx.strokeStyle = this.color;
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.bezierCurveTo(this.a, this.b, this.c, this.d, this.w, this.h);
	ctx.stroke();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Cable.prototype.update = function () {
	this.x = this.endPointA.module.x * constants.MODULE_WIDTH  + this.endPointA.x * constants.CONNECTOR_GRID_SIZE + 8;
	this.y = this.endPointA.module.y * constants.MODULE_HEIGHT + this.endPointA.y * constants.CONNECTOR_GRID_SIZE + 8;
	this.w = this.endPointB.module.x * constants.MODULE_WIDTH  + this.endPointB.x * constants.CONNECTOR_GRID_SIZE + 8;
	this.h = this.endPointB.module.y * constants.MODULE_HEIGHT + this.endPointB.y * constants.CONNECTOR_GRID_SIZE + 8;

	var w = (this.w - this.x) / 2;
	var h = (this.h - this.y) / 2;

	this.a = ~~(this.x + w *  Math.random()      + 10 * Math.random() - 5);
	this.b = ~~(this.y + h *  Math.random()      + 10 * Math.random() - 5);
	this.c = ~~(this.x + w * (Math.random() + 1) + 10 * Math.random() - 5);
	this.d = ~~(this.y + h * (Math.random() + 1) + 10 * Math.random() - 5);
};
