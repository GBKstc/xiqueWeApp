// pages/refund/refund.js

let URL = require('../../utils/URL.js');
let util = require('../../utils/util.js');
const App = getApp();
const {
  requestAppid,
  refundDetail
} = URL;
const {
  isEmpty,
  formatTimeDay,
  formatTime
} = util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let item = {}
    if (App.globalData.successData){
      item = App.globalData.successData
      this.setData({
        item: item
      })
      console.log(item);
      that.getRefundDetail(item.discountCodeId)
    }

    //console.log(app.globaData)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //联系客服
  makePhoneCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: "18757103261",
      success: function () {
      },
      fail: function () {}
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 获取退款详情
   */
  getRefundDetail(discountCodeId){
    console.log(discountCodeId)
    const that = this;
    requestAppid(
      {
        URL: refundDetail,
        param: {
          discountCodeId: discountCodeId,
        },
      },
      function (data) {
        console.log(data);
        data.createtime = formatTime(data.createtime);
        data.delTime = formatTime(data.delTime);
        data.failTime = formatTime(data.failTime);
        data.successTime = formatTime(data.successTime);

        switch (data.discountCodeStatus){
          case 0:
            data.title ="未使用";
            break;
          case 1:
            data.title = "已过期";
            break;
          case 2:
            data.title = "已使用";
            break;
          case 3:
            data.title = "退款成功";
            break;
          case 4:
            data.title = "退款失败";
            break;
          case 5:
            data.title = "微信到账处理中...";
            break;
          case 6:
            data.title = "线下退款成功";
            break;
        }

        that.setData({
          refundDetail: data
        })
      })
  }



})