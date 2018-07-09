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
    acessToken:"",
    imgUrl:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("二维码页面", options);

    const that = this;
    that.getQRcode(options.acessToken);
    const loginInfo = getApp().globalData.loginInfo;
    this.setData({
      acessToken: options.acessToken,
      loginInfo,
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

  getQRcode(acessToken) {
    const that = this;
    const scene = { recommendId: getApp().globalData.loginInfo.id};
    const data = {
      scene: JSON.stringify(scene),
      path: "pages/details/details"
    };
    requestAppid({
      URL: getQRcode,
      param: data
    }, function (imgUrl){
      console.log(imgUrl);
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