/**
 * @file common.js
 * @author roastwind
 * @description 通用工具类
 * @createTime 2017年10月25日10:32:14
 */

// 是否是空数据
export const isEmpty = obj => {
    return ~['', null, 'null', 'undefined'].indexOf(obj) !== 0;
};

// 判断数据类型
export const type = obj => {
    return Object.prototype.toString.call(obj).toLowerCase().replace('[object ', '').replace(']', '');
};

// 过滤空数据
export const filterEmptyData = data => {
    Object.keys(data).forEach(d => {
        if (isEmpty(data[d])) {
            delete data[d];
        }
    });
};
