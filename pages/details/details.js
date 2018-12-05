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
  receiveDiscountCode,
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
    isShowRegret: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //console.log("details",options);
    let { 
      id, //优惠券事件ID
      recommendId,//推荐人ID
      customerId,//赠送顾客ID
      discountCodeId,//优惠券ID
      type,//优惠事件的类型1优惠码 2优惠码-购买 3优惠码-赠送
     } = options;
    //scene = decodeURIComponent(scene)
    that.setData({
      id: id,
      customerId,
      type,
      discountCodeId
    })

    var random = wx.getStorageSync(app.globalData.appid);
    // var random = '3c375316-9d51-4908-a383-2c99dece3b17';
    
    
    let param = { id: id};
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // console.log('app页面获取地图成功')
        const location = {};
        location.latitude = res.latitude;
        location.longitude = res.longitude;
        location.altitude = res.altitude;
        if (random) {//有随机数
          that.getCodeEventDetail(Object.assign({}, param, location))
        } else {
          that.login(that.getCodeEventDetail, Object.assign({}, param, location))
        }
        
       
      },
      fail: function () {
        if (random) {//有随机数
          that.getCodeEventDetail(Object.assign({}, param))
        } else {
          that.login(that.getCodeEventDetail, Object.assign({}, param))
        }
        
      
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

  //开始*******************************************************************************************
  login: function (cb,param) {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
        // console.log(code)
        // console.log('获取login到了code' + code)
        //调用公共方法
        wx.getLocation({
          type: 'gcj02',
          success: function (resss) {
            // console.log('app页面获取地图成功')
            var latitude = resss.latitude
            var longitude = resss.longitude
            var altitude = resss.altitude
            that.setData({
              latitude: latitude,
              longitude: longitude,
              degree: true//有经纬度了
            })
            // 参数都获取到了，发送请求
            that.commomlogin(cb,param,code, latitude, longitude, altitude)
          },
          fail: function () {
            // console.log('app页面获取地图失败！')
            that.setData({
              degree: false
            })
            that.commomlogin(cb, param,code)
          }
        })
      },
      fail: function () {
        console.log('获取用户code失败')
        // console.log('app页面获取用户登录态失败！' + res.errMsg)
        // wx.showToast({
        //   title: '获取用户登录态失败',
        //   duration: 2000
        // })
      }
    });
  },

  //获取随机数
  commomlogin: function (cb, param,code, latitude, longitude, altitude) {
    var that = this
    var sendData
    var appid = getApp().globalData.appid
    var secret = getApp().globalData.secret
    if (!latitude) {
      sendData = {
        code: code,
        appid: appid,
        secret: secret
      }
    } else {
      sendData = {
        code: code,
        latitude: latitude,
        longitude: longitude,
        appid: appid,
        secret: secret
      }
    }
    // console.log('获取随机数的参数')
    // console.log(sendData)
    wx.request({
      url: getApp().url + 'wxLogin/login',
      data: sendData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status == 200) {
          console.log('login接口成功')
          wx.setStorage({//异步存随机数，在它的回调函数里走原index函数
            key: appid,
            data: res.data.data.thirdSessionId,
            success: function () {
             console.log('保存随机数成功，开始调用回调函数')
             if(cb){
               cb(param)
             }
             // that.loadFirst(res.data.data.thirdSessionId)//调用原index里的函数,传入随机数
            },
            fail: function () {
              // console.log('保存随机数失败')
            }
          })

        } else if (res.data.status == 400) {
          // console.log('调用随机数借口400')
          // var msg = res.data.msg
          // //验证签名失败
          // wx.showToast({
          //   title: 'login' + msg,
          //   duration: 2000
          // })
        }
      },
      fail: function () {
        // console.log('调用随机数借口fail')
      }
    });
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
    delete detail.carouselImgUrl;
    delete detail.goodsDetailImgUrl;
    //去除详情描述
    delete detail.goodsDetail;
    const param = {
      id: detail.id,
      times: 1
    }
    console.log(getApp());
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
    const that = this;
    const { detail, id } = that.data;
  
    //console.log("longTap", JSON.stringify(detail));
    isLogin(function () {
      wx.navigateTo({
        url: '../two_demision/two_demision?eventName=' + detail.eventName + '&id=' + id,
      })
      // getApp().getAccessToken(
      //   function (data) {
         
      //   }
      // );
    });
    
    
  },

  getCodeEventDetail(param){
    const that = this;
    requestAppid({
      URL: getBuyDiscountCodeEventDetail,
      param,
    }, function (data) {
      
      //处理图片
      data.carouselImgUrl = data.carouselImgUrl ? data.carouselImgUrl.split(",").map((item) => item +"?x-oss-process=image/resize,w_400") : [];
      data.goodsDetailImgUrl = data.goodsDetailImgUrl ? data.goodsDetailImgUrl.split(",").map((item) => item + "?x-oss-process=image/resize,w_400") : [];
      console.log(data.carouselImgUrl);
      data.detailList = getDetailList(data);
      if (data.usableStoreList && data.usableStoreList.length>0){
        for (let i of data.usableStoreList){
          i.distanceK = ((i.distance-0)/1000).toFixed(1);
        }
      }
      that.setData({
        detail: data,
        //isShowRegret:false
      })
    },function(msg){
      that.setData({
        isShowRegret: true
      })
    })
  },

  //领取优惠券
  getReceiveDiscountCode(){
    const that = this;
    const { customerId, discountCodeId, type,id} = that.data;
    requestAppid({
      URL: receiveDiscountCode,
      param:{
        customerId, discountCodeId, type
      },
    }, 
    function (data) {
      wx.redirectTo({
        url: '../success/success?successText=领取成功&toPag=select',
      })
    },
      function (msg) {
        //设置toast时间，toast内容  
        that.setData({
          count: 2000,
          toastText: msg,
        });
        that.showToast();
        wx.redirectTo({
          url: '../experience/experience',
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
    const { globalData } = getApp();
    let recommendId = "";
    //recommendId推荐人ID
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    if (globalData.loginInfo && globalData.loginInfo.id){
      recommendId = globalData.loginInfo.id;
    }
    console.log(globalData);
    return {
      path: '/pages/experience/experience?id=' + id + "&isShare=true" + '&recommendId=' + recommendId,
      // path: '/pages/experience/experience?scene=' + encodeURIComponent('id=' + id + "&isShare=true" + '&recommendId=' + recommendId),
    }
  }
})
