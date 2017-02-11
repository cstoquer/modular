var SYNTHESIZERS = {
	'noize': require('./noize'),
};

exports.getSynth = function (id) {
	return SYNTHESIZERS[id];
};
