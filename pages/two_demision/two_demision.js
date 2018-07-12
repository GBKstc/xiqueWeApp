let URL = require('../../utils/URL.js');
const {
  requestAppid,
  getQRcode
} = URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // acessToken:"",
    imgUrl:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("二维码页面", options);

    const that = this;
    let eventName = "";
    that.getQRcode();
    if (options && options.eventName){
      eventName = options.eventName;
    }
    const loginInfo = getApp().globalData.loginInfo;
    this.setData({
      //acessToken: options.acessToken,
      loginInfo,
      eventName: eventName,
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

  getQRcode() {
    const that = this;
    const globalData = getApp().globalData;
    let recommendId = "";
    if (globalData.loginInfo&&globalData.loginInfo.id){
      recommendId = globalData.loginInfo.id;
    }
    const scene = recommendId;
    const data = {
      scene: scene,
      path: "pages/index/index"
    };
    requestAppid({
      URL: getQRcode,
      param: data
    }, function (imgUrl){
      console.log("二维码页面",imgUrl);
      that.setData({
        imgUrl
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
  // onPullDownRefresh: function () {
    
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
    
  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // }
})