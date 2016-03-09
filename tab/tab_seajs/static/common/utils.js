// 所有模块都通过 define 来定义
define(function(require, exports, module) {
  // 通过 exports 对外提供接口
  exports.init = function(){

  }

  // event related
  exports.addEvent = function(obj,type,handle){
      try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
          obj.addEventListener(type,handle,false);
      }catch(e){
          try{  // IE8.0及其以下版本
              obj.attachEvent('on' + type,handle);
          }catch(e){  // 早期浏览器
              obj['on' + type] = handle;
          }
      }
  };

  // array related
  exports.each = function(arr, callback){
      if(arr && arr.length > 0){
          var i = 0, arrSingle, isBreak;
          for (; arrSingle = arr[i++];) {
              isBreak = callback && callback.call(this,(i-1),arrSingle);
              if(isBreak) break;
          }
      }
  };

  // class related
  exports.hasClass = function(obj, cls) {
      return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  exports.addClass = function(obj, cls) {
      if (!exports.hasClass(obj, cls)) obj.className += " " + cls;
  };

  exports.removeClass = function(obj, cls) {
      if (exports.hasClass(obj, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          obj.className = obj.className.replace(reg, ' ');
      }
  };

  exports.toggleClass = function(obj,cls){
      if(exports.hasClass(obj,cls)){
          exports.removeClass(obj, cls);
      }else{
          exports.addClass(obj, cls);
      }
  };

  // dom
  exports.getChildren = function(ele){
      if(!ele) return false;
      var eles = [];
      if(ele.children){
          eles = ele.children;
      }else if(ele.childNodes){
          exports.each(ele.childNodes, function(i, item){
              if(item && item.nodeType == 1) eles.push(item);
          });
      }else{
          console && console.error('unknow types');
      }
      return eles;
  }

});
