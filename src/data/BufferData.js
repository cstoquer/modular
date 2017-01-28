var audioContext = require('../core/audioContext');

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
// static methods

BufferData.initializeDatabase = function (database) {
	for (var id in database) {
		database[id] = new BufferData(id, database[id]);
	}
};

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

	var xobj = new XMLHttpRequest();
	xobj.responseType = 'arraybuffer';

	xobj.onreadystatechange = function onXhrStateChange() {
		if (~~xobj.readyState !== 4) return;
		if (~~xobj.status !== 200 && ~~xobj.status !== 0) {
			return cb('xhrError:' + xobj.status);
		}
		audioContext.decodeAudioData(xobj.response, function onSuccess(buffer) {
			t.buffer = buffer;
			return cb();
		}, cb);
	};

	xobj.open('GET', this.uri, true);
	xobj.send();
}

module.exports = BufferData;
