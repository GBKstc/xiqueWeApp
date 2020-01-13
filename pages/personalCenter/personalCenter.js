// pages/personalCenter/personalCenter.js
var common = require('../../utils/commonConfirm.js');
let URL = require('../../utils/URL.js');
let util = require('../../utils/util.js');
const app = getApp();
const config = require('../../utils/config');
const { myInfo, requestAppid, request, wxLogin, getServiceTelephone, companyInfo, getWeixinModuleShowIs } = URL;
const { isEmpty, isLogin, isRandom } = util;
const { imgUrl } = config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    // random: wx.getStorageSync(getApp().globalData.appid),
    isLogin: true, //true 代表未登录
    avatarUrl: '../../image/login.png',
    maxname: "",//姓名截取之后的值
    customInfo: {
      name: '',
      mobile: 0
    },
    telephone: "",
    signOutMask: false,//点击退出登录提示框
    //toast默认不显示  
    isShowToast: false,
    isShowToastButton: false,
    count: 3000,
    toastText: '你好'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //隐藏分享
    wx.hideShareMenu();
    //wx.getSystemInfo 获取基础版本库
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          SDKVersion: res.SDKVersion
        })
      },
    })
    
    //如果是二维码,且sence有form=code 判断登录 如果已经登录 去消费确认 如果没登录去登录页面 
    if (options && options.scene) {
      let scene = decodeURIComponent(options.scene);
      let arr = scene.split('&');
      let length = arr.length;
      let res = {};
      for (var i = 0; i < length; i++) {
        res[arr[i].split('=')[0]] = arr[i].split('=')[1];
      }
      if(res.form == "code"){
        this.setData({
          showOrder:true
        })
        app.globalData.showOrder = true;
      }      
    } else if (options){
      if (options.form == "code") {
        this.setData({
          showOrder: true
        })
        app.globalData.showOrder = true;
      }      
    }

    this.getWeixinModuleShow();
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    that.checkLogin();
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
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage:function () {

  // },

  getTelephone(){
    var that = this;
    requestAppid({
      URL: getServiceTelephone
    }, (data)=>{
      that.setData({
        telephone: data//更新客服电话
      })
    },(msg)=>{
      //设置toast时间，toast内容  
      that.setData({
        count: 2000,
        toastText: msg
      });
      that.showToast();
    })
  },
  //控制小程序功能模块是否展示  n是不展示，其他情况都展示 医美版本临时接口
  getWeixinModuleShow(){
    var that = this;
    requestAppid({
      URL: getWeixinModuleShowIs
    }, (data) => {
      that.setData({
        moduleShowIs: data
      })
    })
  },

  checkLogin(){
    var that = this;
    isLogin(() => {
      // app.globalData.showOrder = false;
      //如果有登陆 获取登陆信息
      that.getTelephone();//获取客服电话
      that.getCompanyInfo();//获取公司信息
      that.getMyInfo();  //获取个人信息
      that.setData({
        isLogin: false
      })
    },()=>{
      that.getTelephone();//获取客服电话
      that.getCompanyInfo();//获取公司信息
      if (app.globalData.showOrder == true){
        app.globalData.showOrder = false;
        //未登录
        wx.navigateTo({
          url: '../login/login',
        })
      }
      
    },()=>{
      isRandom(() => {
        that.getTelephone();//获取客服电话
        that.getCompanyInfo();//获取公司信息
        if (app.globalData.showOrder == true) {
          app.globalData.showOrder = false;
          //未登录
          wx.navigateTo({
            url: '../login/login',
          })
        }
      })
    });
  },

  getPhoneNumber(e) {
    wx.checkSession({
      success() {
        // console.log("还在登录")
        //session_key 未过期，并且在本生命周期一直有效
        //直接调用登录接口
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: res => {
            const data = {
              code: res.code,
              appid: getApp().globalData.appid,
              secret: getApp().globalData.secret,
            };
            request(
              { URL: wxLogin, param: data },
              ({ data }) => {
                if (data.status == 200) {
                  //异步存随机数，在它的回调函数里
                  wx.setStorage({
                    key: appid,
                    data: data.data.thirdSessionId,
                    success: function () {},
                    fail: function () {}
                  })

                  //调用登录接口
                }
              }
            )
          },
        }) //重新登录
      }
    })
  },

  getMyInfo() {
    const that = this;
    requestAppid({
      URL: myInfo,
    }, function (res) {
      that.setData({
        isWeixinShowCardInfo: res.isWeixinShowCardInfo || "",
        confirmServiceId: res.confirmServiceId || "", //待服务单id
        waitScheduleService: res.waitScheduleService || "", //待服务单个数
        waitEvaluateGiftCount: res.waitEvaluateGiftCount || "",//待抽奖
        waitEvaluateCount: res.waitEvaluateCount || "",//待评价服务单数
        useDays: res.useDays,//使用喜报天数
      })

      if(app.globalData.showOrder==true){
        wx.navigateTo({
          url: "../orderDetail/orderDetail?status=0&serviceId=" + (res.confirmServiceId||""),
          success: function () {
          }
        })
        app.globalData.showOrder=false;
      }
    })
  },

  getCompanyInfo() {
    // companyInfo
    const that = this;
    requestAppid({
      URL: companyInfo,
    }, function (res) {
      console.log(res);
      that.setData({
        isShowConfirmService: res.isShowConfirmService,//是否显示待确认消费
        companyName: res.companyName,//是否显示待确认消费
      })
      app.globalData.companyName = res.companyName;
    })
  },

  //点击登录
  tologin: function () {
    wx.navigateTo({
      url: '../login/login?howto=' + false,
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //查看订单
  toOrder: function () {
    var that = this
    if (!that.data.isLogin) {//登录了
      wx.navigateTo({
        url: '../order/order',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {//没登录
      //设置toast时间，toast内容  
      that.setData({
        count: 2000,
        toastText: '请先登录'
      });
      that.showToast();
    }
  },
  //联系客服
  makePhoneCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.telephone,
      success: function () {
      },
      fail: function () {}
    })
  },
  
  select: function (e) {
    console.log(e.currentTarget.dataset.url);
    const goToUrl = e.currentTarget.dataset.url;
    if (isEmpty(e.currentTarget.dataset.url)){
      return false;
    }
    var that = this
    if (!that.data.isLogin) {//登录了
      wx.navigateTo({
        url: goToUrl,
        success: function () {
        }
      })
    } else {//没登录

      that.tologin();
      //设置toast时间，toast内容  
      // that.setData({
      //   count: 2000,
      //   toastText: '请先登录'
      // });
      // that.showToast();
    }
    
  },
  //修改姓名
  // toModifyName:function(){
  //   var that=this
  //   wx.navigateTo({
  //     url: '../modifyName/modifyName?name=' + that.data.customInfo.name,
  //     success: function (res) {
  //     },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // },
  //修改手机号
  toModifyPhone: function () {
    var that = this
    wx.navigateTo({
      url: '../modifyPhone/modifyPhone?mobile=' + that.data.customInfo.mobile,
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击退出
  signOut: function () {
    this.setData({
      signOutMask: true
    })
  },
  //弹框上的‘退出登录’
  signOutSuccess: function () {
    this.setData({
      signOutMask: false
    })
    var that = this
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        //退出登录
        wx.request({
          url: getApp().url + 'user/loginOut',
          data: {
            thirdSessionId: res.data
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            // console.log(res)
            var obj = {};
            if (res.data.status === 200) {
              that.setData({
                isLogin: true//隐藏姓名和手机号
              })
            } else{//失败
              console.log(400)
              var msg = res.data.msg
              //设置toast时间，toast内容  
              that.setData({
                count: 2000,
                toastText: msg
              });
              that.showToast();
            }
            // common.status(res, that)//状态401和402   
          },
          fail: function (res) {
            //设置toast时间，toast内容  
            that.setData({
              count: 2000,
              toastText: '网络错误',
              isLogin: true//隐藏姓名和手机号
            });
            that.showToast();
          }
        })
      },
      fail: function () {
        console.log('个人中心获取随机数失败')
      }
    })
  },
  //弹框上的‘取消’
  signOutFail: function () {
    this.setData({
      signOutMask: false
    })
  },
  //门店导航
  tostoreDistribution: function () {
    wx.navigateTo({
      url: '../storeDistribution/storeDistribution?fromWhere=false',
      success: function () {
      }
    })
  },

 
  //显示自定义提示框
  showToast: function () {
    var _this = this;
    common.showToast(_this)
  },
  //提示框的确定按钮
  buttonConfirm: function () {
    var _this = this
    common.buttonConfirm(_this)
  },
  //提示框的去登陆按钮
  toAgainLogin: function () {
    var _this = this
    common.toAgainLogin(_this)
  }
})