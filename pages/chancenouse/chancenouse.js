let URL = require('../../utils/URL.js');
const {
  requestAppid,
  customerDiscountCodeDetail,
} = URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    detail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const that = this;
    const item = JSON.parse(options.item);
    that.setData({
      item: item
    })
    this.getCodeEventDetail(item);
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

  // getEventDetail(){
  //   let param = { id: options.id };
  //   wx.getLocation({
  //     type: 'gcj02',
  //     success: function (res) {
  //       // console.log('app页面获取地图成功')
  //       const location = {};
  //       location.latitude = res.latitude;
  //       location.longitude = res.longitude;
  //       location.altitude = res.altitude;
  //       that.getCodeEventDetail(Object.assign({}, param, location))
  //     },
  //     fail: function () {
  //       that.getCodeEventDetail(Object.assign({}, param))
  //     }
  //   })    
  // },
  subscribe(){
    const that = this;
    const { detail } = that.data;
    wx.redirectTo({
      url: '../time/time?timetocraftman=true&isreplacetime=n&giftId=' + detail.id,
    })
  },

  getCodeEventDetail(item) {
    const that = this;
    // const { item } = that.data;
    const param = {
      discountCodeId: item.discountCodeId,
      type: item.type,
    }
    requestAppid({
      URL: customerDiscountCodeDetail,
      param,
    }, function (data) {
      data.coverImgUrl = data.coverImgUrl ? data.coverImgUrl.split(",") : [];
      console.log(data);
      that.setData({
        detail: data
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