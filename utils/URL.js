

const requestAppid = function({URL,param = {}},succ,fail){
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.getStorage({//异步获取随机数
    key: getApp().globalData.appid,
    success: function (res) {
      // console.log("异步获取随机数",res.data);
      param.thirdSessionId = res.data;
      // param.thirdSessionId = "504800e9-7d00-4488-b8bc-e57d12254c47";
      wx.request({
        url: getApp().url + URL,
        method: 'POST',
        data: param,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            if (succ) {
              succ(res.data.data, res);
            }
          } else if (res.data.status === 402){
            getApp().login();
          } else {
            console.log("请求错误码", res.data.status);
            if (fail) {
              fail(res.data.msg, res)
            }else{
              console.log("请求错误码", res)
              // sMessage(res.data.msg)
            }
          }
          
        },
        fail: function (res) {
          wx.hideLoading();
          console.log("请求异常", res);
        }
      })
    },
    fail: function () {
      wx.hideLoading();
      getApp().login();
      console.log('页面获取随机数失败');
    },
  })
}

const request = function ({ URL, param = {}, method="POST" }, succ) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  wx.request({
    url: getApp().url + URL,
    method: method,
    data: param,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      if (res.data.status === 200 || res.data.status === 0) {
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
const companyInfo = "company/info";
const loginOut = "user / loginOut";
const checkWxLogin = "wxLogin/getWxPhoneNumber";
const wxLogin = "wxLogin/login";
const getServiceTelephone = "user/getServiceTelephone";
const getWeixinPostCodeName = "index/getWeixinPostCodeName";//获取手艺人岗位名称

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
const userScheduleServiceSaveEvaluate = "userScheduleService/saveEvaluate";//提交评价
const billConfirmBill = "bill/confirmBill";//提交订单（ERP结账）
const customerDiscountCodeDetail = "myDiscountCode/customerDiscountCodeDetail";//顾客优惠码详情
const buyDiscountCode = "buyDiscountCode/buy";//支付接口
const cancelBuy = "buyDiscountCode/cancelBuy";//取消支付接口

const getQRcode = "buyDiscountCode/getQRcode";

const getUserScheduleServiceList = "userScheduleService/getUserScheduleServiceList";//获取订单列表


const getVoiceVerificationCode = "user/getVoiceVerificationCode";//获取语音验证码


//获取订单详情列表
const serviceCardDiscountCodeGive = "/service/cardDiscountCodeGive"; //优惠码核销
const serviceCardTrans = "service/cardTrans"; //转账
const serviceCardReturn = "service/cardReturn"; //退货
const serviceCardPick = "service/cardPick"; //取货
const serviceCardConsume = "service/cardConsume"; //消费
const serviceCardBuy = "service/cardBuy"; //购买
const serviceCardRecharge = "service/cardRechargeList"; //充值
// const serviceCardRecharge = "service/cardRecharge"; //充值
const serviceOpenCardInfo = "service/openCardInfo"; //开卡


const cardList = "card/cardList"; //获取卡列表

const getStoreTypeList = "index/getStoreTypeList"; //获取门店类型

const cardLiaochengDetailProducts = "card/cardLiaochengDetailProducts"; //卡剩余疗程内物品和项目

const cardLiaochengAndProm = "card/cardLiaochengAndProm"; //卡剩余疗程和方案
const cardPromDetailProducts = "card/cardPromDetailProducts"; //卡剩余疗程和方案
const cardProjects = "card/cardProjects"; //卡剩余项目
const cardGoods = "card/cardGoods"; //卡剩余物品
const cardBalance = "card/cardBalance"; //卡余额

const receiveDiscountCodePre = "myDiscountCode/receiveDiscountCodePre";//优惠码领取校验
const receiveDiscountCode = "myDiscountCode/receiveDiscountCode";//优惠码领取

const refundDetail = "myDiscountCode/refundDetail";//优惠码领取
const applyRefund = "myDiscountCode/applyRefund";//优惠码退款
const myInfo = "user/myInfo";//我的信息

const storeDetail = "user/getStoreDetail";//获取门店详情
const getWeixinModuleShowIs = "index/getWeixinModuleShowIs";//控制小程序功能模块是否展示  n是不展示，其他情况都展示

module.exports = {
  request,
  requestAppid,

  getStoreTypeList,
  checkLogin, 
  companyInfo,
  loginOut,
  checkWxLogin,
  getWeixinPostCodeName,
  getServiceTelephone,
  wxLogin,
  myInfo,
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
  userScheduleServiceSaveEvaluate,
  billConfirmBill,
  getVoiceVerificationCode,

  //订单详情接口
  serviceCardDiscountCodeGive,
  serviceCardTrans,
  serviceCardReturn,
  serviceCardPick,
  serviceCardConsume,
  serviceCardBuy,
  serviceCardRecharge,
  serviceOpenCardInfo,

  //卡详情接口
  cardList,
  cardLiaochengDetailProducts,
  cardLiaochengAndProm,
  cardProjects,
  cardGoods,
  cardBalance,
  cardPromDetailProducts,

  //优惠券赠送
  receiveDiscountCodePre,
  receiveDiscountCode,

  //优惠券退款详情
  refundDetail,
  //优惠券申请
  applyRefund,

  storeDetail,
  getWeixinModuleShowIs,
}