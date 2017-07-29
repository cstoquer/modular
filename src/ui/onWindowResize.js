var resetCanvas   = require('./overlay').reset;
var moduleManager = require('./moduleManager');

var timeout = null;

window.addEventListener('resize', function (e) {
	if (timeout !== null) {
		window.clearTimeout(timeout);
	}

	timeout = window.setTimeout(function () {
		resetCanvas();
		moduleManager.drawCables();
		timeout = null;
	}, 50);
});