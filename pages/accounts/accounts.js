var util = require('../../utils/util');
const { isEmpty} = util;
let URL = require('../../utils/URL.js');
const {
  requestAppid,
  checkTimes,
  cancelBuy,
  buyDiscountCode,
} = URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:1,
    detail:{},
    amount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("购买页面", JSON.parse(options.detail))
    const that = this;
    const detail = JSON.parse(options.detail);
    const amount = detail.currentPrice;
    that.setData({
      detail,
      amount,
    })
  },

 
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },


  addNum: function () {
    const that = this;
    let { number, detail } = that.data;
    const currentPrice = detail.currentPrice;
    let amount = 0;
    if (isEmpty(detail.buyTimes) || (number < detail.buyTimes)) {
      number = number + 1;
      amount = currentPrice* 100 * number / 100;
    } else {
      that.setData({
        cardRankInfo:"已经到最大可购买量"
      })
      return;
    }

    this.setData({
      number,
      amount
    })
  },

  subtractNum: function () {
    const that = this;
    let { number, detail, } = that.data;
    const currentPrice = detail.currentPrice;
    let amount = 0;
    if (number >= 2) {
      number = number - 1;
      amount = currentPrice * 100 * number / 100;;
    } else {
      return;
    }

    this.setData({
      number,
      amount
    })
  },

  submit: function () {
    const that = this;
    const { number, amount, detail} = that.data;
    const { recommendId, recommendGiftId, flag} = getApp().globalData;
    console.log(getApp().globalData);
    const param = {
      id: detail.id,
      times: number,
      totalAmount: amount,
      amount: detail.currentPrice,
      //recommendId //推荐人ID
    }
    //有推荐人 且推荐优惠码ID为购买ID 
    if (recommendId && flag && recommendGiftId == detail.id){
      param.recommendId = recommendId;
      param.flag = flag;
    }

    console.log(param, recommendId , flag , recommendGiftId == detail.id);
    //验证购买次数
    requestAppid({
      URL: checkTimes,
      param,
    }, function (data) {
      console.log("验证购买次数成功")
      requestAppid({
        URL: buyDiscountCode,
        param,
      },function(data){
        const reqData = JSON.parse(data.payinfo); 
        console.log(reqData);
        const orderno = data.orderno;
        reqData.success = function(){
          wx.redirectTo({
            url: '../select/select',
          });
        }
        reqData.fail = function (data) {
          console.log(data);
          that.setData({
            cardRankInfo: "支付失败，请重新购买"
          })
          const cancelBuyParam = {
            id: detail.id,
            times: number,
            orderno: orderno,
          };
          if(data.errMsg == "requestPayment:fail cancel"){
            cancelBuyParam.payStatus = "06";
          } else {
            cancelBuyParam.payStatus = "04";
          };
          
          // requestAppid({
          //   URL:cancelBuy,
          //   param: cancelBuyParam,
          // },function(){
          // })
          
        }
        wx.requestPayment(reqData);
      })
     
    }, function (msg) {
      that.setData({
        cardRankInfo: msg
      })
      console.log(msg)
      that.setData({
        timesInfo: true
      })
    })
  },

  closeMask: function () {
    const that = this;
    that.setData({
      cardRankInfo: ""
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
    
  // }
})