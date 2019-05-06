// pages/time/time.js
var common = require('../../utils/commonConfirm.js');
const hourNow = new Date().getHours()//今天的小时数
const minutsNow = new Date().getMinutes()//今天的分钟数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // random: wx.getStorageSync(getApp().globalData.appid),
    receiveData:'y',//接收首页选时间按钮传过来的值。
    isOk:true,//默认显示有
    allMask:true,//内容框覆盖，切换八天时间用
    // specialMask: false,//平均服务时长小于可用时长模态框
    timeduan:0,//计算已选择的小时数
    // isPartShow:false,//是否显示已选择小时数
    toggleDay:'',//2017-02-12，切换日期，传给时间选人页面
    specialContent:'',
    _num:1,
    istimetocraftman:true,//图像姓名模块默认显示
    timetocraftman:'',//首页时间块传来的唯一值
    isFix:false,
    isclick:true,//禁用底部button按钮
    //下面两个换时间传过来的
    isReplaceTime: '',//是否是点击换时间按钮y是n否
    scheduleServiceId: '',//排班订单id，更换时间时用，从换时间页面传过来的，别的地方不需要
    // toggleX:'',//点击哪个时间块，就等于几,字符串的2，不是number2
    // completeStartTime:'',//这里是'undefined'字符串把首页时间按钮点击传进来的完整时间存下来，如：2017-12-11 12：45：00，带时分秒的，用于判断是否超过今天晚八点
    // avgServiceTime:'',//存平均时长
    month:'',//反显月份
    year: '',//反显年
    day: {},//反显日期,当前的日期，第一天的
    dateObj:{//反显后七天的日期
      'one':{},
      'two': {},
      'three': {},
      'forth': {},
      'five': {},
      'six': {},
      'seven':{}
    },
    isActive:{
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6:false,
      7:false,
      8: false,
      9:false,
      10: false,
      11:false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17:false,
      18:false,
      19: false,
      20: false,
      21: false,
      22: false,
      23:false,
      24:false,
      25: false,
      26: false,
      26: false,
      27:false,
      28: false,
      29: false,
      30: false,
      31: false,
      32: false,
    
    },
    isToggleX: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
      23: false,
      24: false,
      25: false,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
      31: false,
      32: false,
    },
    //下面三个只有跳转到核对信息页面用
    userId: 0,//技师id，上个页面传过来的
    scheduleId: 0,//排班id，这个是这个页面请求过来的数据
    timeFormat: '',//预约时间块，逗号隔开,传给下个页面时，只和返回给我的’平均时长‘有关系，和其他没关系，当点击时间块后，里吗就能得出结果。
    //传值结束
    departmentName:'',//上个页面传过来的，反显用，
    username: '',//上个页面传过来的，反显用，手艺人姓名
    avatarapp: '',//上个页面传过来的，反显用，手艺人图片，到排班页面传过去
    timeData:{
    },
    //toast默认不显示  
    isShowToast: false,
    isShowToastButton: false,
    count: 3000,
    toastText: '你好',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("time",options);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that=this
    
    //获取页面传值
    var userId = options.userId//技师id,必须传
    console.log('技师id'+userId)
    // var day = options.day//日期精确到日,只有从首页时间按钮点击进来时，才有这个参数,我是当做2017-08-01这种格式来算
    var departmentName = decodeURIComponent(options.departmentname)//技师所在门店名称,必须传
    var username = decodeURIComponent(options.username)
    var avatarapp = decodeURIComponent(options.avatarapp)
    // var completeStartTime = decodeURIComponent(options.completestarttime)
    var timetocraftman =decodeURIComponent(options.timetocraftman)
    var infos = decodeURIComponent(options.infos)
    //下面四参数都是从换时间按钮传过来的，一直传到核对修改信息页面(checkmodifyinfo.html)
    var isReplaceTime = decodeURIComponent(options.isreplacetime)
    var scheduleServiceId = decodeURIComponent(options.scheduleserviceid)
    var timeformatshow = decodeURIComponent(options.timeformat)//换时间按钮传来的时间块，把当前时间块变红
    var dayTowhat = decodeURIComponent(options.daytowhat)//换时间按钮传来的2017-02-13,看八天里面的哪一天变红
    var receiveData = decodeURIComponent(options.receivedata)//首页时间按钮传过来的值，别的页面不传
    

    const eventId = options.eventId||"";
    console.log('换时间', isReplaceTime, scheduleServiceId, timeformatshow, dayTowhat)
    //设置初始值
    this.setData({
      userId: userId,
      departmentName: departmentName,
      username: username,
      avatarapp: avatarapp,
      // completeStartTime: completeStartTime,//2017/12/01 12：14：00,兼容ios
      timetocraftman: timetocraftman,
      isReplaceTime: isReplaceTime,
      scheduleServiceId: scheduleServiceId,
      receiveData: receiveData,
      eventId
    })
    console.log('time页面获取参数开始是')
    console.log(options.username, options.username, options.avatarapp, departmentName)
    console.log('转发参数' + infos)
    //获取当前时间currDate，如2017-12-20
    var date=new Date()
    var Y = date.getFullYear() + '-';
    var Yfanxian = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var Mfanxian = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    // var D = date.getDate();
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var currDate=Y+M+D

    //求反显的大写月份
    var MfanxianString = Mfanxian.toString()
    switch (MfanxianString) {
      case '01': that.setData({ month: '一' }); break
      case '02': that.setData({ month: '二' }); break
      case '03': that.setData({ month: '三' }); break
      case '04': that.setData({ month: '四' }); break
      case '05': that.setData({ month: '五' }); break
      case '06': that.setData({ month: '六' }); break
      case '07': that.setData({ month: '七' }); break
      case '08': that.setData({ month: '八' }); break
      case '09': that.setData({ month: '九' }); break
      case '10': that.setData({ month: '十' }); break
      case '11': that.setData({ month: '十一' }); break
      case '12': that.setData({ month: '十二' }); break
    }
    //求反显的年份
    that.setData({
      year: Yfanxian
    })
    // 计算后七天的每一个日期
    var dateObj = that.data.dateObj
    var currD = new Date(currDate)
    var j = 1
    for (var i in dateObj) {
      dateObj[i] = that.qiDate(currD, j)
      j++
    }
    //求第一天星期几
    var week = '今天';
    //更新数据
    that.setData({ day: { 'day': D, 'week': week, 'year': currDate }, dateObj: dateObj })
    //下面是两套逻辑
    //今天，如果过了19，就自动显示第二天的数据
    var hour24 = date.getHours(), mints24 = date.getMinutes()
    console.log(hour24, mints24)
    if (options.timetocraftman==='true'){//时间选人,和换时间进入两种
      // console.log
      wx.hideLoading()
      that.setData({
        istimetocraftman:false,
        isFix: true//一进来就让它绝对定位
      })
      //时间选人,和换时间进入两种情况
      if (that.data.isReplaceTime === 'y') {//换时间进入
        that.setData({ toggleDay: dayTowhat })
        //下面处理对应八天的哪一天，那天就变红********
        //判断换时间按钮传过来的2017-01-12是对应八天的哪一天，那天就变红
        console.log(dateObj)
        switch (dayTowhat) {
          case currDate: that.setData({ _num: 1 }); break
          case that.data.dateObj.one.year: that.setData({ _num: 2 }); break
          case that.data.dateObj.two.year: that.setData({ _num: 3 }); break
          case that.data.dateObj.three.year: that.setData({ _num: 4 }); break
          case that.data.dateObj.forth.year: that.setData({ _num: 5 }); break
          case that.data.dateObj.five.year: that.setData({ _num: 6 }); break
          case that.data.dateObj.six.year: that.setData({ _num: 7 }); break
          case that.data.dateObj.seven.year: that.setData({ _num: 8 }); break
        }
        //下面处理isActive*********
        //判断是不是今天
        var xday = new Date(dayTowhat)
        var jinDate = new Date()//今天时间对象
        // if (that.data.timetocraftman === 'true') {//时间选人
        if (xday.toDateString() == jinDate.toDateString()) {//是今天
          // if (hour24 < 19) {//还没过19点
            that.timetocraftmancommon()
          // }
        }else{//不是今天。（全变红）
          var newisActive = that.data.isActive
          for (var i in newisActive) {//全部红色
            newisActive[i] = true
          }
          that.setData({ isActive: newisActive})
        }
        //下面处理isToggleX********
        //把换时间按钮传过来的时间块变成数组,把对应的时间块点亮
        var arr=timeformatshow.split(',')
        var isToggleX = that.data.isToggleX
        for(var xi=0;xi<arr.length;xi++){
          isToggleX[arr[xi]] =true 
        }
        that.setData({
          isToggleX: isToggleX
        })
        //下面是定位到点亮位置
        that.pageScrollToCommon(parseInt(arr[0]))
        //下面计算已选时间
        var timeduan = (arr.length) * 0.5//计算已选择的小时数
        that.setData({
          timeduan: timeduan
        })
      }else{//时间选人
        if (hour24 < 24) {//今天，还没过21点
          that.timetocraftmancommon()
          that.setData({ toggleDay:currDate})
        } else {//自动显示第二天的数据
          var newisActive = that.data.isActive
          for (var i in newisActive){//全部红色
            newisActive[i] = true
          }
          //计算toggleDay
          var twoms = Date.parse(date) + 1 * 24 * 60 * 60 * 1000
          var twoDate = new Date(twoms)//第二时间对象
          var yy = twoDate.getFullYear();
          var mm = (twoDate.getMonth() + 1 < 10 ? '0' + (twoDate.getMonth() + 1) : twoDate.getMonth() + 1);
          var dd = twoDate.getDate() < 10 ? '0' + twoDate.getDate() : twoDate.getDate();
          var tomorrowd = yy + '-' + mm + '-' + dd
          //更新数据
          that.setData({ isActive: newisActive, _num: 2, toggleDay: tomorrowd })
        }
      }
    }else{//点击美容师进入的 
      that.setData({
        istimetocraftman: true
      })
      if (hour24 < 24) {//今天，还没过21点
        var sendDate = currDate//发送请求需要的时间参数，
        //发送请求
        wx.getStorage({//异步获取随机数
          key: getApp().globalData.appid,
          success: function (res) {
            // console.log('页面获取到随机数为')
            // console.log(res.data)
            wx.request({
              url: getApp().url + 'staff/getScheduleTime',
              method: 'POST',
              data: {
                thirdSessionId: res.data,
                userId: that.data.userId,
                day: sendDate
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                wx.hideLoading()
                console.log(res.data)
                if (res.data.status === 200) {
                  that.setData({
                    timeData: res.data.data,
                    scheduleId: res.data.data.scheduleId
                  })
                  // 重构isActive
                  var sTime = JSON.parse(JSON.stringify(res.data.data.s_time));//可用
                  var oTime = JSON.parse(JSON.stringify(res.data.data.o_time));//
                  var hour = date.getHours()//今天的小时数
                  var minuts = date.getMinutes()//今天的分钟数
                  for (var i = 0; i < sTime.length; i++) {//可用的，把对应的isActive变true
                    var obj = sTime[i]
                    for (var key in obj) {
                      that.setTimeList(obj[key], true,true);
                    }
                  }
                  // 有可能0_time和s_time有重合的，要以o_time为准，所以要后运行o_time,覆盖掉s_time
                  for (var j = 0; j < oTime.length; j++) {//不可用的，把对应的isActive变false
                    var oto = oTime[j]
                    for (var key in oto) {
                      that.setTimeList(oto[key],false);
                    }
                  }
                  //没有2个连续的红时间块，就显示已满
                  var isActive = that.data.isActive
                  var isActiveArr = []//把标红的存入数组
                  for (var t in isActive) {
                    var slod = isActive[t]
                    if (slod) {
                      isActiveArr.push(t)
                    }
                  }
                  console.log('连续时间块数组')
                  console.log(isActiveArr)
                  if (isActiveArr.length > 0) {//数组不为空
                    for (var y = 0; y < isActiveArr.length; y++) {
                      // if (parseInt(isActiveArr[y]) + 1 === parseInt(isActiveArr[y + 1]) && parseInt(isActiveArr[y]) + 2 === parseInt(isActiveArr[y + 2])) {//有三个连续的
                      if (parseInt(isActiveArr[y]) + 1 === parseInt(isActiveArr[y + 1])) {//有两个连续的
                        that.setData({
                          isOk: true
                        },()=>{
                          //调用定位到第一个标红的函数
                          that.pageScrollToCommon(parseInt(isActiveArr[0]));
                        })
                        break;
                      } else {
                        that.setData({
                          isOk: false
                        })
                      }
                    }
                  } else {
                    that.setData({
                      isOk: false
                    })
                  }
                  
                   


                  // }

                } else if (res.data.status === 400) {//失败
                  console.log(400)
                  // var msg = res.data.msg
                  // //设置toast时间，toast内容  
                  that.setData({
                    // count: 2000,
                    // toastText: msg,
                    isOk: false
                  });
                  // that.showToast();
                } else {
                  that.setData({
                    isOk: false
                  })
                }
                common.status(res, that)//状态401和402
              }
            })
          },
          fail: function () {
            console.log('页面获取随机数失败')
          }
        })
      } else{//自动显示第二天的数据
        that.setData({ _num: 2 })
        var twoms = Date.parse(date) + 1 * 24 * 60 * 60 * 1000
        var twoDate = new Date(twoms)//第二时间对象
        var y = twoDate.getFullYear();
        var m = twoDate.getMonth() + 1 < 10 ? '0' + (twoDate.getMonth() + 1) : twoDate.getMonth() + 1;
        var d = twoDate.getDate() < 10 ? '0' + twoDate.getDate() : twoDate.getDate();
        var tomorrowd = y + '-' + m + '-' + d
        var sendDate = tomorrowd//发送请求需要的时间参数，
        //发送请求
        wx.getStorage({//异步获取随机数
          key: getApp().globalData.appid,
          success: function (res) {
            // console.log('页面获取到随机数为')
            // console.log(res.data)
            wx.request({
              url: getApp().url + 'staff/getScheduleTime',
              method: 'POST',
              data: {
                thirdSessionId: res.data,
                userId: that.data.userId,
                day: sendDate
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                wx.hideLoading()
                console.log(res.data)
                if (res.data.status === 200) {
                  that.setData({
                    timeData: res.data.data,
                    scheduleId: res.data.data.scheduleId
                  })
                  // 重构isActive
                  var sTime = JSON.parse(JSON.stringify(res.data.data.s_time));//可用
                  var oTime = JSON.parse(JSON.stringify(res.data.data.o_time));//
                  var jinDate = new Date()//今天时间对象
                  var hour = jinDate.getHours()//今天的小时数
                  var minuts = jinDate.getMinutes()//今天的分钟数
                  for (var i = 0; i < sTime.length; i++) {//可用的，把对应的isActive变true
                    var obj = sTime[i]
                    for (var key in obj) {
                      that.setTimeList(obj[key],true)
                    }
                  }
                  // 有可能0_time和s_time有重合的，要以o_time为准，所以要后运行o_time,覆盖掉s_time
                  for (var j = 0; j < oTime.length; j++) {//不可用的，把对应的isActive变false
                    var oto = oTime[j]
                    for (var key in oto) {
                      that.setTimeList(oto[key],false)
                    }
                  }
                  //没有三个连续的红时间块，就显示已满
                  var isActive = that.data.isActive
                  var isActiveArr = []//把标红的存入数组
                  for (var t in isActive) {
                    var slod = isActive[t]
                    if (slod) {
                      isActiveArr.push(t)
                    }
                  }
                  console.log('连续时间块数组')
                  console.log(isActiveArr)
                  if (isActiveArr.length > 0) {//数组不为空
                    for (var y = 0; y < isActiveArr.length; y++) {
                      if (parseInt(isActiveArr[y]) + 1 === parseInt(isActiveArr[y + 1]) && parseInt(isActiveArr[y]) + 2 === parseInt(isActiveArr[y + 2])) {//有三个连续的
                        that.setData({
                          isOk: true
                        })
                        break;
                      } else {
                        that.setData({
                          isOk: false
                        })
                      }
                    }
                  } else {
                    that.setData({
                      isOk: false
                    })
                  }
                  //调用定位到第一个标红的函数
                  that.pageScrollToCommon(parseInt(isActiveArr[0]))

                  // }

                } else if (res.data.status === 400) {//失败
                  console.log(400)
                  // var msg = res.data.msg
                  // //设置toast时间，toast内容  
                  that.setData({
                    // count: 2000,
                    // toastText: msg,
                    isOk: false
                  });
                  // that.showToast();
                } else {
                  that.setData({
                    isOk: false
                  })
                }
                common.status(res, that)//状态401和402
              }
            })
          },
          fail: function () {
            console.log('页面获取随机数失败')
          }
        })
      }
     
    }
    //下面是独立部分，用到了首页传过来的receiveData值，来判断八天哪个点亮
    // if (receiveData === 'n') {//首页没数据，默认显示第二天的排班
    //   this.setData({
    //     _num: 2,
    //     toggleDay: that.data.dateObj.one.year
    //   },()=>{
    //     that.timetocraftmancommon();
    //   })
    // }
    
  },
  //设置时间列表对象
  setTimeList(itmeString, boolean, isTody){
    const hour = hourNow//今天的小时数
    const minuts = minutsNow//今天的分钟数
    const that = this;
    
    switch (itmeString) {
      case '8:00:00':
        if (!isTody || hour < 8) {//明天，成立，今天小于10点，成立
          var newisActive = that.data.isActive
          newisActive[1] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '8:30:00':
        if (!isTody || hour < 8 || (hour === 8 && minuts < 30)) {//明天，成立，今天小于10点，成立
          var newisActive = that.data.isActive
          newisActive[2] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '9:00:00':
        if (!isTody || hour < 9) {//明天，成立，今天小于10点，成立
          var newisActive = that.data.isActive
          newisActive[3] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '09:30:00':
        //这个判断是今天过了的时间块，置灰掉
        if (!isTody || hour < 9 || (hour === 9 && minuts < 30)) {//明天，成立，今天小于9点，成立，今天小于九点半，成立
          var newisActive = that.data.isActive
          newisActive[4] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '10:00:00':
        if (!isTody || hour < 10) {//明天，成立，今天小于10点，成立
          var newisActive = that.data.isActive
          newisActive[5] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '10:30:00':
        if (!isTody || hour < 10 || (hour === 10 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[6] = boolean
          that.setData({ isActive: newisActive })
        }

        break
      case '11:00:00':
        if (!isTody || hour < 11) {
          var newisActive = that.data.isActive
          newisActive[7] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '11:30:00':
        if (!isTody || hour < 11 || (hour === 11 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[8] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '12:00:00':
        if (!isTody || hour < 12) {
          var newisActive = that.data.isActive
          newisActive[9] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '12:30:00':
        if (!isTody || hour < 12 || (hour === 12 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[10] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '13:00:00':
        if (!isTody || hour < 13) {
          var newisActive = that.data.isActive
          newisActive[11] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '13:30:00':
        if (!isTody || hour < 13 || (hour === 13 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[12] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '14:00:00':
        if (!isTody || hour < 14) {
          var newisActive = that.data.isActive
          newisActive[13] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '14:30:00':
        if (!isTody || hour < 14 || (hour === 14 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[14] = boolean
          that.setData({ isActive: newisActive })
        }

        break
      case '15:00:00':
        if (!isTody || hour < 15) {
          var newisActive = that.data.isActive
          newisActive[15] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '15:30:00':
        if (!isTody || hour < 15 || (hour === 15 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[16] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '16:00:00':
        if (!isTody || hour < 16) {
          var newisActive = that.data.isActive
          newisActive[17] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '16:30:00':
        if (!isTody || hour < 16 || (hour === 16 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[18] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '17:00:00':
        if (!isTody || hour < 17) {
          var newisActive = that.data.isActive
          newisActive[19] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '17:30:00':
        if (!isTody || hour < 17 || (hour === 17 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[20] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '18:00:00':
        if (!isTody || hour < 18) {
          var newisActive = that.data.isActive
          newisActive[21] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '18:30:00':
        if (!isTody || hour < 18 || (hour === 18 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[22] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '19:00:00':
        if (!isTody || hour < 19) {
          var newisActive = that.data.isActive
          newisActive[23] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '19:30:00':
        if (!isTody || hour < 19 || (hour === 19 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[24] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '20:00:00':
        if (!isTody || hour < 20) {
          var newisActive = that.data.isActive
          newisActive[25] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '20:30:00':
        if (!isTody || hour < 20 || (hour === 20 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[26] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '21:00:00':
        if (!isTody || hour < 21) {
          var newisActive = that.data.isActive
          newisActive[27] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '21:30:00':
        if (!isTody || hour < 21 || (hour === 21 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[28] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '22:00:00':
        if (!isTody || hour < 22 ) {
          var newisActive = that.data.isActive
          newisActive[29] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '22:30:00':
        if (!isTody || hour < 22 || (hour === 22 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[30] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '23:00:00':
        if (!isTody || hour < 23) {
          var newisActive = that.data.isActive
          newisActive[31] = boolean
          that.setData({ isActive: newisActive })
        }
        break
      case '23:30:00':
        if (!isTody || hour < 23 || (hour === 23 && minuts < 30)) {
          var newisActive = that.data.isActive
          newisActive[32] = boolean
          that.setData({ isActive: newisActive })
        }
        break
    }
  },
  // 公共计算后七天日期函数
  qiDate:function(currDay,lot){
    var date = new Date(currDay)
    var ms=Date.parse(date) + lot * 24 * 60 * 60 * 1000
    var oneD = new Date(ms)//当前时间对象
    var day = oneD.getDate() < 10 ? '0' + oneD.getDate() : oneD.getDate();//日期
    var Ylate = oneD.getFullYear() + '-';//年份
    var Mlate = (oneD.getMonth() + 1 < 10 ? '0' + (oneD.getMonth() + 1) : oneD.getMonth() + 1) + '-';//月份
    var ymd = Ylate + Mlate + day//2017-01-12

    //求当前星期几
    var week;
    switch (oneD.getDay()) {
      case 0: week = "星期天"; break
      case 1: week = "星期一"; break
      case 2: week = "星期二"; break
      case 3: week = "星期三"; break
      case 4: week = "星期四"; break
      case 5: week = "星期五"; break
      case 6: week = "星期六"; break
    }
    return { 'day': day, 'week': week, 'year': ymd}
  },
  //时间选人公共函数
  timetocraftmancommon:function(){
    var that=this
    var date=new Date()
    const hour24 = hourNow;
    const mints24 = minutsNow;
    const newisActive = that.data.isActive

    let listIndex = (hour24-7)*2 + 1;
    if (mints24<30){
      listIndex = listIndex - 1;
    }
    //如果早于8点 不屏蔽时间
    if(listIndex<=0){
      return false;
    }

    for (let i=listIndex;i<33;i++){
      newisActive[i] = true;
    }
    wx.pageScrollTo({
      scrollTop: 54 * (listIndex-1) + 10,
        duration: 0
      })
    that.setData({ isActive: newisActive })
  },
  //定位到第一个标红的位置公共函数
  pageScrollToCommon:function(scrollto){
    var that=this;
    let durationTime = 0;//定位到第一个标红的位置

    let baseHeight = 115;
    let layerHeight = 56;
    let startIndex = 1;//第一个位置序列号
    
    if (that.data.isOk&&scrollto!=null&&scrollto!=undefined) {
      if(scrollto>6){
        that.setData({
            isFix: true
          })
      }
      console.log('第一个标红的块是发给' + scrollto);
      wx.pageScrollTo({
        scrollTop: layerHeight * (scrollto+startIndex-2) + baseHeight,
        duration: durationTime
      })
    }
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
  onShareAppMessage: function () {
      var that=-this
      // var infos=
      return {
        title: '欢迎预约静博士',
        imageUrl: that.data.avatarapp,
        path: '/pages/time/time?infos=' + encodeURIComponent(that.data.userId) + ',' + encodeURIComponent(that.data.day) + ',' + encodeURIComponent(that.data.departmentName) + ',' + encodeURIComponent(that.data.username) + ',' + encodeURIComponent(that.data.avatarapp),
      
        success: function (res) {
          // 转发成功
          console.log('转发成功')
        },
        fail: function (res) {
          // 转发失败
          console.log('转发失败')
        }
      }
  },
  onPageScroll: function (obj) {
    // this.setData({//一滚动就恢复原始状态
    //   isFixOk:false
    // })
    var that=this
    if (that.data.timetocraftman === 'true'){//时间选人
      this.setData({
        isFix: true
      })
    }else{//点击美容师进来
      if (obj.scrollTop > 122) {
        // console.log("daole")
        this.setData({
          isFix: true
        })
      } else {
        this.setData({
          isFix: false
        })
      }
    }
  },
  // 七个日期切换
  timeSelected:function(e){
    var that=this
    that.setData({
      allMask: false,//打开覆盖层
      timeduan: 0//已选置为0小时
    })
    var isToggleX = that.data.isToggleX
    for (var i in isToggleX){
      isToggleX[i]=false
    }
    that.setData({
      isToggleX: isToggleX,//取消激活时间块
      timeFormat: '',//置空时间块
      isclick: true//禁用底部确定按钮
      // isOk: false//每次先显示已满，有三个连续的再显示时间块
    })
    //红圈切换
    this.setData({
      _num: e.currentTarget.dataset.num
    })
    var sendDate = e.currentTarget.dataset.ymd//2017-02-21
    that.setData({
      toggleDay: sendDate
    })
    //根据当前标签绑定的2017-02-11，来重新设置反显的大写月和年
    //把当前时间转化成时间对象
    var currentClickDate = new Date(sendDate)
    //求反显的大写月份
    var mClick = (currentClickDate.getMonth() + 1 < 10 ? '0' + (currentClickDate.getMonth() + 1) : currentClickDate.getMonth() + 1);
    switch (mClick.toString()) {
      case '01': that.setData({ month: '一' }); break
      case '02': that.setData({ month: '二' }); break
      case '03': that.setData({ month: '三' }); break
      case '04': that.setData({ month: '四' }); break
      case '05': that.setData({ month: '五' }); break
      case '06': that.setData({ month: '六' }); break
      case '07': that.setData({ month: '七' }); break
      case '08': that.setData({ month: '八' }); break
      case '09': that.setData({ month: '九' }); break
      case '10': that.setData({ month: '十' }); break
      case '11': that.setData({ month: '十一' }); break
      case '12': that.setData({ month: '十二' }); break
    }
    //求反显的年份
    that.setData({
      year: currentClickDate.getFullYear(),
    })
    //下面是两套逻辑
    var nowORtomorrow = currentClickDate;
    var jinDate = new Date()//今天时间对象
    if (that.data.timetocraftman === 'true') {//时间选人
      if (nowORtomorrow.toDateString() == jinDate.toDateString()){//是今天
          //今天，如果过了19，显示已满
          var date = new Date()
          var hour19 = date.getHours(), mints19 = date.getMinutes()
        if (hour19 < 24) {//今天，还没过21
          //  先置灰所有的时间块
          var resetIsActive = that.data.isActive
          for (var i in resetIsActive) {
            resetIsActive[i] = false
          }
          that.setData({
            isActive: resetIsActive,//置灰所有的时间块
          })
          that.timetocraftmancommon()
        } else {
          that.setData({
            isOk: false
          })
        }
      }else{//不是今天
        wx.pageScrollTo({//因为初始化时，已经改变了scrollTop值，这里初始化一下
          scrollTop: 0,
          duration: 0
        })
        var resetIsActive = that.data.isActive
        for (var i in resetIsActive) {
          resetIsActive[i] = true
        }
        that.setData({
          isActive: resetIsActive//全部红色
        })
      }
      that.setData({
        allMask: true//关闭覆盖层
      })
    }else{//点击美容师进来的
      //  先置灰所有的时间块
      var resetIsActive = that.data.isActive
      for (var i in resetIsActive) {
        resetIsActive[i] = false
      }
      that.setData({
        isActive: resetIsActive,//置灰所有的时间块
      })
      //这里分是不是今天两种情况
      if (nowORtomorrow.toDateString() == jinDate.toDateString()) {//是今天
        //今天，如果过了19，显示已满
        var date = new Date()
        var hour19 = date.getHours(), mints19 = date.getMinutes()
        if (hour19 < 24) {//今天，还没过21
          that.timeSelectedcommon(currentClickDate,sendDate,function (){
            that.setData({
              allMask: true//关闭覆盖层
            })
          })
        } else {
          that.setData({
            isOk: false,
            allMask: true//关闭覆盖层
          })
        }
      } else {//不是今天
        that.timeSelectedcommon(currentClickDate, sendDate, function () {
          that.setData({
            allMask: true//关闭覆盖层
          })
        })
      }
    }
    // that.setData({
    //   allMask: true//关闭覆盖层
    // })
  },
  // 七个日期切换公共函数
  timeSelectedcommon: function (currentClickDate, sendDate, allMaskCallBack){
      var that=this
      //发送请求
      wx.getStorage({//异步获取随机数
        key: getApp().globalData.appid,
        success: function (res) {
          console.log('页面获取到随机数为')
          console.log(res.data)
          wx.request({
            url: getApp().url + 'staff/getScheduleTime',
            method: 'POST',
            data: {
              thirdSessionId: res.data,
              userId: that.data.userId,
              day: sendDate
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res.data)
              if (res.data.status === 200) {
                //下面2个值可能会变，所以切换时，重新赋值
                that.setData({
                  timeData: res.data.data,
                  scheduleId: res.data.data.scheduleId
                })
                //下面，所有的判断的前提是，明天或者不晚于19：00
                var nowORtomorrow = currentClickDate;
                var jinDate = new Date()//今天时间对象
                if (nowORtomorrow.toDateString() !== jinDate.toDateString() || jinDate.getHours() < 23) {//第一个比是不是今天，不是今天，那就是明天，成立，或者，第二个，是今天，比大小，小于晚八点，成立。其他情况就只剩今天晚八点以后了，这种就是全部灰色，就是默认色，不需要处理
                  // 重构isActive
                  // console.log('明天或小于当前1')
                  var sTime = JSON.parse(JSON.stringify(res.data.data.s_time));//可用
                  var oTime = JSON.parse(JSON.stringify(res.data.data.o_time));//
                  var hour = jinDate.getHours()//今天的小时数
                  var minuts = jinDate.getMinutes()//今天的分钟数
                  // console.log(sTime)
                  for (var i = 0; i < sTime.length; i++) {//可用的，把对应的isActive变true
                    var obj = sTime[i]
                    for (var key in obj) {
                      console.log(nowORtomorrow.toDateString(),jinDate.toDateString())
                      that.setTimeList(obj[key], true,nowORtomorrow.toDateString() == jinDate.toDateString());
                    }
                  }
                  // 有可能0_time和s_time有重合的，要以o_time为准，所以要后运行o_time,覆盖掉s_time
                  for (var j = 0; j < oTime.length; j++) {//不可用的，把对应的isActive变false
                    var oto = oTime[j]
                    for (var key in oto) {
                      that.setTimeList(oto[key],false)
                    }
                  }
                  //没有三个连续的红时间块，就显示已满
                  var isActive = that.data.isActive
                  var isActiveArr = []//把标红的存入数组
                  for (var t in isActive) {
                    var slod = isActive[t]
                    if (slod) {
                      isActiveArr.push(t)
                    }
                  }
                  console.log('标红的数组是')
                  console.log(isActiveArr)
                  if (isActiveArr.length > 0) {//数组不为空
                    for (var y = 0; y < isActiveArr.length; y++) {
                      if (parseInt(isActiveArr[y]) + 1 === parseInt(isActiveArr[y + 1]) && parseInt(isActiveArr[y]) + 2 === parseInt(isActiveArr[y + 2])) {//有三个连续的
                        that.setData({
                          isOk: true
                        },()=>{
                          console.log("去层后的回调");
                          that.pageScrollToCommon(parseInt(isActiveArr[0])) 
                        })
                        //调用定位到第一个标红的函数
                        // setTimeout(function () { that.pageScrollToCommon(parseInt(isActiveArr[0])) }, 200)
                        break;
                      } else {
                        that.setData({
                          isOk: false
                        })
                      }
                    }
                  } else {
                    that.setData({
                      isOk: false
                    })
                  }
                } else {//是今天，过了19点了，显示已满
                  that.setData({
                    isOk: false
                  })
                }
              } else if (res.data.status === 400) {//失败
                console.log(400)
                // var msg = res.data.msg
                // //设置toast时间，toast内容  
                that.setData({
                  // count: 500,
                  // toastText: msg,
                  isOk: false
                });
                // that.showToast();
              } else {
                that.setData({
                  isOk: false
                })
              }
              allMaskCallBack()//回调函数
              common.status(res, that)//状态401和402
            }
          })
        },
        fail: function () {
          console.log('页面获取随机数失败')
        }
      })
  },
  // 点击时间块
  changeActive:function(e){
      var that=this
      var num=e.currentTarget.dataset.num
      var numNum=parseInt(num)//转换为数字类型
      console.log(numNum)
      //判断是否要放大激活
      if (that.data.isActive[numNum]===true){
          // console.log(num)
          // var xx = that.data.isToggleX[num],transxx=
          //时间块切换显示
          var isActive = that.data.isActive
          var isToggleX = that.data.isToggleX
          //每次点击之后，先要判断已经点亮的时间块
          var arr=[]
          for (var i in isToggleX){
            if (isToggleX[i]){
              var intI = parseInt(i)
              arr.push(intI)
            }
          }
          if (arr.length === 0){
            isToggleX[numNum] = !isToggleX[numNum]
            that.setData({
              isToggleX: isToggleX,
              timeduan: 0.5
            })
          } else if (arr.length === 1){
      
            var arrOne = parseInt(arr[0])
          
            if (numNum === arrOne) {
              var timeduan = 0;//计算已选择的小时数
              isToggleX[numNum] = !isToggleX[numNum]
              that.setData({
                isToggleX: isToggleX,
                timeduan: timeduan
              })
            } else {//不连续
              console.log('1个不连续')
              if (numNum<arrOne){
                that.changex(numNum, arrOne)
              } else if (numNum > arrOne){
                that.changex(arrOne, numNum)
              }
            }
          } else{
            // console.log('其他')
            //取出数组里的最小值和最大值
            var min = Math.min.apply(null, arr);//最小值
            var max = Math.max.apply(null, arr);//最大值
            console.log(min,max)
            //四种区间情况
            if (numNum < min) {
              // console.log('小于')
              that.changex(numNum, min)
            } else if (min < numNum && numNum< max) {
              // console.log('中间')
              //后面时间块的熄灭，当前不熄灭
              for (var e in isToggleX) {
                if (numNum < e && e <= max) {//在这个区间遍历
                  isToggleX[e] = false
                  that.setData({
                    isToggleX: isToggleX
                  })
                }
              }
              //遍历完成之后，开始计算点亮的个数，来计算timeFormat,isclick
              var timeFormatArr = []
              var timeFormat = ''
              for (var tt in isToggleX) {
                if (isToggleX[tt]) {
                  timeFormatArr.push(parseInt(tt))
                }
              }
              var timeduan = (timeFormatArr.length) * 0.5//计算已选择的小时数
              if (timeFormatArr.length >= 2) {
                timeFormat = timeFormatArr.join(',')
                that.setData({
                  timeFormat: timeFormat,
                  isclick: false,
                  timeduan: timeduan//更新小时数
                  // isPartShow: true//已选择小时数显示
                })
              } else {
                console.log('xxxxx')
                that.setData({
                  isclick: true,
                  timeduan: timeduan//更新小时数
                  // isPartShow: false//已选择小时数隐藏
                })
              }
              console.log('计算后的时间块')
              console.log(timeFormat)
            } else if (numNum > max) {
              // console.log('大于')
              that.changex(max, numNum)
            } else if (numNum === min || numNum === max){
              //只切换当前状态
              isToggleX[numNum] = !isToggleX[numNum]
              that.setData({
                isToggleX: isToggleX
              })
              //遍历完成之后，开始计算点亮的个数，来计算timeFormat,和isclick
              var timeFormatArr = []
              var timeFormat = ''
              for (var tt in isToggleX) {
                if (isToggleX[tt]) {
                  timeFormatArr.push(parseInt(tt))
                }
              }
              var timeduan = (timeFormatArr.length) * 0.5//计算已选择的小时数
              if (timeFormatArr.length >= 2) {
                timeFormat = timeFormatArr.join(',')
                that.setData({
                  timeFormat: timeFormat,
                  isclick: false,
                  timeduan: timeduan//更新小时数
                  // isPartShow: true//已选择小时数显示
                })
              } else {
                that.setData({
                  isclick: true,
                  timeduan: timeduan//更新小时数
                  // isPartShow: false//已选择小时数隐藏
                })
              }
              console.log('计算后的时间块')
              console.log(timeFormat)

            }
          }
      }
  },
  //点击时间块判断是否有交叉，无交叉就全部点亮，有交叉就提示
  changex:function(min,max){
    // console.log('进入公共时间')
    var that=this
    var isActive = that.data.isActive
    var isToggleX = that.data.isToggleX
    var isx = 1//没有灰色
    // 先判断是否有交叉
    // 确定isx的值
    for (var q in isActive) {
      if (min < q && q < max) {//在这个区间遍历
        console.log('q是'+q)
        if (!isActive[q]) {//中间有灰色块
          isx = 0
          break
        } else {
          isx = 1
        }
      }
    }
    //有和没有交叉两种情况
    if (isx === 1) {//没有灰色
      // console.log('没有灰色')
      //区间都点亮
      for (var w in isToggleX) {
        // console.log('没')
        if (min <= w && w <= max) {//在这个区间全部变红
          // console.log('comein',w)
          isToggleX[w] = true
          that.setData({
            isToggleX: isToggleX
          })
        }
      }
      //遍历完成之后，开始计算点亮的个数，来计算timeFormat,和isclick
      var timeFormatArr=[]
      var timeFormat=''
      for (var tt in isToggleX){
        if (isToggleX[tt]){
          timeFormatArr.push(parseInt(tt))
        }
      }
      if (timeFormatArr.length>=2){
        timeFormat = timeFormatArr.join(',')
        var timeduan = (timeFormatArr.length)*0.5//计算已选择的小时数
        that.setData({
          timeFormat: timeFormat,
          isclick:false,
          timeduan: timeduan//更新小时数
          // isPartShow:true//已选择小时数显示
        })
      }else{
        that.setData({
          isclick: true
          // isPartShow: false//已选择小时数隐藏
        })
      }
      console.log('计算后的时间块')
      console.log(timeFormat)
    } else if (isx === 0) {//有灰色
      console.log('有灰色')
      //设置toast时间，toast内容  
      that.setData({
        count: 1000,
        toastText: '只能选择连续时间哟'
      });
      that.showToast();
    }
  },
  //点击确定按钮
  toPages:function(){
    console.log('确定按钮')
    var that = this
    //前提条件是确定可点，加个判断更可靠
    if (!that.data.isclick){
      var userId = this.data.userId//技师id
      var scheduleId = this.data.scheduleId//排班id
      var timeFormat = this.data.timeFormat//预约时间块，逗号隔开
      var toggleDay = this.data.toggleDay//精确到天，传给craftsmantime页面
      var isReplaceTime = this.data.isReplaceTime
      var scheduleServiceId = this.data.scheduleServiceId
      const eventId = this.data.eventId;
      // 分两种情况
      if (that.data.timetocraftman === 'true'){
          wx.navigateTo({
            url: '../craftsmantime/craftsmantime?timeformat=' + timeFormat + '&toggleDay=' + toggleDay + '&isreplacetime=' + isReplaceTime + '&scheduleserviceid=' + scheduleServiceId + '&eventId=' + eventId,
            success: function () {
            }
          })
      }else{
        //检查是否登录,登录返回登录信息 
        wx.getStorage({//异步获取随机数
          key: getApp().globalData.appid,
          success: function (res) {
            console.log('页面获取到随机数为')
            console.log(res.data)
            wx.request({
              url: getApp().url + 'user/checkLogin',
              data: {
                thirdSessionId: res.data
              },
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                console.log(res)
                var obj = {};
                if (res.data.status === 200) {
                  if (res.data.data.login) {//登录了,去核对信息页面
                    wx.navigateTo({
                      url: '../checkinfo/checkinfo?userId=' + userId + '&scheduleid=' + scheduleId + '&timeformat=' + timeFormat,
                      success: function () {
                      }
                    })
                  } else if (!res.data.data.login) {//没登录，去登陆页面
                    console.log('没登录了')
                    wx.navigateTo({
                      url: '../login/login?userId=' + userId + '&scheduleid=' + scheduleId + '&timeformat=' + timeFormat + '&howto=' + true,
                      success: function () {
                      }
                    })

                  }
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
              },
              fail: function (res) {
                //设置toast时间，toast内容  
                that.setData({
                  count: 2000,
                  toastText: '网络错误'
                });
                that.showToast();
              }
            })
          },
          fail: function () {
            console.log('页面获取随机数失败')
          }
        })
      }
    }
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