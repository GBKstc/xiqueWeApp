// pages/modifyName/modifyName.js
var common = require('../../utils/commonConfirm.js');
const util = require('../../utils/util.js');
const URL = require('../../utils/URL.js');

const { isEmpty } = util;
const { updateAppointment, addAppointment} = URL;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // random: wx.getStorageSync(getApp().globalData.appid),
    isMa: true,
    phoneValue: '',
    maValue: '',
    //toast默认不显示  
    isShowToast: false,
    isShowToastButton: false,
    count: 3000,
    toastText: '你好',
    isUpdata:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('核对信息页面接收到的addApp', options)
    let { idValue, nameValue, nicknameValue, phoneValue, userId, scheduleid, timeformat, customerId} = options;
    let isUpdata = false;
    if (!isEmpty(nameValue)){
      isUpdata = true;
      //修改页面标题
      wx.setNavigationBarTitle({
        title: "编辑预约人信息",
      })
    }else{
      phoneValue = "";
      nameValue = "";
      isUpdata = false;
      //修改页面标题
      wx.setNavigationBarTitle({
        title: "新增预约人"
      })
    }
    this.setData({
      phoneValue,
      maValue: nameValue,
      idValue,
      isUpdata: isUpdata,
      userId,
      scheduleid,
      timeformat,
      customerId
    })
    wx.showLoading({
      title: '加载中',
      mask: true
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
    wx.hideLoading();
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  //手机号输入事件
  acceptValue: function (e) {
    var value = e.detail.value;
    this.setData({
      phoneValue: value
    })
    // console.log(value)
    var regu = "^[ ]+$"; var re = new RegExp(regu);
    // console.log(value)

    //如果手机号格式正确，姓名格式也正确，确定按钮解禁
    if (/^1[3|4|5|7|8][0-9]{9}$/.test(value) && this.data.maValue.length !== 0 && !re.test(this.data.maValue)) {
      // console.log("chenggong")
      this.setData({
        isMa: false
      })
    } else {
      this.setData({
        isMa: true
      })
    }
  },
  //姓名输入事件
  acceptValidate: function (e) {
    var value = e.detail.value;
    this.setData({
      maValue: value
    })
    //如果手机号格式正确，姓名格式也正确，确定按钮解禁
    var regu = "^[ ]+$"; var re = new RegExp(regu);
    if (this.data.maValue.length !== 0 && !re.test(this.data.maValue) && /^1[3|4|5|7|8][0-9]{9}$/.test(this.data.phoneValue)) {
      console.log("chenggong")
      this.setData({
        isMa: false
      })
    } else {
      this.setData({
        isMa: true
      })
    }
    // }
  },
  //最下面确定按钮
  modifySuccess: function () {
    const that = this;
    const { maValue, phoneValue, isUpdata, idValue, userId, scheduleid, timeformat, customerId } = that.data;
    let reqUrl = "";
    //判断是否是编辑
    if(isUpdata){
      reqUrl = updateAppointment
    }else{
      reqUrl = addAppointment;
    }
    that.setData({//确定按钮禁用
      isMa:true
    })
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        console.log('新增预约人页获取到随机数为')
        console.log(res.data)
        wx.request({
          url: getApp().url + reqUrl,
          method: 'POST',
          data: {
            thirdSessionId: res.data,
            name: maValue,
            mobile: phoneValue,
            id: idValue,
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data.data,"新增顾客ID")
            if (res.data.status === 200) {
              
              wx.redirectTo({
                url: '../checkinfo/checkinfo?nameValue=' + maValue + '&phoneValue=' + phoneValue + '&customerid=' + (res.data.data || customerId) + '&userId=' + userId + '&scheduleid=' + scheduleid + '&timeformat=' + timeformat + '&idValue=' + idValue,
                success: function () {
                 
                }
              })

            } else if (res.data.status === 400) {//失败
              console.log(400)
              var msg = res.data.msg
              //设置toast时间，toast内容  
              that.setData({
                count: 2000,
                toastText: msg
              });
              that.showToast();
            }
            common.status(res, that)//状态401和402
          }
        })

      },
      fail: function () {
        console.log('新增预约人页获取随机数失败')
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