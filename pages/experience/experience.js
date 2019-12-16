let util = require('../../utils/util.js');
let URL = require('../../utils/URL.js');
const common = require('../../utils/commonConfirm.js');
const app = getApp();
const { 
  requestAppid,
  getBuyDiscountCodeEventList,
  receiveDiscountCodePre
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
    let id = "";
    console.log("onLoad",options);

    //判断分享来源

    //如果是分享 跳转详情
    if (options && options.isShare) {
      console.log("分享", options);
      recommendId = options.recommendId;
      id = options.id;
      flag = 2;
      wx.navigateTo({
        url: '/pages/details/details?id=' + options.id  + '&recommendId=' + recommendId,
      })
    }
    //如果是二维码， 跳转详情
    if (options && options.scene){
      
      let scene = decodeURIComponent(options.scene);
      console.log("二维码", scene);
      //let scene = options.scene;
      let arr = scene.split('&');
      console.log("二维码", arr);
      let length = arr.length;
      let res = {};
      for (var i = 0; i < length; i++) {
        res[arr[i].split('=')[0]] = arr[i].split('=')[1];
      }  
      console.log("二维码", res);
      flag = 1;
      id = res.id;
      recommendId = res.recommendId;
      wx.navigateTo({
        url: '/pages/details/details?id=' + res.id + '&recommendId=' + recommendId,
      })
    }
    
    app.globalData.recommendGiftId = id;
    app.globalData.recommendId = recommendId;
    app.globalData.flag = flag;


    //如果是赠送分享
    if (options && options.isGive) {
      console.log("赠送分享", options);
      
      const discountCodeData = {};
      discountCodeData.customerId = options.customerId;
      discountCodeData.discountCodeId = options.discountCodeId;
      discountCodeData.type = options.type;
      discountCodeData.id = options.id;
      //优惠券赠送领取验证
      that.codeReceiveDiscountCodePre(discountCodeData)
    }

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

  //优惠券赠送领取验证
  codeReceiveDiscountCodePre(data){
    const that =this;
    const param = data;
    requestAppid({
      URL: receiveDiscountCodePre,
      param: param,
    }, function (data) {
      console.log(data);
      // //设置toast时间，toast内容  
      // that.setData({
      //   count: 2000,
      //   toastText: '优惠券已失效'
      // });
      // that.showToast();
      wx.navigateTo({
        url: "/pages/details/details?isGive=true&customerId=" + param.customerId + "&discountCodeId=" + param.discountCodeId + "&type=" + param.type + "&id=" + param.id
      })
    },function(msg){
      //设置toast时间，toast内容  
      that.setData({
        count: 2000,
        toastText: msg || '优惠券已失效'
      });
      that.showToast();
    });
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
    var random = wx.getStorageSync(app.globalData.appid);
    if (random) {//有随机数
      that.buyDiscountCodeEventList()
    } else {
      getApp().login(that.buyDiscountCodeEventList)
    }
    
    // const discountCodeData = {};
    // discountCodeData.customerId = 50072486;
    // discountCodeData.discountCodeId = "21984";
    // discountCodeData.type = 2;
    // discountCodeData.id = 556;
    // //优惠券赠送领取验证
    // that.codeReceiveDiscountCodePre(discountCodeData)
    
    
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