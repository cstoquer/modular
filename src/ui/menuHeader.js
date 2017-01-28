var sendRequest = require('assetLoader').sendRequest;
var domUtils    = require('domUtils');
var createDiv   = domUtils.createDiv;
var createDom   = domUtils.createDom;
var removeDom   = domUtils.removeDom;
var makeButton  = domUtils.makeButton;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var PANELS = {
	bufferLibrary: require('./bufferLibrary'),
	moduleLibrary: require('./moduleLibrary'),
	audioEditor:   require('./audioEditor')
};

function openPanel(panel) {
	return function () {
		panel.open();
	}
}

function closeAllPanels() {
	for (var id in PANELS) {
		PANELS[id].close();
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function exportPatch() {
	var patch = window.moduleManager.getPatch();

	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patch));
	var anchor = createDom('a');
	anchor.setAttribute("href", dataStr);
	anchor.setAttribute("download", "patch.json");
	anchor.click();
	removeDom(anchor);
}

function importPatch() {
	// TODO
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var MENU_TEMPLATE = [
	{
		label: 'Patch',
		submenu: [
			{ label: 'Load Patch', click: null },
			{ label: 'Save Patch', click: null },
			//--------------------------------------------------------
			{ type: 'separator' },
			{ label: 'Import Patch', click: importPatch },
			{ label: 'Export Patch', click: exportPatch },
			//--------------------------------------------------------
			{ type: 'separator' },
			{ label: 'Clear', click: function clearPatch() { window.moduleManager.clearPatch(); } },
		]
	},
	{
		label: 'View',
		submenu: [
			{ label: 'Modules Library', type: 'checkbox', checked: true, click: openPanel(PANELS.moduleLibrary) },
			{ label: 'Buffers Library', type: 'checkbox', checked: true, click: openPanel(PANELS.bufferLibrary) },
			{ label: 'Audio Editor',    type: 'checkbox', checked: true, click: openPanel(PANELS.audioEditor) },
			// { label: 'Controls',  type: 'checkbox', checked: true },
			// { label: 'Inspector', type: 'checkbox', checked: true },
			//--------------------------------------------------------
			// { label: 'Cascade', click: cascadePanels },
			//--------------------------------------------------------
			{ type: 'separator' },
			{ label: 'Close all', click: closeAllPanels },
		]
	},
	// {
	// 	label: 'Libraries',
	// 	submenu: [
	// 		{ label: 'Generate audio libraries', click: function () { sendRequest({ command: 'audio.generateLibraries' }); } }
	// 	]
	// }
];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var menuBar = createDiv('menuHeader', null);
menuBar._currentSubmenu = null;
var closedAt = 0;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function closeCurrentSubmenu() {
	if (!menuBar._currentSubmenu) return;
	menuBar._currentSubmenu.style.display = 'none';
	menuBar._currentSubmenu = null;
	closedAt = Date.now();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function addItemInSubmenu(subItem, submenuContainer) {
	if (subItem.type === 'separator') {
		createDiv('submenuSeparator', submenuContainer);
		return;
	}
	var subItemBtn = createDiv('submenuItem', submenuContainer);
	subItemBtn.innerText = subItem.label;
	
	makeButton(subItemBtn, function onClick() {
		subItem.click && subItem.click();
		closeCurrentSubmenu();
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function addItemInMenuBar(item) {
	if (!item.label) return;
	var itemBtn = createDiv('menuItem', menuBar);
	itemBtn.innerText = item.label;

	var submenu = item.submenu;
	if (submenu) {
		var submenuContainer = createDiv('submenu', itemBtn);
		submenuContainer.style.display = 'none';
		for (var i = 0; i < submenu.length; i++) {
			addItemInSubmenu(submenu[i], submenuContainer);
		}
	}

	function openSubMenu() {
		// closing submenu
		if (menuBar._currentSubmenu === submenuContainer) {
			closeCurrentSubmenu();
			return;
		}

		closeCurrentSubmenu();
		menuBar._currentSubmenu = submenuContainer;
		submenuContainer.style.display = '';
	}

	makeButton(itemBtn, function onClick() {
		openSubMenu();
		item.click && item.click();
	});

	itemBtn.addEventListener('mouseleave', closeCurrentSubmenu);
	itemBtn.addEventListener('mouseenter', function () {
		if (Date.now() < closedAt + 300) openSubMenu();
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function createMenuFromTemplate(template) {
	for (var i = 0; i < template.length; i++) {
		var item = template[i];
		addItemInMenuBar(item);
	}
} 

createMenuFromTemplate(MENU_TEMPLATE);
