// pages/cardList/success.js
let util = require('../../utils/util.js');
let URL = require('../../utils/URL.js');
const { isEmpty, formatTimeDay } = util;
const { 
  requestAppid,
  cardList,
} = URL;
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
    this.getCardList()
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
  
    var that = this;
    console.log(e.currentTarget);
    if (isEmpty(that.data.weixinShowCardInfo)){
      return false;
    }
    if (!that.data.isLogin) {//登录了
      wx.navigateTo({
        url: "../cardDetail/cardDetail?cardId=" + e.currentTarget.dataset.cardid,
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
  },

  //获取卡列表
  getCardList(){
    const that = this;
    requestAppid({
      URL: cardList,
    }, function (data){
      if (isEmpty(data) || isEmpty(data.cardList)){
        return;
      }
      for(let item of data.cardList){
        item.buyTime = formatTimeDay(new Date(item.buyTime));
      }
        that.setData({
          cardList: data.cardList,
          weixinShowCardInfo: data.weixinShowCardInfo
        })
    })
  }

})