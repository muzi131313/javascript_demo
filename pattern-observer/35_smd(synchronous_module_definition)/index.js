var F = F || {};
F.define = function(str, fn){
    var parts = str.split('.');
        old = parent = this;
        i = len = 0;
    if(parts[0] === 'F'){
        parts = parts.split(1);
    }
    if(parts[0] === 'define' || parts[0] === 'module'){
        return false;
    }
    for(len = parts.length;i < len;i++){
        if(typeof parent[parts[i]] === 'undefined'){
            parent[parts[i]] = {};
        }
        old = parent;
        parent = parent[parts[i]];
    }
    if(fn){
        old[parts[--i]] = fn();
    }
    return this;
}

// usage
// in pro enviroment, this was not allowed, because the private variable was saved in closures, not bind on the F
F.define('string', function(){
    return {
        trim: function(str){
            return  str.replace(/^\s+|\s+$/g, '');
        }
    }
});

F.define('dom', function(){
    var $ = function(id){
        $.dom = document.getElementById(id);
        return $;
    }
    $.html = function(html){
        if(html){
            this.dom.innerHTML = html;
            return this;
        }else{
            return this.dom.innerHTML;
        }
    }
    return $;
});

F.define('dom.addClass', function(type, fn){
    return function(className){
        if(!~this.dom.className.indexOf(className)){
            this.dom.className += ' ' + className;
        }
    }
});

// test
F.dom('test').html();
F.dom('test').addClass('test');
