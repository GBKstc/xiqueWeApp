var util = require('../../utils/util');
const { isEmpty} = util;
let URL = require('../../utils/URL.js');
const {
  requestAppid,
  checkTimes
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
      amount = currentPrice * number;
    } else {
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
    if (number >= 2) {
      number = number - 1;
      amount = currentPrice * number;
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
    const param = {
      id: detail.id,
      times: number,
      totalAmount: amount,
      amount: detail.currentPrice,
      //recommendId //推荐人ID
    }
    //验证购买次数
    requestAppid({
      URL: checkTimes,
      param,
    }, function (data) {
      console.log("验证购买次数成功")
      // wx.navigateTo({
      //   url: '../accounts/accounts?detail=' + JSON.stringify(detail),
      // })
    }, function (msg) {

      console.log("验证购买次数失败")
      that.setData({
        timesInfo: true
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})