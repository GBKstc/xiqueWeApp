const URL = require('../../utils/URL.js');
const util = require('../../utils/util.js');
const QR = require("../../utils/qrcode.js");
const {
  requestAppid,
  customerDiscountCodeDetail,
} = URL;
const { 
  getDetailList,
  formatTime
 } = util;
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
    //console.log(options);
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
      url: '../time/time?timetocraftman=true&isreplacetime=n&eventId=' + detail.id,
    })
  },

  //门店导航
  tostoreDistribution: function () {
    const that = this;
    const { detail } = that.data;
    wx.navigateTo({
      url: '../storeDistribution/storeDistribution?fromWhere=false&eventId=' + detail.id,
      success: function () {
      }
    })
  },

  //退款
  refund(){
    wx.navigateTo({
      url: '../refund/refund',
    })
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  createQrCode: function (url, canvasId) {
    const that = this;
    const size = that.setCanvasSize();
    //调用插件中的draw方法，绘制二维码图片
    //console.log(QR, size);
    QR.api.draw(url, canvasId, size.w, size.h);
    //setTimeout(() => { this.canvasToTempImage(); }, 1000);

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
      data.detailList = getDetailList(data);
      data.buyTime = formatTime(new Date(data.createtime));
      data.discountCodeEndTime = formatTime(new Date(data.discountCodeEndTime))
      
      console.log(data, that);
      that.createQrCode(data.discountCode, "mycanvas");
      //QR.api.draw("www.baidu.com", "mycanvas", cavW, cavH);
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