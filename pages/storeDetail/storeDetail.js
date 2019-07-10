// pages/storeDetail/storeDetail.js
const config = require('../../utils/config');
const { imgUrl } = config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
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


  /**
   * 联系客服
   */
  makePhoneCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: "123456",
      success: function () {
      },
      fail: function () { }
    })
  },

  /**
   * 跳转地图
   */
  toMapPage: function (e) {
    const latitude = e.currentTarget.dataset.latitude;//获取标签上绑定的维度
    const longitude = e.currentTarget.dataset.longitude;//获取标签上绑定的经度
    const name = e.currentTarget.dataset.name;
    const address = e.currentTarget.dataset.address;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: `https://apis.map.qq.com/ws/coord/v1/translate?locations=${latitude},${longitude}&type=3&key=WDEBZ-33BRR-ZO4WZ-WSJ3Y-RFEM2-D6BZF`,
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status === 0) {
          var loca = res.data.locations[0];
          wx.openLocation({
            latitude: loca.lat,
            longitude: loca.lng,
            scale: 18,
            name: name,
            address: address
          })
        } else {
          console.log("请求错误码", res.data.status);
        }
        wx.hideLoading();
      },
      fail: function (res) {
        that.setData({
          count: 1000,
          toastText: "定位中..."
        });
        that.showToast();
      }
    })
  },
  /**
   * 跳转首页
   */
  goToIndex:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.switchTab({
      url: "../index/index",
      success: function () {
        wx.hideLoading();
      }
    })
  }

})