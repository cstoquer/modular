var loadAudioBuffer = require('../loaders/loadAudioBuffer');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function BufferData(id, data) {
	this.id     = id;
	this.buffer = undefined;
	this.uri    = data.uri;
	this.loop   = data.loop  || false;
	this.ir     = data.ir    || false;
	this.start  = data.start || 0;
	this.end    = data.end   || 0;
	this.tag    = data.tag   || [];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// static method

BufferData.deserialize = function (data) {
	// TODO: check for this BufferData existence in the database
	return new BufferData(data.id, data);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferData.prototype.serialize = function () {
	return {
		_type: 'BufferData',
		id:    this.id,
		uri:   this.uri,
		loop:  this.loop,
		ir:    this.ir,
		start: this.start,
		end:   this.end,
		tag:   this.tag
	};
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferData.prototype.loadAudioBuffer = function (cb) {
	// check if buffer is already loaded
	if (this.buffer) return window.setTimeout(cb, 0);

	var t = this;

	loadAudioBuffer(this.uri, function onLoad(error, buffer) {
		if (error) return cb(error);
		t.buffer = buffer;
		return cb();
	});
};

module.exports = BufferData;
