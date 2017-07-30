exports.GRID_SIZE = 16;

var COLORS = [
	{ hi: '#BBB', low: '#444' },
	{ hi: '#FB0203', low: '#400615' },
	{ hi: '#07FC0B', low: '#024415' },
	{ hi: '#00F', low: '#004' },
	{ hi: '#FF0', low: '#440' },
	{ hi: '#FF02FF', low: '#410158' },
	{ hi: '#61F5E2', low: '#275359' },
];

exports.COLORS = COLORS;

var colorLength = COLORS.length;

exports.getColor = function (color) {
	return COLORS[~~color % colorLength];
};