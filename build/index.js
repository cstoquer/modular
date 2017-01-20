!function t(e,n,o){function i(s,a){if(!n[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return i(n?n:t)},l,l.exports,t,e,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t,e,n){function o(){this._events={}}e.exports=o,o.listenerCount=function(t,e){var n=t._events[e];return n?n.length:0},o.prototype.on=function(t,e){if("function"!=typeof e)throw new TypeError("Tried to register non-function as event handler for event: "+t);this.emit("newListener",t,e);var n=this._events,o=n[t];return void 0===o?n[t]=[e]:o.push(e),this},o.prototype.addListener=o.prototype.on,o.prototype.once=function(t,e){return e.once?e.once+=1:e.once=1,this.on(t,e)},o.prototype.setMaxListeners=function(){console.warn("Method setMaxListeners not supported, there is no limit to the number of listeners")},o.prototype.removeListener=function(t,e){var n=this._events[t];if(void 0!==n){var o=n.indexOf(e);o!==-1&&(n.splice(o,1),0===n.length&&delete this._events[t],this.emit("removeListener",t,e))}return this},o.prototype.removeAllListeners=function(t){return t?delete this._events[t]:this._events={},this},o.prototype.hasListeners=function(t){return void 0!==this._events[t]},o.prototype.listeners=function(t){var e=this._events[t];return void 0!==e?e.slice():[]},o.prototype.emit=function(t){var e=this._events[t];if(void 0===e)return!1;e=e.slice();for(var n=!1,o=[],i=1;i<arguments.length;i++)o.push(arguments[i]);for(var i=0,r=e.length;i<r;i++){var s=e[i];s.apply(this,o),n=!0,s.once&&(s.once>1?s.once--:delete s.once,this.removeListener(t,s))}return n}},{}],2:[function(t,e,n){function o(t,e,n,o,i,r,s,a){this.x=~~t,this.y=~~e,this.tile=~~n,this.flipH=!!o,this.flipV=!!i,this.flipR=!!r,this.flagA=!!s,this.flagB=!!a}function i(t,e){this._name="",this.width=0,this.height=0,this.items=[],this.texture=new r(t*s,e*a),this._tilesheetPath="",t&&e&&this._init(t,e)}var r=t("../Texture"),s=settings.tileSize[0],a=settings.tileSize[1];o.prototype.draw=function(t){t.sprite(this.tile,this.x*s,this.y*a,this.flipH,this.flipV,this.flipR)},e.exports=i,i.prototype._isMap=!0;var u={},c=[];i.getMap=function(t){return"string"==typeof t?u[t]:"number"==typeof t?c[t]:(console.error("Map does not exist",t),null)},i._checkBankFormat=function(t){return t?Array.isArray(t)?{_type:"maps",maps:t}:"maps"!==t._type?(console.error("Map bank format incorrect"),{_type:"maps",maps:[]}):t:(console.error("No map bank"),{_type:"maps",maps:[]})},i.loadBank=function(t){t=i._checkBankFormat(t);for(var e=[],n=t.maps||[],o=0;o<n.length;o++)e.push((new i).load(n[o]))},Object.defineProperty(i.prototype,"name",{get:function(){return this._name},set:function(t){this._name&&u[this._name]&&u[this._name]===this&&delete u[this._name],this._name=t,t&&!u[t]&&(u[t]=this)}}),i.prototype._init=function(t,e){this.texture.resize(t*s,e*a),this.width=t,this.height=e,this.items=[];for(var n=0;n<t;n++){this.items.push([]);for(var o=0;o<e;o++)this.items[n][o]=null}},i.prototype.resize=function(t,e){var n=this.items,o=Math.min(this.width,t),i=Math.min(this.height,e);this.texture.resize(t*s,e*a),this._init(t,e);for(var r=0;r<o;r++)for(var u=0;u<i;u++)this.items[r][u]=n[r][u];return this.redraw(),this},i.prototype.set=function(t,e,n,i,r,u,c,l){if(null===n||void 0===n)return this.remove(t,e);if(!(t<0||e<0||t>=this.width||e>=this.height)){var h=this.items[t][e]=new o(t,e,n,i,r,u,c,l);return this.texture.ctx.clearRect(t*s,e*a,s,a),h.draw(this.texture),this}},i.prototype.remove=function(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.items[t][e]=null,this.texture.ctx.clearRect(t*s,e*a,s,a),this},i.prototype.get=function(t,e){return t<0||e<0||t>=this.width||e>=this.height?null:this.items[t][e]},i.prototype.redraw=function(){this.texture.clear();for(var t=0;t<this.width;t++)for(var e=0;e<this.height;e++)this.items[t][e]&&this.items[t][e].draw(this.texture);return this},i.prototype.draw=function(t,e){draw(this.texture,t,e)},i.prototype.setTilesheet=function(t){return this._tilesheetPath=t&&t.path||"",this.texture.setTilesheet(t),this.redraw(),this},i.prototype._setTilesheetPath=function(t){if(this._tilesheetPath=t||"",!t)return this.setTilesheet();t=t.split("/"),fileId=t.pop();for(var e=assets,n=0;n<t.length;n++)if(e=e[t[n]],!e)return console.warn("Could not find tilesheet",t);var o=e[fileId];o&&o instanceof Image&&this.setTilesheet(o)};var l,h;!function(){function t(t){var n=~~(t/i),o=t%i;return e[n]+e[o]}for(var e="#$%&'()*+,-~/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}. !",n={},o=0;o<e.length;o++)n[e[o]]=o;var i=e.length,r=i*i-1,s=Math.pow(2,13),a=r-s-1;l=function(e){str="",count=0;for(var n=0;n<e.length;n++){var o=e[n];o===e[n+1]&&++count<a||(null===o&&(o=r),str+=t(o),count===a&&count--,0!==count&&(str+=t(s+count)),count=0)}return count===a&&count--,0!==count&&(str+=t(s+count)),str},h=function(t){arr=[];for(var e=0;e<t.length;){var o=t[e++],a=t[e++],u=n[o]*i+n[a];if(u===r)arr.push(null);else if(u>s)for(var c=u-s,l=arr[arr.length-1],h=0;h<c;h++)arr.push(l);else arr.push(u)}return arr}}(),i.prototype.save=function(){for(var t=this.width,e=this.height,n=new Array(t*e),o=0;o<t;o++)for(var i=0;i<e;i++){var r=this.items[o][i];n[o+i*t]=r?r.tile+(r.flipH<<8)+(r.flipV<<9)+(r.flipR<<10)+(r.flagA<<11)+(r.flagB<<12):null}var s={w:t,h:e,name:this.name,sheet:this._tilesheetPath||"",data:l(n)};return s},i.prototype.load=function(t){var e=t.w,n=t.h;this._init(e,n),this.name=t.name||"",this._setTilesheetPath(t.sheet);for(var o=h(t.data),i=0;i<e;i++)for(var r=0;r<n;r++){var s=o[i+r*e];if(null!==s){var a=255&s,u=s>>8&1,c=s>>9&1,l=s>>10&1,d=s>>11&1,p=s>>12&1;this.set(i,r,a,u,c,l,d,p)}}return this.redraw(),this},i.prototype.copy=function(t,e,n,o){t=t||0,e=e||0,void 0!==n&&null!==n||(n=this.width),void 0!==o&&null!==o||(o=this.height);var r=new i(n,o);return r.paste(this,-t,-e),r},i.prototype.paste=function(t,e,n,o){e=e||0,n=n||0;for(var i=Math.min(t.width,this.width-e),r=Math.min(t.height,this.height-n),s=Math.max(0,-e),a=Math.max(0,-n),u=s;u<i;u++)for(var c=a;c<r;c++){var l=t.items[u][c];if(l)this.set(u+e,c+n,l.tile,l.flipH,l.flipV,l.flipR,l.flagA,l.flagB);else{if(o)continue;this.remove(u+e,c+n)}}return this.redraw(),this},i.prototype.clear=function(){for(var t=0;t<this.width;t++)for(var e=0;e<this.height;e++)this.items[t][e]=null;return this.texture.clear(),this},i.prototype.find=function(t,e,n){if(null===t)return this._findNull();void 0===e&&(e=null),void 0===n&&(n=null);for(var o=[],i=0;i<this.width;i++)for(var r=0;r<this.height;r++){var s=this.items[i][r];if(s){var a=null===e||s.flagA===e,u=null===n||s.flagB===n;s.tile===t&&a&&u&&o.push(s)}}return o},i.prototype._findNull=function(){for(var t=[],e=0;e<this.width;e++)for(var n=0;n<this.height;n++)null===this.items[e][n]&&t.push({x:e,y:n});return t}},{"../Texture":3}],3:[function(t,e,n){function o(t,e){var n=document.createElement("canvas");return n.width=t,n.height=e,n}function i(t,e){this.canvas=o(t,e),this.ctx=this.canvas.getContext("2d"),this._cursor={i:0,j:0},this._paper=0,this._pen=1,this._textColumn=~~(t/4),this._textLine=~~(e/6),this._textOffset=1,this._textPadding=e-6*this._textLine-this._textOffset,this.camera={x:0,y:0},this.ctx.fillStyle=this.palette[0],this.ctx.strokeStyle=this.palette[1]}function r(t,e){for(var n=[219,438,511,14016,14043,14326,14335,28032,28123,28086,28159,32704,32731,32758,32767,128,146,384,402,9344,9362,9600,9618,192,210,448,466,9408,9426,9664,9682,32767,0,8338,45,11962,5588,21157,29354,10,17556,5265,21973,1488,5312,448,13824,5268,31599,29843,29671,31143,18925,31183,31689,18735,31727,18927,1040,5136,17492,3640,5393,8359,25450,23530,31467,25166,15211,29391,4815,27470,23533,29847,15142,23277,29257,23421,23403,11114,4843,26474,23279,14798,9367,27501,12141,24429,23213,14829,29351,25750,17553,13459,9402,28672,34,23530,31467,25166,15211,29391,4815,27470,23533,29847,15142,23277,29257,23421,23403,11114,4843,26474,23279,14798,9367,27501,12141,24429,23213,14829,29351,25686,9362,13587,42,21845],o=0;o<e.length;o++){t.fillStyle=e[o];for(var i=0;i<n.length;i++)for(var r=n[i],s=0;s<15;s++){var a=s%3,u=~~(s/3),c=r>>s&1;1===c&&t.fillRect(3*i+a,5*o+u,1,1)}}t.fillStyle=e[0]}var s=settings.tileSize[0],a=settings.tileSize[1],u=16,c=Math.PI/2;e.exports=i,i.prototype._isTexture=!0,i.prototype.palette=["#000000","#FFFFFF"],i.prototype.tilesheet=new i(s*u,a*u),i.prototype.textCharset=new i(384,5*i.prototype.palette.length),i.prototype.resize=function(t,e){return this.canvas.width=t,this.canvas.height=e,this._textColumn=~~(t/4),this._textLine=~~(e/6),this._textOffset=1,this._cursor.i=0,this._cursor.j=0,this.clear(),this},i.prototype.setPalette=function(t){i.prototype.palette=t,i.prototype.textCharset=new i(384,5*t.length),r(i.prototype.textCharset.ctx,t)},i.prototype.setGlobalTilesheet=function(t){i.prototype.tilesheet.clear().draw(t,0,0)},i.prototype.setTilesheet=function(t){return t?(this.tilesheet===i.prototype.tilesheet&&(this.tilesheet=new i(s*u,a*u)),this.tilesheet.clear().draw(t,0,0),this):void delete this.tilesheet},i.prototype.setCamera=function(t,e){return this.camera.x=t||0,this.camera.y=e||0,this},i.prototype.sprite=function(t,e,n,o,i,r){var l=t%u,h=~~(t/u),d=this.ctx;return e=e||0,n=n||0,e=~~Math.round(e-this.camera.x),n=~~Math.round(n-this.camera.y),o||i||r?(d.save(),o&&(d.scale(-1,1),e*=-1,e-=s),i&&(d.scale(1,-1),n*=-1,n-=a),r?(d.translate(e+a,n),d.rotate(c)):d.translate(e,n),d.drawImage(this.tilesheet.canvas,l*s,h*a,s,a,0,0,s,a),d.restore(),this):(d.drawImage(this.tilesheet.canvas,l*s,h*a,s,a,e,n,s,a),this)},i.prototype.draw=function(t,e,n,o,i,r){t._isMap&&(t=t.texture.canvas),t._isTexture&&(t=t.canvas);var s=~~Math.round((e||0)-this.camera.x),a=~~Math.round((n||0)-this.camera.y);if(!o&&!i&&!r)return this.ctx.drawImage(t,s,a),this;var u=this.ctx;return u.save(),o&&(u.scale(-1,1),s*=-1,s-=t.width),i&&(u.scale(1,-1),a*=-1,a-=t.height),r?(u.translate(s+t.height,a),u.rotate(c)):u.translate(s,a),u.drawImage(t,0,0),u.restore(),this},i.prototype.clear=function(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this},i.prototype.cls=function(){return this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.locate(0,0),this},i.prototype.pen=function(t){return this._pen=t%this.palette.length,this.ctx.strokeStyle=this.palette[this._pen],this},i.prototype.paper=function(t){return this._paper=t%this.palette.length,this.ctx.fillStyle=this.palette[this._paper],this},i.prototype.rect=function(t,e,n,o){return this.ctx.strokeRect(~~(t-this.camera.x)+.5,~~(e-this.camera.y)+.5,~~(n-1),~~(o-1)),this},i.prototype.rectfill=function(t,e,n,o){return this.ctx.fillRect(~~(t-this.camera.x),~~(e-this.camera.y),~~n,~~o),this},i.prototype.locate=function(t,e){return this._cursor.i=~~t,this._cursor.j=~~e,this},i.prototype.print=function(t,e,n){if("object"==typeof t)try{t=JSON.stringify(t)}catch(e){t="[Object]"}else"string"!=typeof t&&(t=t.toString());if(void 0!==e){e=~~Math.round(e-this.camera.x),n=~~Math.round(n-this.camera.y);for(var o=0;o<t.length;o++)this.ctx.drawImage(this.textCharset.canvas,3*t.charCodeAt(o),5*this._pen,3,5,e,n,3,5),e+=4;return this}for(var o=0;o<t.length;o++){this._cursor.j>=this._textLine&&this.textScroll();var i=t.charCodeAt(o);10!==i&&13!==i?(this.ctx.drawImage(this.textCharset.canvas,3*i,5*this._pen,3,5,4*this._cursor.i,6*this._cursor.j+this._textOffset,3,5),this._cursor.i+=1,this._cursor.i>this._textColumn&&(this._cursor.i=0,this._cursor.j+=1)):(this._cursor.i=0,this._cursor.j+=1)}return this},i.prototype.println=function(t){return this.print(t),this.print("\n"),this},i.prototype.textScroll=function(t){return void 0===t&&(t=1),this._cursor.j-=t,t*=6,this.ctx.drawImage(this.canvas,0,-t),this.ctx.fillRect(0,this.canvas.height-t-this._textPadding,this.canvas.width,t+this._textPadding),this}},{}],4:[function(t,e,n){function o(t,e){var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4===~~n.readyState)return 200!==~~n.status?e("xhr:"+n.status):e&&e(null,JSON.parse(n.response))},n.open("GET",t,!0),n.send()}function i(t,e){var n=new XMLHttpRequest;n.open("POST","req",!0),n.setRequestHeader("Content-Type","application/json; charset=UTF-8"),n.onreadystatechange=function(){if(4===~~n.readyState){if(200!==~~n.status)return e&&e("xhr:"+n.status);var t=JSON.parse(n.response);return e&&e(t.error,t.result)}},n.send(JSON.stringify(t))}function r(t,e){var n=new Image;n.onload=function(){this.onload=null,this.onerror=null,e&&e(null,this)},n.onerror=function(){this.onload=null,this.onerror=null,e&&e("img:"+t)},n.src=t}function s(t,e){function n(){e&&e(null,i),i.removeEventListener("canplaythrough",n),i.removeEventListener("error",o)}function o(){e&&e("snd:load"),i.removeEventListener("canplaythrough",n),i.removeEventListener("error",o)}var i=new Audio;i.preload=!0,i.loop=!1,i.addEventListener("canplaythrough",n),i.addEventListener("error",o),i.src=t,i.load()}function a(t,e){o("build/data.json",function(n,o){function i(t,e){var n=t.split("/"),o=n.pop(),i=o.split(".");i.pop(),i=i.join(".");for(var r=u,s=0,a=n.length;s<a;s++)r=r[n[s]];r[i]=e,n.push(i),e.name=i,e.path=n.join("/")}function a(){var n=d+p,f=n/l;e&&e(d,n,l,f);var v,m;n<c?(v=o.img[n],m=r):(v=o.snd[n-c],m=s),p+=1,m(h+v,function(e,n){e||i(v,n),d+=1,p-=1,d+p<l?a():0===p&&t(null,u)})}if(n)return t(n);var u=o.dat,c=o.img.length,l=c+o.snd.length,h=o.root,d=0,p=0;if(0===l)return t(null,u);for(var f=Math.min(5,l-1),v=0;v<=f;v++)a()})}n.loadJson=o,n.sendRequest=i,n.loadImage=r,n.loadSound=s,n.preloadStaticAssets=a},{}],5:[function(t,e,n){function o(t,e){function n(e){e.preventDefault(),t.style.left=e.clientX-r+"px",t.style.top=e.clientY-s+"px"}function o(t){t.preventDefault(),i.removeEventListener("mouseup",o),i.removeEventListener("mousemove",n)}var i=document;rect=t.getBoundingClientRect();var r=e.clientX-rect.left,s=e.clientY-rect.top;i.addEventListener("mousemove",n,!1),i.addEventListener("mouseup",o,!1)}var i=document.getElementsByTagName("body")[0];n.createDom=function(t,e,n){n=n||i;var o=document.createElement(t);return n.appendChild(o),e&&(o.className=e),o},n.createDiv=function(t,e){return n.createDom("div",t,e)},n.removeDom=function(t,e){e=e||i,e.removeChild(t)},n.makeButton=function(t,e){return t.addEventListener("mousedown",function(n){n.stopPropagation(),n.preventDefault(),e(n,t)}),t},n.makeDragable=function(t,e){return e=e||t,t.addEventListener("mousedown",function(t){t.stopPropagation(),t.preventDefault(),o(e,t)}),t}},{}],6:[function(t,e,n){e.exports={screen:{width:64,height:10,pixelSize:[2,2],fullscreen:!1},tileSize:[8,8],palette:["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0.1)"],controls:{up:38,down:40,left:37,right:39,A:32,B:88},touchEvent:{multiTouch:!1,disableContextMenu:!1,hideMousePointer:!1},loaderColors:[0,1],components:{TINA:!1,AudioManager:!1}}},{}],7:[function(t,e,n){function o(t,e,n){this.endPointA=t,this.endPointB=e,this.color=n||s.COLOR.A,this.id=this.getId(t,e),this.x=0,this.y=0,this.a=0,this.b=0,this.c=0,this.d=0,this.w=0,this.h=0,this.update(),t.module.addCable(this),e.module.addCable(this)}var i=t("./constants"),r=t("./overlay").ctx,s=t("./root");e.exports=o,o.prototype.getId=function(t,e){return t.module.id+":"+t.id+"--"+e.module.id+":"+e.id},o.prototype.draw=function(){var t=this;r.strokeStyle=t.color,r.beginPath(),r.moveTo(t.x,t.y),r.bezierCurveTo(t.a,t.b,t.c,t.d,t.w,t.h),r.stroke()},o.prototype.update=function(){var t=this;t.x=t.endPointA.module.x*i.MODULE_WIDTH+t.endPointA.x*i.CONNECTOR_GRID_SIZE+8,t.y=t.endPointA.module.y*i.MODULE_HEIGHT+t.endPointA.y*i.CONNECTOR_GRID_SIZE+8,t.w=t.endPointB.module.x*i.MODULE_WIDTH+t.endPointB.x*i.CONNECTOR_GRID_SIZE+8,t.h=t.endPointB.module.y*i.MODULE_HEIGHT+t.endPointB.y*i.CONNECTOR_GRID_SIZE+8;var e=(t.w-t.x)/2,n=(t.h-t.y)/2;t.a=~~(t.x+e*Math.random()+10*Math.random()-5),t.b=~~(t.y+n*Math.random()+10*Math.random()-5),t.c=~~(t.x+e*(Math.random()+1)+10*Math.random()-5),t.d=~~(t.y+n*(Math.random()+1)+10*Math.random()-5)},o.prototype.disconnect=function(){var t=this;t.endPointA&&(t.endPointA.disconnect(t.endPointB),t.endPointB.disconnect(t.endPointA),t.endPointA.module.removeCable(t),t.endPointB.module.removeCable(t)),t.endPointA=null,t.endPointB=null}},{"./constants":13,"./overlay":16,"./root":17}],8:[function(t,e,n){function o(t,e,n){var o=this;this.x=n.x,this.y=n.y,this.module=t,this.id=e;var r=this._dom=u("connector "+this.connectorClassName,t._dom);n.label&&(u("label connectorLabel",r).innerText=n.label),void 0===this.x?r.style.position="relative":(r.style.left=this.x*a.CONNECTOR_GRID_SIZE+1+"px",r.style.top=this.y*a.CONNECTOR_GRID_SIZE+1+"px"),r.connector=this,r.addEventListener("mousedown",function(t){t.stopPropagation(),t.preventDefault(),i.startConnection(o,t)})}var i=t("./moduleManager"),r=t("./connectors"),s=t("./root"),a=t("./constants"),u=t("domUtils").createDiv;e.exports=o,o.prototype.connectorClassName="connectorNone",o.prototype.color=s.COLOR.NONE,r.register(o,"input","none"),o.prototype.connect=function(t){i.addCable(this,t,this.color)},o.prototype.disconnect=function(t){},o.prototype.isCompatible=function(t){return t!==this}},{"./connectors":12,"./constants":13,"./moduleManager":15,"./root":17,domUtils:5}],9:[function(t,e,n){function o(t,e,n){var o=this;this.x=n.x,this.y=n.y,this.module=t,this.id=e,this.value=0,this.min=n.min||0,this.max=void 0!==n.max?n.max:1,this.int=n.int||!1,this.valueId=n.value||"value",this.endPoint=t;var r=n.endPoint;if(r){r=r.split(".");for(var a=0;a<r.length;a++)this.endPoint=this.endPoint[r[a]]}var u=this._dom=s("knob",t._dom);u.style.left=this.x*i.CONNECTOR_GRID_SIZE+2+"px",u.style.top=this.y*i.CONNECTOR_GRID_SIZE+2+"px",this._mark=s("knob knobMark",u),n.label&&(s("label knobLabel",u).innerText=n.label),u.connector=this,this.setValue(),u.addEventListener("mousedown",function(t){function e(t){t.preventDefault();var e=Math.max(-68,Math.min(68,r+i-t.clientY));o._mark.style.transform="rotate("+2*e+"deg)",o.value=e,o.updateValue()}function n(t){t.preventDefault(),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",n),o.updateValue()}t.stopPropagation(),t.preventDefault();var i=t.clientY,r=o.value;document.addEventListener("mousemove",e,!1),document.addEventListener("mouseup",n,!1)})}var i=t("./constants"),r=t("./utils").map,s=t("domUtils").createDiv;o.prototype.getState=function(){return this.value},o.prototype.setValue=function(){var t=this.endPoint[this.valueId];void 0===t&&(t=0),this.value=r(t,this.min,this.max,-68,68),this._mark.style.transform="rotate("+2*this.value+"deg)"},o.prototype.updateValue=function(){var t=r(this.value,-68,68,this.min,this.max);this.int&&(t=~~Math.round(t)),this.endPoint[this.valueId]=t},e.exports=o},{"./constants":13,"./utils":18,domUtils:5}],10:[function(t,e,n){function o(t){t=t||{},this.id=null,this.cables={};var e=c("module x"+this.descriptor.size,null);this._title=l("span","",e),this._title.textContent=this.descriptor.name,this._dom=e;for(var n in this.descriptor.inputs){var o=this.descriptor.inputs[n],i=r.getConnector("input",o.type);i&&(this["$"+n]=new i(this,n,o))}for(var n in this.descriptor.outputs){var u=this.descriptor.outputs[n],i=r.getConnector("output",u.type);i&&(this["$"+n]=new i(this,n,u))}for(var n in this.descriptor.params){var h=this.descriptor.params[n];switch(h.type){case"knob":this["$$"+n]=new a(this,n,h)}}e.module=this;var d=this;e.addEventListener("mousedown",function(t){s.startDrag(d,t)})}var i=t("./constants"),r=t("./connectors"),s=t("./moduleManager"),a=t("./Knob"),u=t("domUtils"),c=u.createDiv,l=u.createDom,h=u.removeDom;o.prototype.descriptor={name:"Abstract Module",size:1,inputs:{},outputs:{},params:{}},o.prototype.setPosition=function(t,e){var n=this._dom.style;this.x=t,this.y=e,n.left=i.MODULE_WIDTH*t+"px",n.top=i.MODULE_HEIGHT*e+"px";for(id in this.cables)this.cables[id].update()},o.prototype.remove=function(){for(var t in this.cables)s.removeCable(this.cables[t]);h(this._dom,null)},o.prototype.addCable=function(t){this.cables[t.id]=t},o.prototype.removeCable=function(t){delete this.cables[t.id]},o.prototype.getState=function(){var t={_mod:this.constructor.name,id:this.id,x:this.x,y:this.y};for(var e in this.descriptor.params){var n="$$"+e;t[n]=this[n].getState()}return t},o.prototype.select=function(){this._title.className="selected"},o.prototype.deselect=function(){this._title.className=""},e.exports=o},{"./Knob":9,"./connectors":12,"./constants":13,"./moduleManager":15,domUtils:5}],11:[function(t,e,n){var o=window.AudioContext||window.webkitAudioContext,i=new o;e.exports=i},{}],12:[function(t,e,n){connectors={input:{},output:{}},n.register=function(t,e,n){connectors[e]&&(connectors[e][n]=t)},n.getConnector=function(t,e){if(connectors[t])return connectors[t][e]},t("./Connector")},{"./Connector":8}],13:[function(t,e,n){n.MODULE_WIDTH=92,n.MODULE_HEIGHT=16,n.CONNECTOR_GRID_SIZE=15,function(){var t=document.createElement("style");t.type="text/css";for(var e=n.MODULE_WIDTH-3,o=1;o<10;o++){var i=n.MODULE_HEIGHT*o-3,r=document.createTextNode(".x"+o+" { width: "+e+"px; height: "+i+"px; }");t.appendChild(r),document.getElementsByTagName("head")[0].appendChild(t)}}()},{}],14:[function(t,e,n){function o(){this.dom=document.getElementById("library"),this.modules=s("libraryList",this.dom)}var i=t("./moduleManager"),r=t("domUtils"),s=r.createDiv;r.createDom;o.prototype.register=function(t){var e=s("moduleEntry",this.modules);e.textContent=t.prototype.descriptor.name,e.addEventListener("mousedown",function(e){i.add(new t)})},e.exports=new o},{"./moduleManager":15,domUtils:5}],15:[function(t,e,n){function o(){this._idCount=0,this.modules={},this.cables={},this.grid=[[]],this.selectedModules=[],this.registerKeyEvents()}var i=t("./overlay").ctx,r=t("./overlay").overCtx,s=t("./constants"),a=t("./Cable"),u=(t("./root"),t("domUtils")),c=u.createDiv,l=(u.createDom,u.removeDom),h="url(../img/jack-connect.png) 3 3, auto",d="url(../img/jack-free.png) 2 3, auto";o.prototype.registerKeyEvents=function(){function t(t){switch(t.keyCode){case 8:case 46:e.deleteSelectedModules()}}var e=this;document.addEventListener("keydown",t,!1)},o.prototype.add=function(t,e,n){for(var o=this._idCount++;this.modules[this._idCount];)this._idCount++;return t.id=o,this.modules[o]=t,this._addModuleInGrid(t,e,n),t},o.prototype._addModuleInGrid=function(t,e,n){e=e||0,n=n||0,this.grid[e]||(this.grid[e]=[]);for(var o=this.grid[e],i=(t.descriptor.size,0),r=n;i<o.length;i++){var s=o[i];if(s.y<n&&s.y+s.descriptor.size>=n){r=s.y+s.descriptor.size,i++;break}if(s.y>=n)break}t.setPosition(e,r),o.splice(i,0,t),r+=t.descriptor.size;for(var a=i+1;a<o.length;a++){var s=o[a];if(s.y>=r)break;s.setPosition(s.x,r),r+=s.descriptor.size}},o.prototype.remove=function(t){function e(e){var n=e.indexOf(t);return n===-1?console.error("Module not found."):void e.splice(n,1)}delete this.modules[t.id],t.id<this._idCount&&(this._idCount=t.id),e(this.grid[t.x]),t.remove(),this.drawCables()},o.prototype.deleteSelectedModules=function(){for(var t=this.selectedModules,e=0;e<t.length;e++)this.remove(t[e]);this.selectedModules=[]},o.prototype.move=function(t,e,n){var o=this.grid[t.x],i=o.indexOf(t);return i===-1?console.error("Module not found in grid."):(o.splice(i,1),void this._addModuleInGrid(t,e,n))},o.prototype.startDrag=function(t,e){function n(t){var e=t.x*s.MODULE_WIDTH,n=t.y*s.MODULE_HEIGHT,o=c("dummy",null);return o.style.width=s.MODULE_WIDTH-10+"px",o.style.height=t.descriptor.size*s.MODULE_HEIGHT-10+"px",o.style.left=e+"px",o.style.top=n+"px",o}function o(e){e.preventDefault();var o=e.clientX,i=e.clientY;Math.abs(o-d)<4&&Math.abs(o-d)<4||(v||(v=n(t)),v.style.left=o-d+"px",v.style.top=i-p+"px")}function i(e){if(e.preventDefault(),a.removeEventListener("mouseup",i),a.removeEventListener("mousemove",o),v){l(v,null);var n=Math.max(0,~~Math.round((e.clientX-d)/s.MODULE_WIDTH)),u=Math.max(0,~~Math.round((e.clientY-p)/s.MODULE_HEIGHT));n===t.x&&u===t.y||(r.move(t,n,u),r.drawCables())}}var r=this,a=document,u=t.x*s.MODULE_WIDTH,h=t.y*s.MODULE_HEIGHT,d=e.clientX-u,p=e.clientY-h;if(r.selectedModules.indexOf(t)===-1){for(var f=0;f<r.selectedModules.length;f++)r.selectedModules[f].deselect();r.selectedModules=[t],t.select()}var v=null;a.addEventListener("mousemove",o,!1),a.addEventListener("mouseup",i,!1)},o.prototype.startConnection=function(t,e){function n(e){var n=e.clientX,o=e.clientY;if(e.preventDefault(),!(!drag&&Math.abs(n-c)<4&&Math.abs(o-l)<4)){drag=!0,r.clearRect(0,0,r.canvas.width,r.canvas.height),r.beginPath(),r.moveTo(p,f),r.lineTo(n,o),r.stroke();var i=u.elementFromPoint(n,o),s=i&&i.connector;s&&s.isCompatible&&s.isCompatible(t)?document.body.style.cursor=h:document.body.style.cursor=d}}function o(e){if(e.preventDefault(),u.removeEventListener("mouseup",o),u.removeEventListener("mousemove",n),document.body.style.cursor="",r.clearRect(0,0,r.canvas.width,r.canvas.height),!drag)return void window.connectorMenu.show(e,t);var s=u.elementFromPoint(e.clientX,e.clientY),c=s.connector;if(c&&c!==t){var l=a.prototype.getId(c,t),h=a.prototype.getId(t,c);i.cables[l]||i.cables[h]||t.connect(c)}}var i=this,u=document,c=e.clientX,l=e.clientY,p=t.module.x*s.MODULE_WIDTH+t.x*s.CONNECTOR_GRID_SIZE+8,f=t.module.y*s.MODULE_HEIGHT+t.y*s.CONNECTOR_GRID_SIZE+8;drag=!1,u.addEventListener("mousemove",n,!1),u.addEventListener("mouseup",o,!1)},o.prototype.addCable=function(t,e,n){var o=new a(t,e,n);this.cables[o.id]=o,this.drawCables()},o.prototype.removeCable=function(t){this.cables[t.id]&&(t.disconnect(),delete this.cables[t.id])},o.prototype.drawCables=function(){var t=this.cables;i.clearRect(0,0,i.canvas.width,i.canvas.height);for(var e in t)t[e].draw()},o.prototype.shakeCables=function(){var t=this.cables;i.clearRect(0,0,i.canvas.width,i.canvas.height);for(var e in t)t[e].update(),t[e].draw()},o.prototype.getPatch=function(){var t={modules:[],cables:[]};for(var e in this.modules)t.modules.push(this.modules[e].getState());return t};var p=new o;e.exports=p,window.moduleManager=p},{"./Cable":7,"./constants":13,"./overlay":16,"./root":17,domUtils:5}],16:[function(t,e,n){function o(t){t.height=window.innerHeight,t.width=window.innerWidth,t.style.width=t.width+"px",t.style.height=t.height+"px"}var i=document.getElementById("cableCanvas"),r=document.getElementById("overlayCanvas"),s=i.getContext("2d"),a=r.getContext("2d");o(i),o(r),s.lineCap="round",s.shadowColor="#000",s.shadowBlur=3,s.lineWidth=3,s.shadowOffsetX=1,s.shadowOffsetY=1,a.lineWidth=1,a.strokeStyle="#444",a.lineCap="butt",a.setLineDash([2,2]),n.ctx=s,n.overCtx=a},{}],17:[function(t,e,n){var o={COLOR:{NONE:"#2da8ff",AUDIO:"#fd870e",KONTROL:"#4257E7",EVENT:"#E0D133"}};e.exports=o},{}],18:[function(t,e,n){n.map=function(t,e,n,o,i){return o+(i-o)*(t-e)/(n-e)}},{}],19:[function(t,e,n){function o(t,e,n){a.call(this,t,e,n);var o=n.endPoint.split(".");this.endPoint=t;for(var i=0;i<o.length;i++)this.endPoint=this.endPoint[o[i]]}function i(t,e,n){a.call(this,t,e,n);var o=n.endPoint.split(".");this.endPoint=t;for(var i=0;i<o.length;i++)this.endPoint=this.endPoint[o[i]]}var r=t("domUtils"),s=(t("./core/audioContext"),t("./core/connectors")),a=t("./core/Connector");t("./core/root");r.removeDom($screen.canvas,document.body);var u="#fd870e";inherits(o,a),o.prototype.connectorClassName="audioIn",o.prototype.color=u,s.register(o,"input","audio"),o.prototype.connect=function(t){a.prototype.connect.call(this,t),t.endPoint.connect(this.endPoint)},o.prototype.disconnect=function(t){try{t.endPoint.disconnect(this.endPoint)}catch(t){}},inherits(i,a),i.prototype.connectorClassName="audioOut",i.prototype.color=u,s.register(i,"output","audio"),i.prototype.connect=function(t){a.prototype.connect.call(this,t),this.endPoint.connect(t.endPoint)},i.prototype.disconnect=function(t){try{this.endPoint.disconnect(t.endPoint)}catch(t){}},t("./modules/TestModule"),t("./modules/Oscillator"),t("./modules/LFO"),t("./modules/Gain"),t("./modules/Panner"),t("./modules/ModPanner"),t("./modules/Context")},{"./core/Connector":8,"./core/audioContext":11,"./core/connectors":12,"./core/root":17,"./modules/Context":20,"./modules/Gain":21,"./modules/LFO":22,"./modules/ModPanner":23,"./modules/Oscillator":24,"./modules/Panner":25,"./modules/TestModule":26,domUtils:5}],20:[function(t,e,n){function o(t){this.node=i,s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"Context",size:1,inputs:{destination:{type:"audio",x:3,y:0,endPoint:"node.destination",label:"DEST"}},outputs:{},params:{}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],21:[function(t,e,n){function o(t){this.node=i.createGain(),s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"Gain",size:3,inputs:{source:{type:"audio",x:3.5,y:.2,endPoint:"node",label:"IN"}},outputs:{destination:{type:"audio",x:3.5,y:2,endPoint:"node",label:"OUT"}},params:{gain:{type:"knob",x:1.5,y:.5,min:0,max:100,endPoint:"node.gain",value:"value",label:"GAIN"}}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],22:[function(t,e,n){function o(t){this.node=i.createOscillator(),this.node.frequency.value=2,this.node.start(),s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"LFO",size:3,inputs:{detune:{type:"audio",x:0,y:1,endPoint:"node.detune",label:"DTN"}},outputs:{destination:{type:"audio",x:0,y:2,endPoint:"node",label:"OUT"}},params:{frequency:{type:"knob",x:3.7,y:.3,min:.01,max:20,endPoint:"node.frequency",value:"value",label:"FREQ"}}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],23:[function(t,e,n){function o(t){this.node=i.createStereoPanner(),s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"ModPan",size:2,inputs:{source:{type:"audio",x:3.5,y:0,endPoint:"node",label:"IN"},pan:{type:"audio",x:0,y:1,endPoint:"node.pan",label:"PAN"}},outputs:{destination:{type:"audio",x:3.5,y:1,endPoint:"node",label:"OUT"}},params:{}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],24:[function(t,e,n){function o(t){this.node=i.createOscillator(),this.node.frequency.value=220,this.node.start(),s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"Oscillator",size:3,inputs:{detune:{type:"audio",x:0,y:1,endPoint:"node.detune",label:"DTN"}},outputs:{destination:{type:"audio",x:0,y:2,endPoint:"node",label:"OUT"}},params:{frequency:{type:"knob",x:3.7,y:.3,min:110,max:880,endPoint:"node.frequency",value:"value",label:"FREQ"}}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],25:[function(t,e,n){function o(t){this.node=i.createStereoPanner(),s.call(this,t)}var i=t("../core/audioContext"),r=t("../core/library"),s=t("../core/Module");inherits(o,s),o.prototype.descriptor={name:"Pan",size:2,inputs:{source:{type:"audio",x:3.5,y:0,endPoint:"node",label:"IN"}},outputs:{destination:{type:"audio",x:3.5,y:1,endPoint:"node",label:"OUT"}},params:{pan:{type:"knob",x:1.5,y:0,min:-1,max:1,endPoint:"node.pan",value:"value"}}},r.register(o),e.exports=o},{"../core/Module":10,"../core/audioContext":11,"../core/library":14}],26:[function(t,e,n){function o(t){i.call(this,t)}var i=t("../core/Module"),r=t("../core/library");inherits(o,i),o.prototype.descriptor={name:"TestModule",size:5,inputs:{a1_00:{type:"none",x:.2,y:1,label:"A"},a2_00:{type:"none",x:3.2,y:1,label:"B"}},outputs:{},params:{a:{type:"knob",x:.1,y:2.3,label:"KNB"},b:{type:"knob",x:2.1,y:2.3,label:"KNB"},c:{type:"knob",x:4.1,y:2.3,label:"KNB"}}},
r.register(o),e.exports=o},{"../core/Module":10,"../core/library":14}],27:[function(t,e,n){function o(){}function i(){for(var t=0;t<w;t++)m[x[t]]=!1,y[x[t]]=!1}function r(t,e){var n=f[t];n&&(e&&!v[n]&&(m[n]=!0),!e&&v[n]&&(y[n]=!0),v[n]=e)}function s(t,e,n){var o=new h(t,e),i=o.canvas;document.body.appendChild(i);var r=i.style;return r.width=t*n[0]+"px",r.height=e*n[1]+"px",o}function a(e,n){function o(){r.update(),i(),b(o)}if(paper(0).pen(1).cls(),e)return print(e),console.error(e);window.assets=n,n.tilesheet&&tilesheet(n.tilesheet),d.loadBank(n.maps);var r=t("../src/main.js");r.update&&(i(),o())}function u(t,e,n,o){rectfill(C-M,E-2,~~(o*M*2),4)}var c=t("../settings.json");window.settings=c;var l=t("assetLoader"),h=t("Texture"),d=t("Map"),p=t("EventEmitter");window.EventEmitter=p,window.inherits=function(t,e){t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})};window.sfx=o,window.music=o,window.audioManager={addChannel:o,loadSound:o,playLoopSound:o,playSound:o,playSoundGroup:o,release:o,setMute:o,setVolume:o,setup:o,stopAllLoopSounds:o,stopLoopSound:o,settings:{}};var f={},v=window.btn={},m=window.btnp={},y=window.btnr={},x=[],w=0;!function(){var t=c.controls||{up:38,down:40,left:37,right:39,A:32,B:88};for(var e in t){var n=t[e];f[n]=e,v[e]=!1,m[e]=!1,y[e]=!1,x.push(e)}w=x.length}(),window.addEventListener("keydown",function(t){t.preventDefault(),r(t.keyCode,!0)}),window.addEventListener("keyup",function(t){t.preventDefault(),r(t.keyCode,!1)}),window.texture=function(t){var e=new h(t.width,t.height);return e.ctx.drawImage(t,0,0),e},window.tilesheet=function(t){return h.prototype.setGlobalTilesheet(t)};var g=window.$screen=s(c.screen.width,c.screen.height,c.screen.pixelSize);g.setPalette(c.palette),window.cls=function(){return g.cls()},window.sprite=function(t,e,n,o,i,r){return g.sprite(t,e,n,o,i,r)},window.draw=function(t,e,n,o,i,r){return g.draw(t,e,n,o,i,r)},window.rect=function(t,e,n,o){return g.rect(t,e,n,o)},window.rectfill=function(t,e,n,o){return g.rectfill(t,e,n,o)},window.camera=function(t,e){return g.setCamera(t,e)},window.pen=function(t){return g.pen(t)},window.paper=function(t){return g.paper(t)},window.locate=function(t,e){return g.locate(t,e)},window.print=function(t,e,n){return g.print(t,e,n)},window.println=function(t){return g.println(t)},window.getMap=d.getMap,window.chr$=function(t){return String.fromCharCode(t)},window.clip=function(t,e,n){return Math.max(e,Math.min(n,t))},window.random=function(t){return~~Math.round(t*Math.random())};var _=1/60,b=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,_)},C=~~(c.screen.width/2),M=~~(c.screen.width/4),E=~~(c.screen.height/2),P=c.loaderColors||[0,1];Array.isArray(P)||(P=[0,1]);var O=~~P[0],L=~~P[1];paper(O).cls().paper(L).pen(L),rect(C-M-2,E-4,2*M+4,8),l.preloadStaticAssets(a,u)},{"../settings.json":6,"../src/main.js":19,EventEmitter:1,Map:2,Texture:3,assetLoader:4}]},{},[27]);