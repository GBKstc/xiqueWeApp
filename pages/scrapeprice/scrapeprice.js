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
    if (options.award){
      that.setData({
        award: JSON.parse(options.award)
      })
    }
    
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
    const that = this;
    that.showCanvas();
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
    wx.redirectTo({
      url: '../success/success?towhere=select&successText=领取成功',
    })
  },

  goAppointment(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //刮奖初始化
  showCanvas(){
    const ctx = wx.createCanvasContext('scratch');
    console.log(ctx);
    ctx.setFillStyle("#DADADA");
    ctx.fillRect(0, 0,1000,1000);
    ctx.draw();
  },
  //开始刮奖
  touchStart(e){
    const that = this;
    const { isShowJiang } = that.data;
    if (isShowJiang){
      return ;
    }
    const ctx = wx.createCanvasContext('scratch');
    console.log("开始刮奖",e.touches[0]);
    ctx.clearRect(e.touches[0].x, e.touches[0].y, 20, 20);
    ctx.draw(true);
    
    
  },

  //刮奖中
  touchMove(e) {
    console.log("刮奖中",e.touches[0]);
    const that = this;
    const { isShowJiang } = that.data;
    if (isShowJiang) {
      return;
    }
    const ctx = wx.createCanvasContext('scratch');

    ctx.clearRect(e.touches[0].x, e.touches[0].y, 20, 20);
    ctx.draw(true);
  },
  //刮奖结束
  touchEnd(e){
    console.log("刮奖结束", e);
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowJiang: true,
      })
    }, 200);
    // const that = this;
    // const { isShowJiang } = that.data;
    // if (isShowJiang) {
    //   return;
    // }
    // const ctx = wx.createCanvasContext('scratch');
    
    // ctx.clearRect(e.touches[0].x, e.touches[0].y, 20, 20);
    // ctx.draw(true);
    
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