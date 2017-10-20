(function(){
	var utils = {
		overlayInit: function () {
			var self = this,
				// wrapType, 
				OverLayMap = function (map, offset, className, dataObject, point, opts) {
					this.map = map;
					// this.wrapType = wrapType;
					this.offset = offset;
					this.className = className;
					this.dataObject = dataObject;
					this.point = point;
					this.opts = opts;
				};

			OverLayMap.prototype = new BMap.Overlay();
			OverLayMap.prototype.initialize = function () {
				var _wrap = this._wrap = document.createElement('div'),
					dataObject = this.dataObject;
				_wrap.className = this.className;
				for(var key in dataObject){
					_wrap.setAttribute('data-'+key, dataObject[key]);
				}
				// hack code
				if(this.opts && this.opts.childDiv){ 
					this.opts.childDiv.forEach(function (item, index) {
						_wrap.appendChild(item);
					});
				}
				this.map.getPanes().labelPane.appendChild(_wrap);
				return _wrap;
			};
			OverLayMap.prototype.draw = function () {
				var lng = this.point.lng,
					lat = this.point.lat,
					pixel,
					offset,
					offsetX,
					offsetY;
				if(lng && lat){
					pixel = this.map.pointToOverlayPixel(new BMap.Point(lng, lat));
					offset = this.offset;
					offsetX = Object.prototype.toString.call(offset) == '[object Number]' ? offset : offset.x;
					offsetY = Object.prototype.toString.call(offset) == '[object Number]' ? offset : offset.y;
			        this._wrap.style.left = pixel.x - offsetX + "px";
			        this._wrap.style.top = pixel.y - offsetY + "px";
				}
			};
	        OverLayMap.prototype.addEventListener = function(type, handle) {
	        	if(this._wrap){
	        		if (document.addEventListener) { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
			            this._wrap.addEventListener(type, handle, false);
			        } else if (document.attachEvent) { // IE8.0及其以下版本
			            this._wrap.attachEvent('on' + type, handle);
			        } else { // 早期浏览器
			            this._wrap['on' + type] = handle;
			        }
	        	}
	        };

	        
	        OverLayMap.prototype.tap = function (handle) {
	        	var touch;
	        	this.addEventListener('touchstart', function (e) {
	        		e.preventDefault();
	        		touch = {
						touchstartX: 0,
				        touchstartY: 0,
				        touchendX: 0,
				        touchendY: 0,
				        startTime: 0,
				        endTime: 0
					};
	                if (!touch.touchstartX && !touch.touchstartY && e.touches.length) {
	                    touch.touchstartX = e.touches[0].clientX;
	                    touch.touchstartY = e.touches[0].clientY;
	                    touch.startTime = new Date().getTime();
	                }
	        	});
	        	this.addEventListener('touchmove', function (e) {
	        		e.preventDefault();
	        	});
	        	this.addEventListener('touchend', function (e) {
	        		if (!touch.touchendX && !touch.touchendY && e.changedTouches.length) {
	                    touch.touchendX = e.changedTouches[0].clientX;
	                    touch.touchendY = e.changedTouches[0].clientY;
	                    touch.endTime = new Date().getTime();
	                }

	                // check the tap was long tap or short time tap, second condition call the callback
	                if (touch && touch.endTime) {
			            var movex = Math.abs(touch.touchendX - touch.touchstartX);
			            var movey = Math.abs(touch.touchendY - touch.touchstartY);
			            var touchTime = touch.endTime - touch.startTime;
			            if (movex < 30 && movey < 30 && touchTime < 200) {
			                setTimeout(function () {
			                	if(handle) handle.call(this, e);
			                }, 200);
			            }
			        }
	        	});
	        	this.addEventListener('click', function (e) {
	        		if(handle) handle.call(this, e);
	        	});
	        };

			return OverLayMap;
		}
	};

	module.exports = utils;
})();