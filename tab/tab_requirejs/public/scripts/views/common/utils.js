define(function(){
    return utils = {
        // event related
        addEvent: function(obj,type,handle){
            try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
                obj.addEventListener(type,handle,false);
            }catch(e){
                try{  // IE8.0及其以下版本
                    obj.attachEvent('on' + type,handle);
                }catch(e){  // 早期浏览器
                    obj['on' + type] = handle;
                }
            }
        },

        // array related
        each: function(arr, callback){
            if(arr && arr.length > 0){
                var i = 0, arrSingle, isBreak;
                for (; arrSingle = arr[i++];) {
                    isBreak = callback && callback.call(this,(i-1),arrSingle);
                    if(isBreak) break;
                }
            }
        },

        // class related
        hasClass: function(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },

        addClass: function(obj, cls) {
            if (!utils.hasClass(obj, cls)) obj.className += " " + cls;
        },

        removeClass: function(obj, cls) {
            if (utils.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },

        toggleClass: function(obj,cls){
            if(utils.hasClass(obj,cls)){
                utils.removeClass(obj, cls);
            }else{
                utils.addClass(obj, cls);
            }
        },

        // dom
        getChildren: function(ele){
            if(!ele) return false;
            var eles = [];
            if(ele.children){
                eles = ele.children;
            }else if(ele.childNodes){
                utils.each(ele.childNodes, function(i, item){
                    if(item && item.nodeType == 1) eles.push(item);
                });
            }else{
                console && console.error('unknow types');
            }
            return eles;
        }
    }
});
