let util = require('../../utils/util.js');
let URL = require('../../utils/URL.js');
const app = getApp();
const { 
  requestAppid,
  getBuyDiscountCodeEventList
} = URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    loading:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    let recommendId = "";
    let flag = "";
    console.log("onLoad",options);

    //判断分享来源

    //如果是分享 跳转详情
    if (options && options.isShare) {
      console.log("分享", options);
      recommendId = options.recommendId;
      flag = 2;
      wx.navigateTo({
        url: '/pages/details/details?id=' + options.id  + '&recommendId=' + recommendId,
      })
    }
    //如果是二维码， 跳转详情
    if (options && options.scene){
      console.log("二维码", options);
      recommendId = decodeURIComponent(options.scene);
      flag = 1;
      wx.navigateTo({
        url: '/pages/details/details?id=' + options.id  + '&recommendId=' + recommendId,
      })
    }
    
    app.globalData.recommendGiftId = options.id;
    app.globalData.recommendId = recommendId;
    app.globalData.flag = flag;

    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    console.log("onReady",options);
    
  },

  buyDiscountCodeEventList(){
    const that = this;
    requestAppid({
      URL: getBuyDiscountCodeEventList,
      param: {
        pageNo: 1,
        pageSize: 999,
      },
    }, function (data) {
      console.log(data);
      wx.stopPullDownRefresh();
      if (data){
        that.setData({
          listData: data.list,
          loading:false
        })
      }else{
        that.setData({
          listData: [],
          loading: false
        })
      }
      
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log("onShow",options);
    const that = this;
    that.buyDiscountCodeEventList();
    
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
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id
    })
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    const that = this;
    that.buyDiscountCodeEventList();
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {}
  }

})