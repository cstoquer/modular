var Knob      = require('../core/Knob');
var constants = require('./constants');
var createDiv = require('./domUtils').createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.initGUI  = function (module, id, descriptor) {
	// create dom elements
	var dom = this._dom = createDiv('knob', module._dom);
	dom.style.left = (this.x * constants.CONNECTOR_GRID_SIZE + 2) + 'px';
	dom.style.top  = (this.y * constants.CONNECTOR_GRID_SIZE + 2) + 'px';
	this._mark     = createDiv('knob knobMark', dom);
	if (descriptor.label) createDiv('label knobLabel', dom).innerText = descriptor.label;

	this.valueDiplay = createDiv('knobValueDisplay', dom);
	this.valueDiplay.style.display = 'none';
	if (!descriptor.label) this.valueDiplay.className += ' knobValueNoLabel';

	var t = this;
	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = t.value;
		t.valueDiplay.style.display = '';


		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-68, Math.min(68, startV + startY - e.clientY));
			t._mark.style.transform = 'rotate(' + (delta * 2) + 'deg)';
			t.value = delta;
			// TODO: add an option to not updating value in real time
			t.updateValue();
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			t.valueDiplay.style.display = 'none';
			t.updateValue();
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.updateGUI = function () {
	this._mark.style.transform = 'rotate(' + (this.value * 2) + 'deg)';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.displayValue = function (value) {
	// TODO: custom display

	var size = 5;
	var multiplier = '';

	if (value === 0) {
		// keep 0;
	} else if (Math.abs(value) < 0.1) {
		value *= 1000;
		multiplier = 'm';
		size = 4;
	} else if (Math.abs(value) >= 1000) {
		value /= 1000;
		multiplier = 'K';
		size = 4;
	}

	this.valueDiplay.innerText = value.toString().substring(0, size) + multiplier;;
};