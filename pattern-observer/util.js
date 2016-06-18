'use strict';
// 全局捕获错误处理
window.onerror = function(msg, url, l) {
    var c = ['There was an error on this page.\n\n',
        'Error: ' + msg + '\n',
        'URL: ' + url + '\n',
        'Line: ' + l + '\n\n',
        'Click OK to continue.\n\n'
    ].join('');
    if (u.IsPhone) alert(c);
    else u.log(c);
};

/**
 * TODO:load the zepto.js
 */

window.programJsUrl = {};
window.programCssUrl = {};

var u = function() {
    $.extend({
        includePath: '',
        include: function(file) {
            var files = typeof file == "string" ? [file] : file;
            for (var i = 0; i < files.length; i++) {
                var name = files[i].replace(/^\s|\s$/g, "");
                var att = name.split('.');
                var ext = att[att.length - 1].toLowerCase();
                var isCSS = ext == "css";
                var tag = isCSS ? "link" : "script";
                var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
                var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
                if ($(tag + "[" + link + "]").length == 0)
                    document.write("<" + tag + attr + link + "></" + tag + ">");
            }
        },
        strlen: function(str) {
            var Charset = $.browser.msie ? document.charset : document.characterSet
            if (Charset.toLowerCase() == 'utf-8') {
                return str.replace(/[\u4e00-\u9fa5]/g, "***").length;
            } else {
                return str.replace(/[^\x00-\xff]/g, "**").length;
            }
        },
        httpData: function(xhr, type, s) {
            var ct = xhr.getResponseHeader("content-type") || "",
                xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;
            if (xml && data.documentElement.nodeName === "parsererror") {
                jQuery.error("parsererror");
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === "string") {
                if (type === "json" || !type && ct.indexOf("json") >= 0) {
                    data = jQuery.parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    jQuery.globalEval(data);
                }
            }
            return data;
        },
        handleError: function(s, xhr, status, e) {
            if (s.error) {
                s.error.call(s.context || s, xhr, status, e);
            }
            if (s.global) {
                (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
            }
        }
    });
    return u = {
        slice: Array.prototype.slice,
        isPhone: (window.navigator.platform != "Win32"),
        isIPhone: (window.navigator.userAgent.indexOf('iPhone') >= 0) ? true : false,
        isAndroid: (window.navigator.userAgent.indexOf('Android') >= 0) ? true : false,
        bodyHeight: document.body.clientWidth, // http://www.webkaka.com/tutorial/js/2015/091615/
        bodyWidth: document.body.clientHeight,
        htmlId: function() {
            var href = window.location.href;
            return href.substring(href.lastIndexOf("/") + 1).replace(".html", "");
        }(),
        type: function() {
            var args = arguments;
            if (args.length == 1 && args[0]) {
                return Object.prototype.toString.call(args[0]).replace('[object ', '').replace(']', '').toLowerCase();
            }
            return undefined;
        },
        error: function(obj, msg) {
            if (!obj) {
                if (Error) throw new Error(msg);
                else if (console && console.error) console.error(msg);
                else if (window.console && window.console.error) window.console.error(msg);
                else alert(msg);
            }
        },
        info: function(info) {
            if (console) console.info(info);
            else if (window.console) window.console.info(info);
            else alert(u.stringify(info));
        },
        each: function(array, callback) {
            u.error(array, 'array is null');
            var i = 0,
                single,
                isBreak;
            while (single = array[i++]) {
                isBreak = callback && callback.call(null, i, single);
                if (isBreak) break;
            }
        },
        // http://www.jq-school.com/Show.aspx?id=353
        // http://www.bootcdn.cn/json2/
        // http://www.cnblogs.com/anychem/archive/2012/04/02/2429793.html
        stringify: function(json) {
            if (JSON && JSON.stringify) {
                return JSON.stringify(json);
            } else {
                var t = typeof(obj);
                if (t != "object" || obj === null) {
                    // simple data type
                    if (t == "string") obj = '"' + obj + '"';
                    return String(obj);
                } else {
                    // recurse array or object
                    var n, v, json = [],
                        arr = (obj && obj.constructor == Array);

                    // fix.
                    // strict mode, this is not allowed here
                    var self = arguments.callee;

                    for (n in obj) {
                        v = obj[n];
                        t = typeof(v);
                        if (obj.hasOwnProperty(n)) {
                            if (t == "string") v = '"' + v + '"';
                            else if (t == "object" && v !== null)
                            // v = jQuery.stringify(v);
                                v = self(v);
                            json.push((arr ? "" : '"' + n + '":') + String(v));
                        }
                    }
                    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                }
            }
        },
        parse: funtion(jsonString){
            if (window.JSON) {
                return window.JSON.parse(s);
            } else {
                //使用到了jquery的parseJSON(s)方法
                // return $.parseJSON(jsonString);
                return eval('('+jsonString+')');
            }
        },
        log: function() {
            var args = slice.call(arguments),
                cstr = '',
                full = 100,
                fcount = 0;
            u.each(args, function(i, arg) {
                switch (u.type(arg)) {
                    case 'object':
                        cstr += stringify(arg);
                        fcount += cstr.length;
                        break;
                    case 'array':
                        cstr += arg.join(' ');
                        fcount += cstr.length;
                        break;
                    default:
                        cstr += arg + '\t';
                        fcount += cstr.length;
                }
                if (cstr > full) {
                    cstr += '\n';
                    fcount = 0;
                }
            });
            u.info(cstr);
        },
        exec: function(arr) {
            u.error(arr, 'exec arr is null');
            u.each(arr, function(i, c) {
                try {
                    c && c();
                } catch (e) {
                    u.log(e)
                }
            });
        },
        loadJS: function(url, callback, charset) {
            var script = document.createElement('script');
            script.onload = script.onreadystatechange = function() {
                if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState))
                    return;
                script.onload = script.onreadystatechange = null;
                script.src = '';
                script.parentNode.removeChild(script);
                script = null;
                if (callback)
                    callback();
            };
            script.charset = charset || document.charset || document.characterSet;
            script.src = url;
            try {
                document.getElementsByTagName("head")[0].appendChild(script);
            } catch (e) {}
        },
        /**
         * 加载资源文件
         * @param src filename 文件名
         * @author ZhaoZuoWu
         */
        loadJs: function(param){
            var options = {
                jsUrl: '',
                isCreateElem: false //是否创建dom元素到底部
            };
            options = $.extend(param);
            //缓存的思想，只加载一个js文件
            if (window.programJsUrl[options['jsUrl']]) {
                return false;
            }
            if (options['isCreateElem'] == false) {
                $.ajax({
                    url: options['jsUrl'],
                    async: false
                });
                window.programJsUrl[options['jsUrl']] = true;
                return false;
            }
            fileref = document.createElement('script'); //创建标签
            fileref.setAttribute("type", "text/javascript"); //定义属性type的值为text/javascript
            fileref.setAttribute("data-cfasync", true);
            fileref.setAttribute("src", options['jsUrl']); //文件的地址 =
            document.getElementsByTagName("body")[0].appendChild(fileref);
            window.programJsUrl[options['jsUrl']] = true;
        },
        /*
         * 动态加载css文件
         * @param object param
         * @author ZhaoZuoWu 2014-09-23
         */
        loadCss: function(param) {
            var options = {
                cssUrl: '',
                isCreateElem: false //是否创建dom元素到底部
            };
            options = $.extend(param);
            //缓存的思想，只加载一个js文件
            if (window.programCssUrl[options['cssUrl']]) {
                return false;
            }
            if (options['isCreateElem'] == false) {
                $.ajax({
                    url: options['cssUrl'],
                    async: true
                });
                window.programCssUrl[options['cssUrl']] = true;
                return false;
            }
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", options['cssUrl']);
            document.getElementsByTagName("head")[0].appendChild(fileref);
            window.programCssUrl[options['cssUrl']] = true;

        }
    }
}();
