var domUtils   = require('domUtils');
var createDiv  = domUtils.createDiv;
var removeDom  = domUtils.removeDom;
var makeButton = domUtils.makeButton;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var MENU_TEMPLATE = [
	// {
	// 	label: 'Pixelbox',
	// 	submenu: [
	// 		{ label: 'About', click: function () { console.log('About'); } },
	// 		//--------------------------------------------------------
	// 		{ type: 'separator' },
	// 		{ label: 'Import tools' },
	// 		{ label: 'Update', click: function () { console.log('Update'); } },
	// 		{ label: 'Quit',   click: function () { console.log('Quit'); }, accelerator: 'CmdOrCtrl+Q' }
	// 	]
	// },
	{
		label: 'Patch',
		submenu: [
			{ label: 'Settings',    click: function () { console.log('Settings'); }   },
			//--------------------------------------------------------
			{ type: 'separator' },
			{ label: 'Load Pacth', click: null    },
			{ label: 'Save Pacth', click: null    },
			// { label: 'Build executable', click: function () { console.log('Executable'); } },
			//--------------------------------------------------------
			{ type: 'separator' },
			{ label: 'Import Patch', click: null     },
			{ label: 'Export Patch', click: null  },
		]
	},
	{
		label: 'View',
		submenu: [
			// TODO: automaticaly create from toolbox
			{ label: 'Modules',       type: 'checkbox', checked: true },
			{ label: 'Buffers',       type: 'checkbox', checked: true },
			{ label: 'Controls',      type: 'checkbox', checked: true },
			{ label: 'Inspector',     type: 'checkbox', checked: true },
			//--------------------------------------------------------
			// { label: 'Cascade', click: cascadePanels },
			// { label: 'Close all' },
		]
	},
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
