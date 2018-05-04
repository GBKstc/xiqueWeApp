let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasList:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this
    console.log("体验页面");
    
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
  //开始*******************************************************************************************
  login:function(){
  
  },
  /**
   * 点击打开详情
   */
  showDetails:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/details/details'
    })
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
  
  }

})