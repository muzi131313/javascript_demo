/**
 * @file utils/lib/date.js
 * @description 时间工具类
 * @doc-name: 万能日期函数
 * @doc http://jo2.org/javascript-date-formatter/
 * @created 2019年11月05日16:39:47
 */
var dateFormat = (date, fmt = 'yyyy-MM-ddThh:mm:ss.SZ') => {
  var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      't+': (() => {
        var hours = date.getHours()
        var minus = hours / 12
        return minus > 1.5 
          ? '晚上'
          : minus > 1
            ? '下午'
            : minus > 0.5
              ? '上午'
              : '凌晨'
      })(), // 12小时制
      'H+': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), // 12小时制小时, 
      'S': date.getMilliseconds() // 毫秒
  };
  // 年份处理
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
  }
  for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                  ? o[k]
                  : ('00' + o[k]).substr(('' + o[k]).length)
          );
      }
  }
  return fmt;
};

// var dd = dateFormat(new Date('2018/05/13'));
// console.log('dd: ', dd);
// var d = new Date()
// var date = dateFormat(d, 'yy-MM-dd')
// var dateTime = dateFormat(d, 'yyyy-MM-dd hh:mm:ss')
// var dateTimeOne = dateFormat(d, 'yyyy年MM月dd日 tHH点mm分')
// console.log(date)
// console.log(dateTime)
// console.log(dateTimeOne)

// 月份的最后一天
var lastDayOfMonth = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  var d = new Date(year, month, 0);
  return d;
};

// 上一个月
var prevMonth = date => {
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month - 1 < 0) {
      year -= 1;
      month = 12;
  }
  else {
      month -= 1;
  }
  return new Date(`${year}/${month}/1 00:00:00`);
};

// 下一个月
var nextMonth = date => {
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month + 1 > 12) {
      year += 1;
      month = 1;
  }
  else {
      month += 1;
  }
  return new Date(`${year}/${month}/1 00:00:00`);
}

// 周的信息, 最后一天/开始的一天
var getWeekInfo = now => {
  let end = null;
  let start = null;
//     const info = {};
  const WEEK_DAY = 7;
//     const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  // 本月最后一天
  const lastDay = lastDayOfMonth(now);
  const lastDayDate = lastDay.getDate();

  // 当前天的周信息/月信息
  const nowWeekDay = now.getDay();
  const nowMonthDay = now.getDate();

  // spare
  const nowSpareDay = WEEK_DAY - nowWeekDay;
  const nowToMonthLastDay = lastDayDate - nowMonthDay;
  console.log('nowSpareDay: ', nowSpareDay, nowToMonthLastDay);
  // TODO: 本周的周末在本月内
  if (nowSpareDay <= nowToMonthLastDay) {
      console.log('last in month');
      const weekEndDay = nowMonthDay + nowSpareDay;
      const weekEndDate = `${year}/${month}/${weekEndDay} 23:23:59`;
      end = new Date(weekEndDate);
      console.log('end: ', end);
  }
  // TODO: 本周的周末不在本月内
  else {
      const nextMonthDate = nextMonth(now);
      const nYear = nextMonthDate.getFullYear();
      const nMonth = nextMonthDate.getMonth() + 1;
      const weekEndDate = `${nYear}/${nMonth}/${(WEEK_DAY - nowToMonthLastDay)} 23:23:59`;
      end = new Date(weekEndDate);
      console.log('last not in month');
  }

  // TODO: 本周的周一在本月内
  if (nowWeekDay <= nowMonthDay) {
      console.log('start in month');
      const weekStartDay = nowMonthDay - nowWeekDay + 1;
      const weekStartDate = `${year}/${month}/${weekStartDay} 00:00:00`;
      start = new Date(weekStartDate);
      console.log('start: ', start);
  }
  else {
      const prevMonthDate = prevMonth(now);
      const pYear = prevMonthDate.getFullYear();
      const pMonth = prevMonthDate.getMonth() + 1;
      const prevLastDate = lastDayOfMonth(pMonth);
      const prevMonthDay = prevLastDate.getDate();
      const weekStartDate = `${pYear}/${pMonth}/${(prevMonthDay - nowWeekDay)} 00:00:00`;
      start = new Date(weekStartDate);
      console.log('start not in month');
  }
  // TODO: 本周的周一不在本月内

  // const lastWeekDay = nowMonthDay +
  return {
      start,
      end
  };
};

// var d = new Date('2018/7/30');
// var info = getWeekInfo(d);
// console.log('info: ', info);

var nextDate = (date, interval = 1, isRecursion) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let monthDate = date.getDate();
  const lastDay = lastDayOfMonth(date);
  const offset = lastDay.getDate() - monthDate;
  console.log('offset: ', offset);
  // isRecursion
  if (interval <= offset) {
      return new Date(`${year}/${month}/${monthDate + (isRecursion ? interval - 1 : interval)}`);
  }
  else {
      const pMonthDate = nextMonth(date);
      return nextDate(pMonthDate, offset, true);
  }
};

exports.dateFormat = dateFormat
exports.lastDayOfMonth = lastDayOfMonth
exports.prevMonth = prevMonth
exports.nextMonth = nextMonth
exports.getWeekInfo = getWeekInfo
exports.nextDate = nextDate

// var d2 = new Date('2018/10/29');
// var d = nextDate(d2, 4);
// console.log(d);


// var d4 = new Date('2019-06-16T22:29:48.071Z')
// d4 = dateFormat(d4, 'yyyy-MM-dd hh:mm:ss')
// var d5 = new Date('2019-06-14T14:31:57.000Z')
// d5 = dateFormat(d5, 'yyyy-MM-dd hh:mm:ss')
// console.log('d4: ', d4)
// console.log('d5: ', d5)
// var d6 = new Date(1560594526*1000)
// d6 = dateFormat(d6, 'yyyy-MM-dd hh:mm:ss')
// console.log('d6: ', d6)
