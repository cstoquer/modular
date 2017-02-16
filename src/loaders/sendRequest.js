var IS_ELECTRON = (function () {
	try {
		var isElectron = _REQUIRE_('electron');
		return !!isElectron;
	} catch (e) {
		return false;
	}
})();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
if (IS_ELECTRON) {
	module.exports = _REQUIRE_('electron').remote._REQUIRE_('./tools/commands');
} else {
	module.exports = function (data, cb) {
		var xobj = new XMLHttpRequest();
		xobj.open('POST', 'req', true);
		xobj.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xobj.onreadystatechange = function () {
			if (~~xobj.readyState !== 4) return;
			if (~~xobj.status !== 200) return cb && cb('xhr:' + xobj.status);
			var res = JSON.parse(xobj.response);
			return cb && cb(res.error, res.result);
		};
		xobj.send(JSON.stringify(data));
	};
}