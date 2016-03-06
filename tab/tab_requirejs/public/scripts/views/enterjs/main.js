require.config({
    paths: {
        jquery: "../../libs/jquery",
        utils: "../common/utils",
        tabs: "../common/tabs"


    }
})

require(['jquery', 'utils', 'tabs'], function($, utils, tabs) {
    $(function() {
        try {
            // JS实现选项卡切换
            tabs.changeTab();
        } catch (e) {
            console.log(e);
        }



    })
})
