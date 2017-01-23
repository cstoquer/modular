function resizeCanvas(canvas) {
	canvas.height = window.innerHeight; 
	canvas.width  = window.innerWidth;
	canvas.style.width  = canvas.width  + 'px';
	canvas.style.height = canvas.height + 'px';
}

var canvas  = document.getElementById('cableCanvas');
var overlay = document.getElementById('overlayCanvas');
var ctx     = canvas.getContext('2d');
var overCtx = overlay.getContext('2d');

resizeCanvas(canvas);
resizeCanvas(overlay);

ctx.lineCap         = 'round';
ctx.shadowColor     = '#000';
ctx.shadowBlur      = 3;
ctx.lineWidth       = 3;
ctx.shadowOffsetX   = 1; 
ctx.shadowOffsetY   = 1;

overCtx.lineWidth   = 3;
overCtx.strokeStyle = '#444';
overCtx.lineCap     = 'butt';
overCtx.setLineDash([3, 3]);

exports.ctx     = ctx;
exports.overCtx = overCtx;