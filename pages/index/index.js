// pages/ONE/one.js
const common = require('../../utils/commonConfirm.js');
const util = require('../../utils/util');
const URL = require('../../utils/URL');
const config = require('../../utils/config');
const { imgUrl} = config;
const { isLogin, throttle } = util;
const app = getApp();
const { requestAppid, getWeixinPostCodeName, getWeixinModuleShowIs} = URL;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,


    // random: wx.getStorageSync(getApp().globalData.appid),
    receiveData: 'y',//默认首页有排班，有接收到数据，就是传过来有data参数，没有排班的话，就不传data参数。
    name:'',//输入框值
    isloadingMask1:true,//loading弹框‘加载中’
    isloadingMask2: false,//loading弹框‘没有合适手艺人’
    // isFirst: true,//loading弹框‘没有合适手艺人’ 只有第一次显示
    disabled:true,//马上预约按钮是否禁用
    near:false,//新客显示，老客不显示，默认不显示
    degree:false,//是否授权经纬度
    kong:false,//默认没找到页面不显示
    pullOk:false,//是否允许上拉触底，默认不允许
    departmentid:0,
    departmentname:'',
    completeStartTime:'',//完整的开始预约时间，2017-12-10 11：30:20,用于传给排班页面用
    scheduleId: 0,//排班id,点击马上预约到核对信息页面，和登录页面要用
    timeFormat:'',//预约时间块,点击马上预约到核对信息页面，和登录页面要用
    day:'',//精确到日的时间，点击时间按钮到排班页面要用
    userId:0,//手艺人
    departmentName:'',//手艺人所在门店名称，点击时间按钮到排班页面要用
    username:'',//手艺人姓名
    avatarapp:'',//手艺人图片，到排班页面传过去
    pageNo: 1,//默认初始化是第一页
    totalPages: 0,//总页数
    isAllShow: false,//包含搜索框的初始页面
    isShow:true,//初始页面
    // isSearchShow: false,//搜索手艺人模板页面
    longitude: '',
    latitude: '',
   // isPeopleShow: false//点击手艺人模板页面
    //搜索手艺人数据
    searchData: [
      // { distance: '2.6', departmentName: '西湖银泰店', departmentId: 3, id: 4, username: '张与', avatarapp:'../../image/peopleLogo.png'}
      ],
    //页面数据
    startData: null,
    //toast默认不显示  
    isShowToast: false,
    isShowToastButton: false,
    count: 3000,
    toastText: '你好',



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    var app = getApp()
    var random = wx.getStorageSync(app.globalData.appid);
    if (random) {//有随机数
      that.loadHou(random)//调用原index里的函数. 
      //控制小程序功能模块是否展示  n是不展示，其他情况都展示 医美版本临时接口
      that.getWeixinModuleShow();
      
    }else{
      this.login();
    }
  },

  //控制小程序功能模块是否展示  n是不展示，其他情况都展示 医美版本临时接口
  getWeixinModuleShow() {
    var that = this;
    requestAppid({
      URL: getWeixinModuleShowIs
    }, (data) => {
      that.setData({
        moduleShowIs: data
      })
      if(data=="y"){
        //获取手艺人 岗位名称
        that.getWeixinpostCodeNameFun();
      }
    })
  },

  //开始*******************************************************************************************
  login:function(){
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
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
              degree:true//有经纬度了
            })
            // 参数都获取到了，发送请求
            that.commomlogin(code,latitude, longitude, altitude)
          },
          fail: function () {
            // console.log('app页面获取地图失败！')
            that.setData({
              degree: false
            })
            that.commomlogin(code)
          }
        })
      },
      fail: function () {}
    });
  },
  //获取随机数
  commomlogin: function (code,latitude, longitude, altitude) {
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
    wx.request({
      url: getApp().url + 'wxLogin/login',
      data: sendData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status == 200) {
          wx.setStorage({//异步存随机数，在它的回调函数里走原index函数
            key: appid,
            data: res.data.data.thirdSessionId,
            success: function () {
              that.loadFirst(res.data.data.thirdSessionId)//调用原index里的函数,传入随机数
            },
            fail: function () {
             
            }
          })

        } else if (res.data.status == 400) {}
      },
      fail:function(){
        // console.log('调用随机数借口fail')
      }
    });
  },
  //**结束***************************************************************************
  // 首次进来获取首页数据
  loadFirst: function (random) {
    var that = this
    var sendData
    if (!that.data.latitude) {
      sendData = {
        thirdSessionId: random
      }
    } else {
      sendData = {
        thirdSessionId: random,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      }
    }
    console.log('调用首页接口的参数')
    // console.log(sendData)
    wx.request({
      url: getApp().url + 'customerRecommend/getRecommendUser',
      method: 'POST',
      data: sendData,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // wx.hideLoading();//关闭首页加载框
        that.setData({
          isloadingMask1:false
        })
        if (res.data.status === 200) {
          // JSON.stringify(res.data.data) !== "{}"
          if (!util.isEmpty(res.data.data)) {//有排班数据，例如{status: 200, msg: "成功",data:{...}}
            // console.log('index首次进来里面返回200,数据是')
            // console.log(res.data)
            // 重构响应数据
            var arrOrigin = res.data.data;//响应数据
            var obj = JSON.parse(JSON.stringify(arrOrigin));//声明一个无关联的新数组
            if (obj.isNewCustomer==='y'){//新客
                that.setData({
                  near:true
                })
            }else{//老客
              that.setData({
                near: false
              })
            }

            //时间转换
            var date, Y, M, D, h, m, week
            var timeTransform
            if (obj.startTime) {
              timeTransform = (obj.startTime).replace(/-/g, '/')//兼容ios写法
            }
            date = new Date(timeTransform)
            if (date.getFullYear()) {//判断响应数据时间是否有效，这是有效的
              // console.log('首页时间数据')
              //求10-30和11:59
              Y = date.getFullYear() + '-';
              M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
              D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
              h = date.getHours() + ':';
              m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
              // console.log(m);
              obj.date = M + D
              obj.startTime = h + m
              //求星期几
              switch (date.getDay()) {
                case 0: week = "星期天"; break
                case 1: week = "星期一"; break
                case 2: week = "星期二"; break
                case 3: week = "星期三"; break
                case 4: week = "星期四"; break
                case 5: week = "星期五"; break
                case 6: week = "星期六"; break
              }
              obj.week = week
              //获取noon
              var trsform = date.getHours()
              if (trsform < 12) {
                obj.noon = '上午'
              } else if (12 < trsform < 18) {
                obj.noon = '下午'
              } else {
                obj.noon = '晚上'
              }
            } else {//响应时间无效
              obj.date = ''
              obj.startTime = ''
              obj.week = ''
              obj.noon = ''
            }

            //更新数据
            that.setData({
              disabled: false,//马上预约解禁
              // isShow: false,
              startData: obj,
              departmentid: obj.depart_id,
              departmentname: obj.department_name,
              userId: obj.user_id,
              username: obj.username,
              avatarapp: obj.avatarApp,
              scheduleId: obj.schedule_id,//排班id
              timeFormat: obj.timeFormat,//预约时间块
              day: Y + M + D,//推荐的时间，2017-12-11
              departmentName: obj.department_name,//部门名称
              completeStartTime: timeTransform//存储完整的预约时间
            })
          } else {
            that.setData({
              isloadingMask2: true,
              receiveData:'n'//首页没有排班，没有接收到数据
            })
          }
        } else{//失败
          that.setData({
            isloadingMask2: true,
            receiveData: 'n'//首页没有排班，没有接收到数据
          })
        }
        // common.status(res, that)//状态401和402

      },
      fail: function () {
        wx.hideLoading();//关闭首页加载框
        console.log('首页借口FAIL')
        //设置toast时间，toast内容  
        that.setData({
          count: 2000,
          toastText: '网络错误'
        });
        that.showToast();
      }
    })

  },
  //后次进来
  loadHou: function (random) {
    var that = this
    wx.getLocation({//获取经纬度
      type: 'gcj02',
      success: function (res) {
        var sendData = {
          thirdSessionId: random,
          longitude: res.longitude,
          latitude: res.latitude
        }
        that.setData({//授权经纬度
          degree: true
        })
        that.loadHouCommon(sendData)
      },
      fail: function () {
        var sendData = {
          thirdSessionId: random
        }
        that.setData({
          degree: false
        })
        that.loadHouCommon(sendData)
      }
    })
  },
  // 后次公共函数
  loadHouCommon: function (sendData) {
    var that = this
    console.log('后次首页数据接口参数')
    // console.log(sendData)
    // console.log(getApp().url + 'customerRecommend/getRecommendUser')
    wx.request({
      url: getApp().url + 'customerRecommend/getRecommendUser',
      // url: 'http://115.236.38.186:6000/weixin-xique/customerRecommend/getRecommendUser',
      method: 'POST',
      data: sendData,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        // wx.hideLoading();//关闭首页加载框
        that.setData({
          isloadingMask1: false
        })
        if (res.data.status === 200) {
          // if (res.data.data) {//有排班数据，例如{status: 200, msg: "成功",data:{...}}
          // JSON.stringify(res.data.data) !== "{}" || 
          if (!util.isEmpty(res.data.data)) {//有排班数据，例如{status: 200, msg: "成功",data:{...}}
              console.log('index后次进来里面返回200,数据是')
              // console.log(res.data)
              // console.log(res.data.data)
              // 重构响应数据
              var arrOrigin = res.data.data;//响应数据
              var obj = JSON.parse(JSON.stringify(arrOrigin));//声明一个无关联的新数组
              if (obj.isNewCustomer === 'y') {//新客
                that.setData({
                  near: true
                })
              } else {//老客
                that.setData({
                  near: false
                })
              }

              //时间转换
              var date, Y, M, D, h, m, week
              var timeTransform
              if (obj.startTime) {
                timeTransform = (obj.startTime).replace(/-/g, '/')//兼容ios写法
              }
              date = new Date(timeTransform)
              if (date.getFullYear()) {//判断响应数据时间是否有效，这是有效的
                // console.log('首页时间数据')
                //求10-30和11:59
                Y = date.getFullYear() + '-';
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                h = date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                // console.log(m);
                obj.date = M + D
                obj.startTime = h + m
                //求星期几
                switch (date.getDay()) {
                  case 0: week = "星期天"; break
                  case 1: week = "星期一"; break
                  case 2: week = "星期二"; break
                  case 3: week = "星期三"; break
                  case 4: week = "星期四"; break
                  case 5: week = "星期五"; break
                  case 6: week = "星期六"; break
                }
                obj.week = week
                //获取noon
                var trsform = date.getHours()
                if (trsform < 12) {
                  obj.noon = '上午'
                } else if (12 < trsform < 18) {
                  obj.noon = '下午'
                } else {
                  obj.noon = '晚上'
                }
              } else {//响应时间无效
                obj.date = ''
                obj.startTime = ''
                obj.week = ''
                obj.noon = ''
              }

              //更新数据
              that.setData({
                disabled: false,//马上预约解禁
                // isShow: false,
                startData: obj,
                departmentid: obj.depart_id, 
                departmentname: obj.department_name,
                userId: obj.user_id,
                username: obj.username,
                avatarapp: obj.avatarApp,
                scheduleId: obj.schedule_id,//排班id
                timeFormat: obj.timeFormat,//预约时间块
                day: Y + M + D,//推荐的时间，2017-12-11
                departmentName: obj.department_name,//部门名称
                completeStartTime: timeTransform//存储完整的预约时间
              })
            
          } else {//没有排班数据
            that.setData({
              isloadingMask2:true,
              receiveData: 'n'//首页没有排班，没有接收到数据
            })
          }
        } else if (res.data.status === 400) {//失败
          console.log('连上服务器了,只不过是400')
          // var msg = res.data.msg
          // console.log(msg)
          //设置toast时间，toast内容  
          // that.setData({//没必要让顾客知道
          //   count: 2000,
          //   toastText: msg
          // });
          // that.showToast();
          that.setData({
            isloadingMask2: true,
            receiveData: 'n'//首页没有排班，没有接收到数据
          })
        } else if (res.data.status === 401 || res.data.status === 402) {//被挤掉了
          that.login()//重新获取随机数，并获取首页数据
        }else{
          //设置toast时间，toast内容  
          that.setData({//没必要让顾客知道
            count: 2000,
            toastText: res.data.msg
          });
          that.showToast();
        }
      },
      fail: function () {
        wx.hideLoading();//关闭首页加载框
        // console.log('首页借口FAIL')
        //设置toast时间，toast内容  
        that.setData({
          count: 2000,
          toastText: '网络错误'
        });
        that.showToast();
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isShow: true,//显示首页
      isSearchShow: false,//隐藏模板
      pullOk: false,//不可以上拉触底
      pageNo:1,//搜索回到第一页
      searchData: [],//搜索数据置空
      name:''//名字置空
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
    // setTimeout(function(){
    //   wx.stopPullDownRefresh();
    // },1000)
    // this.setData({
    //   xiala:flase
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('daodi')
    var that = this
    console.log('下拉' + that.data.pullOk)
    console.log('下拉' + that.data.totalPages)
    console.log('下拉' + that.data.pageNo)
    if(that.data.pullOk){//输入框有值，可以上拉触底了
      if (that.data.pageNo < that.data.totalPages) {
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
          pageNo: this.data.pageNo + 1
        })
        //继续发请求
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {//用户允许地图功能
            var latitude = res.latitude
            var longitude = res.longitude
            that.commonBottomRequest(longitude, latitude)
          },
          fail: function () {//用户拒绝地图功能
            that.commonBottomRequest(longitude, latitude)
          }
        })
      }
    }
  },
  // 公共的触底请求
  commonBottomRequest: function (longitude, latitude){
    var that=this
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        // console.log('页面获取到随机数为')
        // console.log(res.data)
        var sendData
        if (!latitude) {
          sendData = {
            thirdSessionId: res.data,
            name: that.data.name,
            pageNo: that.data.pageNo,
            pageSize: 10
          }
        } else {
          sendData = {
            thirdSessionId: res.data,
            name: that.data.name,
            longitude: longitude,
            latitude: latitude,
            pageNo: that.data.pageNo,
            pageSize: 10
          }
        }
        wx.request({
          url: getApp().url + 'staff/searchStaffByName',
          data: sendData,
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            wx.hideLoading();//关闭加载框
            // console.log(res.data)
            if (res.data.status === 200) {
              var newSearchData = res.data.data.list;
              for (var i = 0; i < newSearchData.length; i++) {
                var curr = newSearchData[i]
                if (curr.distance >= 1000) {
                  curr.distanceChange = (curr.distance / 1000).toFixed(1)
                }
              }
              var searchData = that.data.searchData.concat(res.data.data.list)
              var totalPages = res.data.data.totalPages
              
              that.setData({
                searchData: searchData
              })
            } else{
              // console.log(400)
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
            wx.hideLoading();//关闭加载框
            // console.log(res);
            //设置toast时间，toast内容  
            that.setData({
              count: 2000,
              toastText: "服务器错误"
            });
            that.showToast();
          }
        })
      },
      fail: function () {
        console.log('页面获取随机数失败')
      }
    })
    
  },

  /**
   * 获取手艺人名称
   */
  getWeixinpostCodeNameFun: function(){
      const that = this;
      requestAppid({
        URL: getWeixinPostCodeName
      },data=>{
        // console.log(data,"getWeixinpostCodeName");
        that.setData({
          postCodeName: data.postName
        })
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // return {
    //   title: '自定义转发标题',
    //   path: '/pages/index/index'
    // }
  },
  toStore:function(){
    wx.navigateTo({
      url: '../storeDistribution/storeDistribution?fromWhere=true',
      success:function(){
      }
    })
  },
  toPeople:function(){
    var that=this;
  
    if(!that.data.disabled){
      var departmentid = this.data.departmentid
      var departmentname = this.data.departmentname
      wx.navigateTo({
        url: '../craftsman/craftsman?departmentId=' + departmentid + '&name=' + departmentname,
        success: function () {
        }
      })
    // this.setData({
    //   isAllShow: true,//隐藏初始页面
    //   isPeopleShow: true//显示点击手艺人模板页面
    // })
    }
  },
  toTime:function(){
    
    var that=this;
    var userId = this.data.userId;//技师id
    wx.navigateTo({
      
      url: '../time/time?timetocraftman=true&isreplacetime=n&receivedata=' + that.data.receiveData + '&userId=' + userId,//走从时间选人的逻辑
      success: function () {
      }
    })
  },
  //马上预约
  toCheckinfo:function(){
    var that=this
    var userId = this.data.userId//技师id
    var scheduleId = this.data.scheduleId//排班id
    var timeFormat = this.data.timeFormat//预约时间块，逗号隔开
    // 避免重复点击，做限制
    that.setData({
      disabled:true
    })
    //检查是否登录,登录返回登录信息 
    isLogin(
      //登录了,去核对信息页面
      ()=>{
      wx.navigateTo({
        url: '../checkinfo/checkinfo?userId=' + userId + '&scheduleid=' + scheduleId + '&timeformat=' + timeFormat,
        success: function () {
        }
      })
    },
    //没登录，去登陆页面
    ()=>{
      wx.navigateTo({
        url: '../login/login?userId=' + userId + '&scheduleid=' + scheduleId + '&timeformat=' + timeFormat + '&howto=' + true,
        success: function () {
        }
      })
    }) 
  },
  //输入美容师
  handleInput:function(e){
    var that = this
    // 每次搜索时，都先把pageNo设为1
    that.setData({
      pageNo:1
    })
    var name = e.detail.value;
    that.setData({
      name:name
    })
    if (name){//有值
      this.setData({
        isShow: false,//隐藏局部首页，保留搜索框
        isSearchShow: true,//搜索手艺人模板显示
        pullOk: true//可以上拉触底了
      })
    }else{//没值
      console.log('为空')
      this.setData({
        isShow: true,
        isSearchShow: false,
        pullOk: false//不可以上拉触底
      })
    }
    wx.getSetting({//判断是否授权了地理位置
      success: (res) => {
        if (!res.authSetting['scope.userLocation']){//没有授权地理位置
          wx.authorize({
            scope: 'scope.userLocation',
            success:function() {
              // 用户已经同意小程序使用地理位置功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.userLocation()
            },
            fail: function () {// 本来是用户不授权，那就不传经纬度参数，但是为了方便，还是直接传，只不过是空值
              that.userLocation()
            }
          })
        } else {//授权地理位置
          that.userLocation()
        }
      }
    })
  },
  // 输入美容师公共的函数
  userLocation:function(){
    var that=this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {//用户允许地图功能
        var latitude = res.latitude
        var longitude = res.longitude
        that.commonRequest(longitude, latitude)
      },
      fail: function () {//用户拒绝地图功能
        that.commonRequest()
      }
    })
  },
  //输入美容师公共的请求
  commonRequest: function (longitude, latitude){
    var that=this
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        // console.log('页面获取到随机数为')
        // console.log(res.data)
        var sendData
        if (!latitude) {
          sendData = {
            thirdSessionId: res.data,
            name: that.data.name,
            pageNo: 1,
            pageSize: 10
          }
        } else {
          sendData = {
            thirdSessionId: res.data,
            name: that.data.name,
            longitude: longitude,
            latitude: latitude,
            pageNo: 1,
            pageSize: 10
          }
        }
        if (sendData.name){
          
          wx.request({
            url: getApp().url + 'staff/searchStaffByName',
            data: sendData,
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              // console.log(res.data)
              if (res.data.status === 200) {
                var searchData = res.data.data.list
                var totalPages = res.data.data.totalPages
                for (var i = 0; i < searchData.length; i++) {
                  var curr = searchData[i]
                  if (curr.distance >= 1000) {
                    curr.distanceChange = (curr.distance / 1000).toFixed(1)
                  }
                }
                that.setData({
                  totalPages: totalPages,
                  searchData: searchData
                })
                console.log(that.data.searchData)
                //是否显示没找到手艺人
                if (searchData.length === 0) {//显示出来没找到页面
                  that.setData({
                    kong: true
                  })
                } else {
                  that.setData({
                    kong: false
                  })
                }
              } else {
                // console.log(res.data);
                var msg = res.data.msg;
                //设置toast时间，toast内容  
                that.setData({//没必要让顾客知道
                  count: 2000,
                  toastText: msg
                });
                that.showToast();
              }
              // common.status(res, that)//状态401和402
            },
            fail: function (res) {
              console.log(res);
              //设置toast时间，toast内容  
              that.setData({
                count: 2000,
                toastText: "服务器错误"
              });
              that.showToast();
            }
          })
        }
        
      },
      fail: function () {
        console.log('页面获取随机数失败')
      }
    })
    
  },
  //点击美容师项
  selectSearchPeople:function(e){
    var that = this
    this.setData({
      // isSearchShow: false,//隐藏搜索手艺人模板
      // isShow: false,//回到初始页面
      searchData:[],
      name:''//输入框值
    })
    var userId = e.currentTarget.dataset.id//获取员工id
    var departmentName = e.currentTarget.dataset.departmentname//获取员工所在门店名称
    var username = e.currentTarget.dataset.username//获取员工姓名
    var avatarapp = e.currentTarget.dataset.avatarapp//获取员工图片
    wx.navigateTo({
      url: '../time/time?userId=' + userId + '&departmentname=' + departmentName + '&username=' + username + '&avatarapp=' + avatarapp,
      success: function () {
      }
    })
  },
  // selectClickPeople:function(){//点击手艺人模板项
  //   this.setData({
  //     isAllShow: false,//显示初始页面
  //     isPeopleShow: false//隐藏点击手艺人模板页面
  //   })
  // },
  // 暂无合适手艺人的取消
  cancelMask:function(){
    this.setData({
      isloadingMask2:false,
      // isFirst:false,
    })
  },
  // 暂无合适手艺人的选时间
  toTimeMask: function () {
    this.toTime()
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