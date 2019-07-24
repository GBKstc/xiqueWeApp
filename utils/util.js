import URL from "./URL.js";
const { requestAppid, checkLogin} = URL;

const formatTime = date => {
  if (!date) {
    return ""
  }
  if (IsNum(date)) {
    date = new Date(date);
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  //const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const IsNum = s=> {
  if (s != null && s != "") {
    return !isNaN(s);
  }
  return false;
}

const formatTimeDay = date => {
  if (!date){
    return ""
  }
  if (IsNum(date)){
    date = new Date(date);
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
  * 检查是否登录
  *
  **/
const isLogin = function(suc,fail,error){
  //检查是否登录,登录返回登录信息 
  requestAppid({ 
    URL:checkLogin,  
  },function(data){
    console.log(data);
    if(data.login){
      getApp().globalData.loginInfo = data;
      //登录
      if (suc) {
        suc()
      }
    }else{
      if (fail){
        fail()
      }else{
        //未登录
        wx.navigateTo({
          url: '../login/login',
        })
      }
      
    }
    
  },function(){
    //未登录
    wx.navigateTo({
      url: '../login/login',
    })
  })
};
/**
  * 组件共通时把组件中的方法合并到页面中
  * param
  *		pageObj（第一个参数）：注册Page()函数时传入的object
  *		compObjArr(后面的参数)：页面require的共通组件
  **/
const mergeComponents = function () {
  let pageObj = arguments[0];
  let length = arguments.length;
  for (let i = 1; i < length; i++) {
    let compObj = arguments[i];
    for (let compKey in compObj) {
      if (compKey == 'data') {
        // 合并页面中的data
        let data = compObj[compKey];
        for (let dataKey in data) {
          pageObj.data[dataKey] = data[dataKey];
        }
      } else {
        // 合并页面中的方法
        pageObj[compKey] = compObj[compKey];
      }
    }
  }
}  

/**
 * 函数节流方法
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @return Function 延迟执行的方法
 */
const throttle = function (fn, delay) {
  let timer = null;

  return function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn();
    }, delay);
  }
};

/**
 * 判断参数为空
 * @param Object o 对象
 * 
 */
const isEmpty = function (o) {
  if (o == null || o == undefined)
    return true;
  switch (typeof o) {
    case "boolean":
      return false;
    case "object":
      for (let t in o)
        return false;
      return true;
    case "array":
    case "string":
      return o.length <= 0;
    case "number":
      return o.toString().length <= 0;
    case "function":
      return false;
  }
  return true;
}

/**
 * 获取商品介绍列表
 * @returns {*}
 */
const getDetailList = function (data) {
  let detailList = [];
  
  
  //处理赠送金额
  if (!isEmpty(data.giveDiscountCodeList)) {
    for (let i of data.giveDiscountCodeList) {
      const { giveSonAccountname, amount } = i;
      const item = {};
      item.numString = "+" + amount + "元";
      item.name = "代金券";
      if (giveSonAccountname.indexOf("生美") >= 0) {
        item.nameDetail = "-指定生美";
      }
      if (giveSonAccountname.indexOf("医美") >= 0) {
        item.nameDetail = "-指定医美";
      }
      if (giveSonAccountname.indexOf("物品") >= 0) {
        item.nameDetail = "-指定产品";
      }
      if (giveSonAccountname.indexOf("项目") >= 0) {
        item.nameDetail = "-指定项目";
      }
      if (giveSonAccountname.indexOf("疗程") >= 0) {
        item.nameDetail = "-指定疗程";
      }
      if (giveSonAccountname.indexOf("促销") >= 0) {
        item.nameDetail = "-指定促销方案";
      }
      detailList.unshift(item);
    }
  }
  //处理赠送物品
  if (!isEmpty(data.giveGoodsVOList)) {
    for (let i of data.giveGoodsVOList) {
      const { goodsName, num } = i;
      const item = {};
      item.name = goodsName;
      item.numString = "+" + num;
      detailList.unshift(item);
    }
  }
  //处理赠送项目
  if (!isEmpty(data.giveProjectVOList)) {
    for (let i of data.giveProjectVOList) {
      const { projectName, num } = i;
      const item = {};
      item.name = projectName;
      item.numString = "+" + num;
      detailList.unshift(item);
    }
  }
  return detailList;
}


