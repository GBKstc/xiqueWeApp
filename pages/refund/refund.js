// pages/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
      fail: function () {
        // //设置toast时间，toast内容  
        // that.setData({
        //   count: 5000,
        //   toastText: '如果联系客服，必须先授权拨打电话功能'
        // });
        // that.showToast();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },



})