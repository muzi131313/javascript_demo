var Waiter = function(){
    var dfd = [],
        doneArr = [],
        failArr = [],
        that = this,
        debug = true,
        _exec = function(arr){
            var i = 0, c;
            arr = arr || [];
            while(c = arr[i++]){
                try{
                    c && c();
                }catch(e){ debug && console && console.info(e) }
            }
        };

    var Promise = function(){
        this.resolved = false;
        this.rejected = false;
    }

    Promise.prototype = {
        resolve: function(){
            this.resolved = true;
            if(!dfd.length){
                return;
            }
            for(var i = dfd.length - 1;i >= 0;i--){
                if(dfd[i] && !dfd[i].resolved || dfd[i].rejected){
                    return;
                }
                // 方法向/从数组中添加/删除项目，然后返回被删除的项目。
                // splice() 方法与 slice() 方法的作用是不同的，splice() 方法会直接对数组进行修改
                dfd.splice(i, 1);
            }
            _exec(doneArr);
        },
        reject: function(){
            this.rejected = true;
            if(!dfd.length){
                return;
            }
            // 清除所有监控对象
            dfd.splice(0);
            _exec(failArr);
        }
    }

    that.Deferred = function(){
        return new Promise();
    }

    that.when = function(){
        dfd = slice.call(arguments);
        var i = dfd.length;
        for(--i; i >= 0;i--){
            if(!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Promise){
                dfd.splice(i, 1);
            }
        }
        // console.log('dfd: ', dfd);
        return that;
    }

    that.done = function(){
        doneArr = doneArr.concat(slice.call(arguments));
        // console.log('doneArr: ', doneArr);
        return that;
    }

    that.fail = function(){
        failArr = failArr.concat(slice.call(arguments));
        // console.log('failArr: ', failArr);
        return that;
    }
}

// TODO: for debug

// test
var waiter = new Waiter();
var first = function(){
    var dtd = waiter.Deferred();
    setTimeout(function(){
        console.log('frist time');
        dtd.resolve();
    }, 2000);
    return dtd;
}()
var second = function(){
    var dtd = waiter.Deferred();
    setTimeout(function(){
        console.log('second time');
        dtd.resolve();
    }, 3000);
    return dtd;
}()
var three = function(){
    var dtd = waiter.Deferred();
    setTimeout(function(){
        console.log('fail');
        dtd.reject();
    }, 4000);
    return dtd;
}()
waiter.when(first, second, three).done(function(){
    console.log('success');
}, function(){
    console.log('success again');
}).fail(function(){
    console.log('one fail');
}, null, function(){
    console.log('three fail');
});

// 轮询
// (function getAjaxData(){
//     // 保存当前函数
//     // 此处需要理解
//     var fn = arguments.callee;
//     setTimeout(function(){
//         console.log('query again');
//         // 再次执行
//         fn();
//     }, 5000);
// })();
