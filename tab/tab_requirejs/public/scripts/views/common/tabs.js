define(["./utils"], function(utils) {
    var tabTitleDom = document.getElementById('tab-title'),
        tabContentDom = document.getElementById('tab-content'),
        tabTitle = utils.getChildren(tabTitleDom),
        tabContent = utils.getChildren(tabContentDom),
        selectClass = 'select';
    return tabs = {
        removeClass: function(){
            utils.each(tabTitle, function(i, span){
                utils.removeClass(span, selectClass);
            });
            utils.each(tabContent, function(i, section){
                utils.removeClass(section, selectClass);
            });
        },
        changeTab: function(){
            utils.each(tabTitle, function(i, span){
                utils.addEvent(span, 'click', function(e){
                    tabs.removeClass();
                    e = e || event;
                    var t = e.target || e.srcElement

                    if(e && e.stopPropagation){
                        //W3C取消冒泡事件
                        e.stopPropagation();
                    }else{
                        //IE取消冒泡事件
                        window.event.cancelBubble = true;
                    }

                    utils.addClass(t, selectClass);
                    utils.addClass(tabContent[i], selectClass);
                })
            });
        }
    }
});
