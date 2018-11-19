// pages/cardDetail/cardDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalBottom:"-100%",
    showShadow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"卡详情")
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
   * 选择疗程或者方案
   */
  selectProject:function(){
    const that = this;
    this.setData({
      showShadow: true
    },()=>{
      this.setData({
        modalBottom: 0,
      })
    })
  },

  closeModal:function(){
    const that = this;
    this.setData({
      showShadow: false,
      modalBottom: "-100%",
    })
  }
})