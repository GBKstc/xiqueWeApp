const util = require('../../utils/util');
//var carousel = require("../../component/carousel/carousel");
let URL = require('../../utils/URL.js');
const common = require('../../utils/commonConfirm.js')
const app  = getApp();
const {
  requestAppid,
  getBuyDiscountCodeEventDetail,
  checkCardrank,
  checkTimes,
  
} = URL;
let pageObj = {
  data: {
    
  }
};
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: 'WDEBZ-33BRR-ZO4WZ-WSJ3Y-RFEM2-D6BZF'
});
const { isEmpty, getDetailList, isLogin } = util;
// util.mergeComponents(pageObj, carousel);

// Page(pageObj);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:undefined,
    cardRankInfo:"",
    isShowToast: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log("details",options);
    let { id, recommendId, scene } = options;
    scene = decodeURIComponent(scene)
    that.setData({
      id: id,
    })
    app.globalData.recommendGiftId = id;
    if (recommendId){
      app.globalData.recommendId = recommendId;
      app.globalData.flag = 2;
    } else if (scene && scene.recommendId){
      app.globalData.recommendId = scene.recommendId;
      app.globalData.flag = 1;
    }
    
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

  toMap(e){
    const that = this;
    const latitude = e.currentTarget.dataset.latitude;//获取标签上绑定的维度
    const longitude = e.currentTarget.dataset.longitude;//获取标签上绑定的经度
    const name = e.currentTarget.dataset.name;
    const address = e.currentTarget.dataset.address;
    // 调用坐标转换接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 3,
      success: function (res) {//门店有经纬度
        console.log('腾讯地图调用成功' + res)
        var loca = res.result.ad_info.location;
        wx.openLocation({
          latitude: loca.lat,
          longitude: loca.lng,
          scale: 18,
          name: name,
          address: address
        })
      },
      fail: function (res) {//门店没有经纬度
        console.log('获取经纬度失败');
        //设置toast时间，toast内容  
        that.setData({
          count: 1000,
          toastText: "定位失败,请重试"
        });
        that.showToast();
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  //显示自定义提示框
  showToast: function () {
    var _this = this;
    common.showToast(_this)
  },

  aclick: function () {
    const that = this;
    const { detail } = that.data;
    const param = {
      id: detail.id,
      times: 1
    }
    isLogin(function(){
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
            url: '../accounts/accounts?detail=' + JSON.stringify(detail),
          })
        }, function (msg) {

          console.log("验证购买次数失败")
          that.setData({
            cardRankInfo: "您的购买次数已达上限"
          })
        })
      }, function (msg) {
        console.log("验证卡等级失败")
        that.setData({
          cardRankInfo: msg
        })
      })
    });
    
   
    
  },

  closeMask:function(){
    const that = this;
    that.setData({
      cardRankInfo: ""
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
      //处理图片
      data.carouselImgUrl = data.carouselImgUrl ? data.carouselImgUrl.split(",") : [];
      data.goodsDetailImgUrl = data.goodsDetailImgUrl ? data.goodsDetailImgUrl.split(",") : [];
      
      data.detailList = getDetailList(data);
      if (data.usableStoreList && data.usableStoreList.length>0){
        for (let i of data.usableStoreList){
          i.distanceK = ((i.distance-0)/100).toFixed(1);
        }
      }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const that = this;
    console.log(that.data)
    const { id } = that.data;
    const { globalData } = app;
    //recommendId推荐人ID
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    return {
      path: '/page/details/details?id=' + id + '&recommendId=' + globalData.loginInfo ? globalData.loginInfo.id:'',
    }
  }
})
