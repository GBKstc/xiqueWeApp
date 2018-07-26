import URL from "./utils/URL.js";
const { getCurrentUser } = URL;

// 正版
App({
  globalData: {//初始化请求参数
    appid: 'wxab4355d28417d914',  
    secret: '026e8bf6e20155b7d7f926b27db7c5c3'
  },
  // url: 'http://115.236.38.186:9020/weixin-xique/',//张伟哲
  //  url: 'http://192.168.18.70:18089/weixin-xique/',//预发环境
  // url: "http://jbs.xibao.com:8890/weixin-xique/",//陈荣贵
  // url: "https://192.168.18.253:8443/weixin-xique/",//陈荣贵
  // url: 'http://122.225.192.228:9031/weixin-xique/',//测试环境

  url: "https://xq.beautysaas.com/weixin-xique/",//正式环境
  onLaunch: function () {
    console.log("app onLaunch")
    const that = this;
    wx.getStorage({//异步获取随机数
      key: that.globalData.appid,
      success: function (res) {
        console.log("app-异步获取随机数成功")
        wx.request({
          url: that.url + getCurrentUser,
          data: {
            thirdSessionId: res.data,
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            if (res.statusCode == 200 && res.data.status){
              that.globalData.loginInfo = res.data.data;
            }else{
              console.log("app 获取登录信息失败")
            }
            
          },
          fail:function(){
            
          }
        })
      },
      fail:function(){
        console.log("app-异步获取随机数失败")
        //that.login()
      }
    })

    
  },
  onShow:function(){
    console.log("app onShow")
  },
  login: function (cb) {
    // console.log('调用app.js页面的login函数')
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
            // 参数都获取到了，发送请求
            that.commomlogin(cb,code, latitude, longitude, altitude)
          },
          fail: function () {
            that.commomlogin(cb,code)
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
  //公共login请求
  commomlogin: function (cb,code,latitude, longitude, altitude) {
    var that = this
    var sendData
    var appid = that.globalData.appid
    var secret = that.globalData.secret
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
        // altitude: altitude,//不传海拔高度了
        appid: appid,
        secret: secret
      }
    }
    // console.log(sendData)
    wx.request({
      url: getApp().url + 'wxLogin/login',
      data: sendData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // console.log(latitude, longitude, altitude)
        console.log('app.js文件的login接口成功')
        console.log(res.data)
        if (res.data.status == 200) {
          wx.setStorage({//异步存随机数，在它的回调函数里走原index函数
            key: appid,
            data: res.data.data.thirdSessionId,
            success: function () {
              if (cb){
                cb()
              }
              // console.log('保存随机数成功，开始调用首页数据')
            },
            fail: function () {
              // console.log('保存随机数失败')
            }
          })

        } else if (res.data.status == 400) {
          // var msg = res.data.msg
          // //验证签名失败
          // wx.showToast({
          //   title: 'login' + msg,
          //   duration: 2000
          // })
        }
      }
    });
  },

  getAccessToken(succ){
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxab4355d28417d914&secret=026e8bf6e20155b7d7f926b27db7c5c3',
      success:function(res){
        console.log(res);
        if (res.statusCode === 200) {
          if (succ) {
            succ(res.data);
          }
        } else {
          console.log("请求错误码", res.data.status);
          // if (fail) {
          //   fail(res.data.msg)
          // }
        }
        return res.data;
      }
    })
  },
})



