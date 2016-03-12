// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    // require("./tabs");
    var utils = require('utils');

    var tabTitleDom = document.getElementById('tab-title'),
        tabContentDom = document.getElementById('tab-content'),
        tabTitle = utils.getChildren(tabTitleDom),
        tabContent = utils.getChildren(tabContentDom),
        selectClass = 'select';

    // 通过 exports 对外提供接口
    exports.init = function() {

    }

    exports.removeClass = function() {
        utils.each(tabTitle, function(i, span) {
            utils.removeClass(span, selectClass);
        });
        utils.each(tabContent, function(i, section) {
            utils.removeClass(section, selectClass);
        });
    };
    exports.changeTab = function() {
        utils.each(tabTitle, function(i, span) {
            utils.addEvent(span, 'click', function(e) {
                exports.removeClass();
                e = e || event;
                var t = e.target || e.srcElement

                if (e && e.stopPropagation) {
                    //W3C取消冒泡事件
                    e.stopPropagation();
                } else {
                    //IE取消冒泡事件
                    window.event.cancelBubble = true;
                }

                utils.addClass(t, selectClass);
                utils.addClass(tabContent[i], selectClass);
            })
        });
    };

});
