/**
 * 1.0.0
 * Zhangrongming
 * 2014-11-30
 */
~(function(window) {
var A = function(selector, context){
    if(typeof selector == 'function'){
        A(window).on('load', selector);
    }else{
        return new A.fn.init(selector, context);
    }
}
A.fn = A.prototype = function () {
    constructor: A,
    init: function(selector, context){
        if(typeof selector == 'object'){
            this[0] = selector;
            this.length = 1;
            return this;
        }
        this.length = 0;
        context = document.getElementById(context) || document;
        if(~selector.indexOf('#')){ // id选择器
            this[0] = document.getElementById(selector.slice(1));
            this.length = 1;
        }else if(~selector.indexOf('.')){ // 类选择器
            var doms = [],
                className = selector.slice(1);
            if(context.getElementsByClassName){
                doms = context.getElementsByClassName(className);
            }else{
                doms = context.getElementsByTagName('*');
            }
            for(var i = 0, len = doms.length;i < len;i++){
                if(doms[i].className && !!~doms[i].className.indexOf(className)){
                    this[this.length] = doms[i];
                    this.length++;
                }
            }
        }else{ // 元素名选择器
            var doms = context.getElementsByTagName(selector),
                i = 0,
                len = doms.length;
            for(;i < len;i++){
                this[i] = doms[i];
            }
            this.length = len;
        }
        this.context = context;
        this.selector = selector;
        return thsi;
    },
    // 元素长度
    length: 0,
    push: [].push,
    splice: [].splice
};
// 设置构造函数原型
A.fn.init.prototype = A.fn;
A.extend = A.fn.extend = function(){
    var i = 1,
        len = arguments.length,
        target = arguments[i],
        j;
    if(i == len){
        target = this;
        i--;
    }
    for(;i < len;i++){
        for(j in arguments[i]){
            // 浅复制
            target[j] = arguments[i][j];
        }
    }
    return target;
}
// 单体对象A扩展
});
