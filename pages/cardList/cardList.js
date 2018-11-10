// pages/cardList/success.js
let util = require('../../utils/util.js');
let URL = require('../../utils/URL.js');
const { isEmpty } = util;
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

  },


  selectCard:function(e){
  
    var that = this
    if (!that.data.isLogin) {//登录了
      wx.navigateTo({
        url: "../cardDetail/cardDetail",
        success: function () {
        }
      })
    } else {//没登录
      //设置toast时间，toast内容  
      that.setData({
        count: 2000,
        toastText: '请先登录'
      });
      that.showToast();
    }
  } 
})