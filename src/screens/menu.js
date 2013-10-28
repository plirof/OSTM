function ScreenDef(data) {
	this.name = data.name || '';
	this.html = data.html || '';
	this.createHtml = data.createHtml || function() {
		return this.html;
	};
}

function ScreenContainer(data) {
	this.screens = data.screens || [];
	this.classBase = data.classBase || 'screen';
	this.targetDiv = data.targetDiv || '.main-area';

	this.curScreen = '';

	this.init = function() {
		var html = '';
		for (var i = 0; i < this.screens.length; i++) {
			var scr = this.screens[i];
			html += '<div class="' + this.classBase + ' ' + scr.name + '">' +
				scr.createHtml() + '</div>';
		}
		$(this.targetDiv).html(html);
		this.postInit();

		if (this.screens.length > 0) {
			this.setScreen(this.screens[0].name);
		}
	};

	this.postInit = data.postInit || function(){};

	this.setScreen = function(name) {
		$('.' + this.classBase).hide();
		$('.' + name).show();
		this.onScreenSet(name);
		this.curScreen = name;
	};

	this.onScreenSet = data.onScreenSet || function(name){};

	this.isOpen = function(name) {
		return this.curScreen == name;
	};
}

Menu = new ScreenContainer({
	screens: [
		new ScreenDef({
			name: 'adventure'
		}),
		new ScreenDef({
			name: 'options',
			html: getButtonHtml('Save.save()', 'Save') + ' ' +
				'<span id="save-info"><br/>' +
				getButtonHtml('Save.clearSave()', 'Delete Save', 'del-save') +
				'<br/>Export hash: <input type="text" id="save-val"></input></span><br/>' +
				getButtonHtml("Save.import($('#save-import').val())", 'Import') +
				'Import hash: <input type="text" id="save-import"></input>'
		})
	],

	classBase: 'screen',
	targetDiv: '.main-area',

	postInit: function() {
		var headerHtml = '';
		for (var i = 0; i < this.screens.length; i++) {
			var name = this.screens[i].name;
			headerHtml += getButtonHtml('Menu.setScreen(\'' + name + '\')', name, name + '-button') + ' ';
		}
		$('.header-container').html(headerHtml);

		this.setScreen('adventure');

		AdventureScreen.init();

		window.setInterval(function() {
			$('#save-info').toggle(Save.saveExists());
			$('#save-val').attr('value', Save.getSaveString());
		}, 500);
	},

	setScreen: function(name) {
		$('.screen').hide();
		$('.' + name).show();
		this.curScreen = name;
	},

	isOpen: function(name) {
		return this.curScreen == name;
	}
});
