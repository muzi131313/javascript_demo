(function () {
	'use strict';

	require('./scss/drawOverlay.scss');

	var circle = require('./script/drawOverlay/circle');

	var mapEle = document.createElement('div');
	mapEle.setAttribute('id', 'map');
	var mapScriptEle = document.createElement('div');
	mapScriptEle.setAttribute('id', 'mapScript');
	document.body.appendChild(mapEle);
	document.body.appendChild(mapScriptEle);

	circle.init();
})();