/**
 * 时间数据转换
 * @returns {
 *  timeDuan //小时
 *  date //年/月/日
 *  timePart//时间段 HH:mm-HH:mm
 *  week //星期几
 * }
 */

const timeToObj = function(startTime,endTime){

  if (isEmpty(startTime) || isEmpty(endTime)){
    return {}
  }

  let date, date2, Y, M, D, h, hh, m, mm, week, timeDuan;

  const tiemObj = {};

  date = new Date(startTime);
  date2 = new Date(endTime + 60000);//结束时间

  //小时
  timeDuan = (endTime + 60000 - startTime) / 1000 / 3600
  tiemObj.timeDuan = timeDuan
  Y = date.getFullYear() + '/';
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours() + ':';
  hh = date2.getHours() + ':';
  m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  mm = date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()
 //年/月/日
  tiemObj.date = Y + M + D
 //时间段 HH:mm-HH:mm
  tiemObj.timePart = h + m + "-" + hh + mm



  // 求是否是今，明，后天，后者是星期几
  var jinDate = new Date()//今天时间对象
  var mingms = Date.parse(jinDate) + 1 * 24 * 60 * 60 * 1000
  var mingDate = new Date(mingms)//明天时间对象
  var houms = Date.parse(jinDate) + 2 * 24 * 60 * 60 * 1000
  var houDate = new Date(houms)//后天时间对象
  if (date.toDateString() === jinDate.toDateString()) {
    week = '今天'
  } else if (date.toDateString() === mingDate.toDateString()) {
    week = '明天'
  } else if (date.toDateString() === houDate.toDateString()) {
    week = '后天'
  } else {
    switch (date.getDay()) {
      case 0: week = "星期天"; break
      case 1: week = "星期一"; break
      case 2: week = "星期二"; break
      case 3: week = "星期三"; break
      case 4: week = "星期四"; break
      case 5: week = "星期五"; break
      case 6: week = "星期六"; break
    }
  }
  week //星期几
  tiemObj.week = week;


  return tiemObj;
}

/**对象和数组相关的函数**/
/**
 * 深度拷贝, 防止因直接赋值引起的地址相同问题
 * @returns {*}
 */
const cpy =function(o) {
  let res = {};
  if (o === null) {
    return o;
  }
  switch (typeof o) {
    case "object":
      //判断o是否是react组件对象， 如果是 直接赋值
      if (!isEmpty(o) && o["$$typeof"] == Symbol.for('react.element')) {
        res = o;
        break;
      }
      if (Object.prototype.toString.call(o) === '[object Array]')
        res = [];
      for (let i in o) {
        res[i] = cpy(o[i]);
      }
      break;
    default: res = o; break;
  }
  return res;
}

/**
 * 截图小数点后两位
 * @returns number
 */
const toFix = function (value, count){
  const re = /([0-9]+\.[0-9]{2})[0-9]*/;
  if (sTypeOf(obj, "Number")) {
    console.log(obj.toString().replace(re, "$1"))
    return obj.toString().replace(re, "$1");
  } else {
    return obj.replace(re, "$1");
  }
}
/**
 *判断类型
 *
 */
function sTypeOf(o, type) {

  switch (type) {
    case "Array":
      return Object.prototype.toString.call(o) == '[object Array]';
    case "Object":
      return Object.prototype.toString.call(o) == '[object Object]';
    case "String":
      return Object.prototype.toString.call(o) == '[object String]';
    case "Number":
      return Object.prototype.toString.call(o) == '[object Number]';
  }


}



module.exports = {
  formatTime: formatTime,
  formatTimeDay: formatTimeDay,
  throttle: throttle,
  isEmpty: isEmpty,
  mergeComponents: mergeComponents,
  cpy: cpy,
  timeToObj: timeToObj,
  getDetailList:getDetailList,
  isLogin: isLogin,
  toFix: toFix,
  sTypeOf: sTypeOf
}
