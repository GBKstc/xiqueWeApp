

const requestAppid = function({URL,param = {}},succ,fail){
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.getStorage({//异步获取随机数
    key: getApp().globalData.appid,
    success: function (res) {
      console.log("异步获取随机数",res.data);
      param.thirdSessionId = res.data;
      wx.request({
        url: getApp().url + URL,
        method: 'POST',
        data: param,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.status === 200) {
            if (succ) {
              succ(res.data.data);
            }
          }else{
            console.log("请求错误码", res.data.status);
            if (fail) {
              fail(res.data.msg)
            }
          }
          wx.hideLoading();
        },
        fail: function (res) {
          wx.hideLoading();
          console.log("请求异常", res);
        }
      })
    },
    fail: function () {
      wx.hideLoading();
      console.log('页面获取随机数失败');
    },
  })
}

const request = function ({ URL, param = {} }, succ) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: getApp().url + URL,
    method: 'POST',
    data: param,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      if (res.data.status === 200) {
        if (succ) {
          succ(res.data.data);
        }
      } else {
        console.log("请求错误码", res.data.status);
      }
      wx.hideLoading();
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("请求异常", res);
    }
  })
}




//登录验证
const checkLogin = "user/checkLogin";
//获取登录者信息
const getCurrentUser = "user/getCurrentUser";

//预约人编辑删除接口
const updateAppointment = 'user/updateAppointment';
const addAppointment = 'user/addAppointment';
const getBuyDiscountCodeEventList = "buyDiscountCode/getBuyDiscountCodeEventList";//体验 （优惠码）
const getBuyDiscountCodeEventDetail = "buyDiscountCode/getBuyDiscountCodeEventDetail";//获取优惠码详情
const checkCardrank = "buyDiscountCode/checkCardrank";//验证购买卡等级
const checkTimes = "buyDiscountCode/checkTimes";//验证购买次数
const getCustomerDiscountCodeList = "myDiscountCode/getCustomerDiscountCodeList";//获取顾客优惠列表

const raffle = "evaluteGift/raffle";//评价活动抽奖

const customerDiscountCodeDetail = "myDiscountCode/customerDiscountCodeDetail";//顾客优惠码详情
const buyDiscountCode = "buyDiscountCode/buy";//支付接口
const cancelBuy = "buyDiscountCode/cancelBuy";//取消支付接口

const getQRcode = "buyDiscountCode/getQRcode";

const getUserScheduleServiceList = "userScheduleService/getUserScheduleServiceList";//获取订单列表

module.exports = {
  request,
  requestAppid,


  checkLogin,
  getCurrentUser,
  updateAppointment,
  addAppointment,
  getBuyDiscountCodeEventList,
  getBuyDiscountCodeEventDetail,
  checkCardrank,
  checkTimes,
  getCustomerDiscountCodeList,
  raffle,
  customerDiscountCodeDetail,
  buyDiscountCode,
  cancelBuy,
  getQRcode,
  getUserScheduleServiceList,
}