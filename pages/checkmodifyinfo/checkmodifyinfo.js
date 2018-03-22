// pages/checkinfo/checkinfo.js
var common = require('../../utils/commonConfirm.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // random: wx.getStorageSync(getApp().globalData.appid),
    confirmDisabled:true,//确定按钮
    appointmentId: 0,//当前用户id,初始化和获取预约人列表都可以获得
    nameValue:"",//初始化时本人的姓名，用于传给服务器参数
    storeValue:'',
    scheduleServiceId:'',//换时间页面传过来的
    // maxnameValue:"",//姓名大于四个字符时，截取前四个
    // nicknameValue: "",//初始化时本人的昵称，用于显示，小程序里面优先显示昵称，没有昵称，显示姓名
    // phoneValue:"",//初始化时本人的手机号
    userId: 0,//技师id
    customerId:0,//去做服务人的id,可能是本人，也可能是别人
    scheduleId:0,//排班id
    timeFormat: '',//预约时间块，逗号隔开
    type:0,//0自己预约1帮别人预约
    recordData:{}
  },
  bindPickerChange: function (e) {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 上一个页面传过来的参数,提价预约时用
    var userId = options.userid//技师id
    var scheduleId = options.scheduleid//排班id
    var timeFormat = options.timeformat//预约时间块，逗号隔开
    var scheduleserviceid = options.scheduleserviceid//
    var username = options.username//
    var storename = options.storename//
    var toggleDay = options.toggleDay//
    console.log('核对修改信息页面接收到的userId', userId, scheduleId, timeFormat, username, storename, toggleDay)
    //下面都是求反显的东西
    var dak=toggleDay.replace(/-/g,'/')
    var recordData = that.data.recordData
    recordData.date=dak
    var arr = timeFormat.split(','),startPart='',endPart=''
    //开始点
    switch (arr[0]) {
      case '4': startPart='09:30'; break
      case '5': startPart = '10:00'; break
      case '6': startPart = '10:30'; break
      case '7': startPart = '11:00'; break
      case '8': startPart = '11:30'; break
      case '9': startPart = '12:00'; break
      case '10': startPart = '12:30'; break
      case '11': startPart = '13:00'; break
      case '12': startPart = '13:30'; break
      case '13': startPart = '14:00'; break
      case '14': startPart = '14:30'; break
      case '15': startPart = '15:00'; break
      case '16': startPart = '15:30'; break
      case '17': startPart = '16:00'; break
      case '18': startPart = '16:30'; break
      case '19': startPart = '17:00'; break
      case '20': startPart = '17:30'; break
      case '21': startPart = '18:00'; break
      case '22': startPart = '18:30'; break
      case '23': startPart = '19:00'; break
      case '24': startPart = '19:30'; break
      case '25': startPart = '30:00'; break
    }
    //结束点
    switch (arr[arr.length-1]) {
      case '4': endPart = '09:30'; break
      case '5': endPart = '10:00'; break
      case '6': endPart = '10:30'; break
      case '7': endPart = '11:00'; break
      case '8': endPart = '11:30'; break
      case '9': endPart = '12:00'; break
      case '10': endPart = '12:30'; break
      case '11': endPart = '13:00'; break
      case '12': endPart = '13:30'; break
      case '13': endPart = '14:00'; break
      case '14': endPart = '14:30'; break
      case '15': endPart = '15:00'; break
      case '16': endPart = '15:30'; break
      case '17': endPart = '16:00'; break
      case '18': endPart = '16:30'; break
      case '19': endPart = '17:00'; break
      case '20': endPart = '17:30'; break
      case '21': endPart = '18:00'; break
      case '22': endPart = '18:30'; break
      case '23': endPart = '19:00'; break
      case '24': endPart = '19:30'; break
      case '25': endPart = '30:00'; break
    }
    recordData.timeDuan=arr.length*0.5
    recordData.timePart = startPart + ' - ' + endPart
    // 求是否是今，明，后天，后者是星期几
    var now = new Date(toggleDay),week=''
    var jinDate = new Date()//今天时间对象
    var mingms = Date.parse(jinDate) + 1 * 24 * 60 * 60 * 1000
    var mingDate = new Date(mingms)//明天时间对象
    var houms = Date.parse(jinDate) + 2 * 24 * 60 * 60 * 1000
    var houDate = new Date(houms)//后天时间对象
    if (now.toDateString() === jinDate.toDateString()) {
      week = '今天'
    } else if (now.toDateString() === mingDate.toDateString()) {
      week = '明天'
    } else if (now.toDateString() === houDate.toDateString()) {
      week = '后天'
    } else {
      switch (now.getDay()) {
        case 0: week = "星期天"; break
        case 1: week = "星期一"; break
        case 2: week = "星期二"; break
        case 3: week = "星期三"; break
        case 4: week = "星期四"; break
        case 5: week = "星期五"; break
        case 6: week = "星期六"; break
      }
    }
    recordData.week = week



    that.setData({
      userId: userId,
      scheduleId: scheduleId,
      timeFormat: timeFormat,
      scheduleServiceId: scheduleserviceid,
      nameValue: username,
      storeValue: storename,
      recordData: recordData
    })
    //获取本人id
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        // console.log('页面获取到随机数为')
        // console.log(res.data)
        wx.request({
          url: getApp().url + 'user/getCurrentUser',
          method: 'POST',
          data: {
            thirdSessionId: res.data
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            that.setData({//解禁确定按钮
              confirmDisabled: false
            });
            console.log(res.data)
            if (res.data.status === 200) {
              that.setData({
                phoneValue: res.data.data.mobile,
                appointmentId: res.data.data.id//data里的appointmentId用来存本人id,便于后期比较type值
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
        console.log('页面获取随机数失败')
      }
    })
    //获取去做服务人的id（customid）
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        wx.request({
          url: getApp().url + 'schedule/getUserInfo',
          method: 'POST',
          data: {
            thirdSessionId: res.data,
            scheduleServiceId: that.data.scheduleServiceId
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            that.setData({//解禁确定按钮
              confirmDisabled: false
            });
            console.log(res.data)
            if (res.data.status === 200) {
              console.log('获取customerId',res.data.data)
              that.setData({
                customerId: res.data.data//data里的customerId,便于后期比较type值
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
        console.log('页面获取随机数失败')
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      setTimeout(function() {
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
  //点击确定修改
  modifySuccess:function(){
    var that=this
    that.setData({//点击确定，立马禁用掉确定按钮
      confirmDisabled: true
    });
    if (that.data.appointmentId === that.data.customerId){//本人预约
        that.setData({
          type:0
        })
    } else {//帮别人预约
      that.setData({
        type: 1
      })
    }
    //预约请求
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        console.log('核对信息页获取到随机数为')
        console.log(res.data)
        var sendData={
          thirdSessionId: res.data,
          type: that.data.type,
          mobile: that.data.phoneValue,
          userId: that.data.userId,
          customerId: that.data.customerId,
          scheduleId: that.data.scheduleId,
          timeFormat: that.data.timeFormat,
          scheduleServiceId: that.data.scheduleServiceId
        }
        // 打印预约请求参数
        console.log('预约请求参数')
        console.log(sendData)
        wx.request({
          url: getApp().url + 'schedule/addOrder',
          method: 'POST',
          data: sendData,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data)
            if (res.data.status === 200) {

              wx.redirectTo({
                url: '../success/success?towhere=back',
                success: function () {
                 
                }
              })
            } else if (res.data.status === 400 || res.data.status === 403 || res.data.status === 404 || res.data.status === 405) {//失败
              // console.log(400)
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
        console.log('核对信息页获取随机数失败')
      }
    })
    
  },
  //点击取消修改
  modifyPre:function(){
    var that=this
    wx.navigateBack({
      delta: 2
    })
  },
 
  detailAppoint:function(e){
    var nameValue = e.currentTarget.dataset.name
    var phoneValue = e.currentTarget.dataset.phone
    var idValue = e.currentTarget.dataset.id
    var that = this
    //发送请求
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        // console.log('页面获取到随机数为')
        // console.log(res.data)
        wx.request({
          url: getApp().url + 'user/updateAppointment',
          method: 'POST',
          data: {
            thirdSessionId: res.data,
            name: nameValue,
            mobile: phoneValue,
            id: idValue,
            del: 'y'
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data)
            if (res.data.status === 200) {
              //隐藏列表
              that.setData({
                isMask: false,
                animationDataL: ''//左滑归位
              })
              var msg = res.data.msg
              //设置toast时间，toast内容  
              that.setData({
                count: 1500,
                toastText: '删除成功'
              });
              that.showToast();
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
        console.log('页面获取随机数失败')
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