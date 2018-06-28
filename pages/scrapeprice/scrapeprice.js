Page({

  /**
   * 页面的初始数据
   */
  data: {
    award:{
      coverImgUrl:"../../image/cry.png",
      eventName:"运气不好，预约下次试试",
    },
    isShowJiang:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const that = this;
    that.setData({
      award: JSON.parse(options.award)
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

  lottery:function(){
    const that = this;
    that.setData({
      isShowJiang:true,
    })
  },

  getGift:function(){
    wx.navigateTo({
      url: '../success/success?towhere=select&successText=领取成功',
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