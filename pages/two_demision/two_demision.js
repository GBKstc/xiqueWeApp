let URL = require('../../utils/URL.js');
const {
  requestAppid,
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
    this.setData({
      acessToken: options.acessToken
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
    wx.request({
      url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + acessToken,
      data:{
        scene:"AAAA",
        page:"pages/index/index"
      },
      method:"POST",
      header: { 'content-type': 'image/jpeg' },
      success:function(res){
        console.log(res);
        // var array = wx.base64ToArrayBuffer(res.data);
        // console.log(array);
        var base64 = wx.arrayBufferToBase64(res.data); 
        console.log(base64);
        that.setData({
          imgUrl: base64
        })
      }
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