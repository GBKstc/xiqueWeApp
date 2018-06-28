var util = require('../../utils/util');
//var carousel = require("../../component/carousel/carousel");
let URL = require('../../utils/URL.js');
const {
  requestAppid,
  getBuyDiscountCodeEventDetail,
  checkCardrank,
  checkTimes
} = URL;
let pageObj = {
  data: {

  }
};
// util.mergeComponents(pageObj, carousel);

// Page(pageObj);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    cardRankInfo:"",
    timesInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log("details",options);
    that.setData({
      id: options.id,
    })
    let param = { id: options.id};
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // console.log('app页面获取地图成功')
        const location = {};
        location.latitude = res.latitude;
        location.longitude = res.longitude;
        location.altitude = res.altitude;
        that.getCodeEventDetail(Object.assign({}, param, location))
      },
      fail: function () {
        that.getCodeEventDetail(Object.assign({}, param))
      }
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

  aclick: function () {
    const that = this;
    const { detail} = that.data;
    const param = {
      id:detail.id,
      times:1
    }
    //验证卡等级
    requestAppid({
      URL: checkCardrank,
      param,
    }, function (data) {
      console.log("验证卡等级成功")
        //成功后验证购买次数
        requestAppid({
          URL: checkTimes,
          param,
        }, function (data) {
          console.log("验证购买次数成功")
          wx.navigateTo({
            url: '../accounts/accounts?detail='+JSON.stringify(detail),
          })
        },function(msg){

          console.log("验证购买次数失败")
          that.setData({
            timesInfo:true
          })
        })
      }, function (msg){
        console.log("验证卡等级失败")
        that.setData({
          cardRankInfo: msg
        })
    })
    
  },

  longTap: function () {
    getApp().getAccessToken(
      function(data){
        console.log(data);
        wx.navigateTo({
          url: '../two_demision/two_demision?acessToken=' + data.access_token,
        })
      }
    );
    
  },

  getCodeEventDetail(param){
    const that = this;
    requestAppid({
      URL: getBuyDiscountCodeEventDetail,
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
