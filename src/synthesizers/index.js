var SYNTHESIZERS = {
	'noize': require('./noize'),
	'hats':  require('./hats'),
};

exports.getSynth = function (id) {
	return SYNTHESIZERS[id];
};
