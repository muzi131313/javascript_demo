(function () {
	'use strict';

	var utils = require('./utils'),
		postscribe = require('postscribe'),
		mapUrl = 'https://api.map.baidu.com/api?v=2.0&ak=KUuesdf9xuLFZGGPj7j0F3jBT9QYz2vx&s=1';

	function init() {
		var map = new BMap.Map("map"),
			circleOverlay = utils.overlayInit(),
			point = {
				lng: 116.301456,
				lat: 40.050388
			},
			circleOverlayInstance = (function () {
				var childDiv = [],
					child,
					childText,
					offset = { // 当offset是一个值(即覆盖物为正方形),可以设置offset = 14; 否则,x为宽度的一半,y为高度的一半
						x: 14,
						y: 14
					},
					id = 12;

				child = document.createElement('div');
				child.className = 'circle-child';
				childText = document.createTextNode('circle');
				child.appendChild(childText);
				childDiv.push(child);

				return new circleOverlay(map, offset, 'main', { 
		            id: id,
		            lng: point.lng,
		            lat: point.lat
		        }, point, {
		            childDiv: childDiv
		        });
			})(),
			tap = function () {
				alert('you taped me?');
			};
		map.centerAndZoom(point, 10);
		map.addOverlay(circleOverlayInstance);
        circleOverlayInstance.tap(tap);
	}

	module.exports = {
		init: function () {
			postscribe('#mapScript', '<script src="'+mapUrl+'"><\/script>', {
				done: function () {
					init();
				}
			});
		}
	};
})();