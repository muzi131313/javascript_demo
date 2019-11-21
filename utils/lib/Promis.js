/** @type {Number} [状态] */
const PENDING = 0;      // 进行中
const FULLFILLED = 1;   // 成功
const REJECTED = 2;     // 失败

/** [判断js对象类型] */
const type = obj => Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase();
/** [判断js对象是否是Function] */
const isFunction = obj => type(obj) === 'function'

/**
 * Promise的模拟实现
 */
class Promis {
    constructor(callback) {
        this.state = PENDING;   // 状态
        this.value = null;      // 成功/失败结果值
        this.handlers = [];     // 成功/失败的处理,调用`.then()`/`.done()`方法
        this.callback = callback; // 传入的callback方法
        this._doResolve(callback, this._resolve.bind(this), this._reject.bind(this));
    }
    _fullfill(result) {
        this.state = FULLFILLED;
        this.value = result;
        this.handlers.forEach(this._handle.bind(this));
        this.handlers = null;
    }
    _reject(error) {
        this.state = REJECTED;
        this.value = error;
        this.handlers.forEach(this._handle.bind(this));
        this.handlers = null;
    }
    _resolve(result) {
        try {
            // 保证链式调用
            let then = this._getThen(result);
            if (then) {
                this._doResolve(then.bind(result), this._resolve, this._reject);
                return;
            }
            // 最后一个then函数调用
            this._fullfill(result);
        } catch (e) {
            this._reject(e);
        }
    }
    _getThen(value) {
        if (value && (type(value) === 'object' || type(value) === 'function')) {
            let then = value.then;
            if(type(then) === 'function') return then;
        }
        return null;
    }
    // 1. Promis 构造函数传入的函数，和成员变量 _resolve、_reject绑定，用来接收传过来的值（resolvedValue/rejectedValue）
    _doResolve(callback, onFullfilled, onRejected) {
        let done = false;
        let successCallback = data => {
            if (done) return;
            done = true;
            onFullfilled(data);
        };
        let failCallback = error => {
            if (done) return;
            done = true;
            onRejected(error);
        }
        try {
            callback(successCallback, failCallback);
        } catch (e) {
            failCallback(e);
        }
    }
    // 2. 状态机，
    // 初始化阶段，调用 Promis 构造函数（处于PENDDING状态），则添加 handler 到 handlers 中
    // then 函数调用阶段，则遍历执行 handlers 中的事件
    _handle(handler) {
        switch(this.state){
        case PENDING:
            this.handlers.push(handler);
            break;
        case FULLFILLED:
            if(isFunction(handler.onFullfilled)) handler.onFullfilled(this.value);
            break;
        case REJECTED:
            if(isFunction(handler.onRejected)) handler.onRejected(this.value);
            break;
        }
    }
    done(onFullfilled, onRejected) {
        setTimeout(() => {
            this._handle({
                onFullfilled: onFullfilled,
                onRejected: onRejected
            });
        }, 0)
    }
    then(onFullfilled, onRejected) {
        return new Promis((resolve, reject) => {
            return this.done(
                result => {
                    // then函数, 支持函数, 或者数据
                    if (isFunction(onFullfilled)) {
                        try {
                            return resolve(onFullfilled(result));
                        } catch (e) {
                            return reject(e);
                        }
                    } else {
                        return resolve(result);
                    }
                },
                error => {
                    if (isFunction(onRejected)) {
                        try {
                            return resolve(onRejected(error));
                        } catch (e) {
                            return reject(e);
                        }
                    } else {
                        return reject(error);
                    }
                }
            );
        });
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

