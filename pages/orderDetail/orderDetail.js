// pages/orderDetail/orderDetail.js
var common = require('../../utils/commonConfirm.js')
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

const URL = require('../../utils/URL.js');
const util = require('../../utils/util');
const config = require('../../utils/config');
const { imgUrl } = config;
const {
  requestAppid,
  raffle,
  userScheduleServiceSaveEvaluate,
  billConfirmBill,
} = URL;
const { 
  isEmpty,
} = util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    showPrize:true,//刮奖蒙层
    // random: wx.getStorageSync(getApp().globalData.appid),
    status:1,
    isArray:false,//手艺人，默认是1或3的状态
    isAnonymous:false,//匿名评价
    evaluateContent:"",//评价内容
    cancelDisabled:true,//'取消预约'按钮默认禁用
    nScore:0,//评分，就是五角星的个数，点击操作之后得到的
    serviceCode:0,//服务单号
    serviceId: 0,//服务单id
    scheduleServiceId: '',//排版定单id,这个是订单页面传过来的，在本页面初始化时要用和换时间时要传到核对修改信息页面
    departLabels: [],//门店评价标签id
    beauticianLabels: [],//手艺人评价标签id
    cancelMask:false,//取消预约模态框隐藏
    //下面四个是换时间接口，要传的参数。
    scheduleId: '',//跟换时间订单的排班id
    timeFormat: '',//跟换订单的预约间块
    customerId:'',//顾客id
    day: '',//更改换时间的订单时间，精确到日（2018-03-06）
    recordData:{},
    //toast默认不显示  
    isShowToast: false,
    isShowToastButton: false,
    count: 3000,
    toastText: '你好' ,
    starList:[true,true,true,true,true],
    bg: {},//初始化每一个评价标签对应的颜色状态，这里个bg应该是{1:false,3:true}这种对象形式
    arrObj: [],//初始化赋值，这个是上面的升级版，每个对象里面同时包含evaluateLableId(标签id)和evaluateType(标签类型)这两个属性，例如[{id:flase,evaluateLableId:5,evaluateType:1},{id:flase,evaluateLableId:9,evaluateType:2}]这种形式，目的是点击提交按钮时，便于统计点击的标签是哪个类型的，id是多少，这些要传递给后台


    //确认订单模态框
    // modalBottom: "-100%",
    showShadow: false,


    //选中的订单模块
    selectModuleList:[true]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //关闭分享
    wx.hideShareMenu();
    console.log('orderDetail', options)
    const that=this
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'WDEBZ-33BRR-ZO4WZ-WSJ3Y-RFEM2-D6BZF'
    });
    let status = options.status;//记录1，2还是3
    let scheduleServiceId = options.scheduleServiceId;//排班订单服务id
    let serviceId = options.serviceId;//服务单服务id 小程序结账
    let evaluateGiftId = options.evaluateGiftId ? options.evaluateGiftId:"";
    let url = "";//请求接口 订单（erp小程序结账）请求getServiceDetailBySid 服务单请求getServiceDetail
    that.setData({
      status: status,
      scheduleServiceId: scheduleServiceId,
      serviceId: serviceId,
      evaluateGiftId,
    })
    //如果scheduleServiceId为空 不获取数据
    if (!(scheduleServiceId || serviceId)){
      return false;
    }

    if (scheduleServiceId) {
      url = "getServiceDetail"
    }
    if (serviceId) {
      url = "getServiceDetailBySid"
    }

    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        
        var sendData={
          thirdSessionId: res.data,
          status: status || "",
          scheduleServiceId: scheduleServiceId || "" ,
          serviceId: serviceId || "" 
        }
        if (evaluateGiftId){
          sendData.evaluateGiftId = evaluateGiftId;
        }
        console.log('订单详情初始化参数')
        console.log(sendData)
        wx.request({
          url: getApp().url + 'userScheduleService/'+url,
          method: 'POST',
          data: sendData ,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log(res.data,"订单详情")
            if (res.data.status === 200) {
              // console.log(200)
              // 重构响应数据，需要把原始响应数据里的date，serviceStartTime，evaluateScore这三个属性改造
              var recordData = Object.assign({}, res.data.data)//声明一个无关联的新对象
              //时间转换
              var now, now2, Y, M, D, h, hh, m, mm, timeDuan, timeMin, allMin, week;
              now = new Date(recordData.orderStartTime);
              now2 = new Date(recordData.orderEndTime + 60000);
              allMin = (recordData.orderEndTime + 60000 - recordData.orderStartTime) / 1000 / 60;
              console.log(allMin);
              timeMin = allMin % 60;
              recordData.timeMin = timeMin.toFixed(0);
              recordData.timeDuan = (allMin - timeMin)/60;
              //求2017-10-30和11:59
              Y = now.getFullYear() ;
              M = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) ;
              D = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
              h = now.getHours() + ':';
              hh = now2.getHours() + ':';
              m = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
              mm = now2.getMinutes() < 10 ? '0' + now2.getMinutes() : now2.getMinutes()
              recordData.date = Y +'/'+ M+'/' + D
              recordData.timePart = h + m + "-" + hh + mm
              // 求是否是今，明，后天，后者是星期几
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
              //把number类型的评分改成对应的数组,以便于遍历
              const list = [];
              for(let i=0;i<5;i++){
                list[i] = (i < recordData.evaluateScore);
              }
              // switch (recordData.evaluateScore) {
              //   case 1: starList = [true,false,false,false,false]; break
              //   case 2: starList = [true, true, false, false, false]; break
              //   case 3: starList = [true, true, true, false, false]; break
              //   case 4: starList = [true, true, true, true, false]; break
              //   case 5: starList = [true, true, true, true, true]; break
              // }
              if (recordData.customerName.length>4){//如果预约人姓名大于四个，增加一个属性，否则不加
                recordData.maxname = recordData.customerName.substr(0,4)
              }
              
              //更新数据
              that.setData({
                starList:list,
                recordData: recordData,
                serviceCode: recordData.serviceCode,
                serviceId: recordData.serviceId,
                scheduleId: recordData.scheduleId,
                timeFormat: recordData.timeFormat,
                customerId: recordData.customerId,
                isShowChangeTime: recordData.showChangeTime,
                status: recordData.serviceStatus,
                evaluateGiftId: recordData.evaluateGiftEntity ? recordData.evaluateGiftEntity.evaluateGiftId:"",
                
                day:Y+'-'+M+'-'+D,
                cancelDisabled:false//解禁取消预约
              })
              //获取订单详情
              if (recordData.serviceId){
                that.getOrderDetail(recordData.serviceId);
              }
              
              //初始化bg的值，即评价标签的状态，同时初始化arrObj这个数组对象
              var arrOrigin = recordData.evaluateLableList//未评价时所有的标签列表
              if (arrOrigin) {//未评价
                //var evaluateLableList=recordData.evaluateLableList//未评价时所有的标签列表
                var newArr = JSON.parse(JSON.stringify(arrOrigin))//声明一个无关联的新数组
                var obj = {}
                var arrObj = []
                for (var i = 0; i < newArr.length; i++) {//让evaluateLableId的value作为obj的key
                  obj[newArr[i].evaluateLableId] = false//初始化全是false,即未选中状态
                  //arrObj每个对象需要三个属性
                  // arrObj[i][newArr[i].evaluateLableId] = false
                  // arrObj[i].evaluateType = newArr[i].evaluateType
                  // arrObj[i].evaluateLableId = newArr[i].evaluateLableId
                  newArr[i][newArr[i].evaluateLableId] = false
                }
        
                that.setData({
                  bg: obj,
                  arrObj: newArr
                })
              }

              // 判断手艺人从哪个地方取，是从“beauticianList数组”取，还是从“userName”取
              if (recordData.beauticianList && recordData.beauticianList.length > 0) {//手艺人，是beauticianList数组
                that.setData({
                  isArray: true
                })
              } else {//手艺人，是userName
                //不用写
              }
            } else if (res.data.status === 400) {//失败
              console.log(400)
              var msg = res.data.msg
              //设置toast时间，toast内容  
              that.setData({
                count: 2000,
                toastText: msg,
                cancelDisabled: true//禁用取消预约
              });
              that.showToast();
            }
            common.status(res, that)//状态401和402
          },
          fail: function (res) {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var pages = getCurrentPages()
    // console.log('订单详情页面noshow')
    // console.log(pages)
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
  //点击换时间
  changeTime:function(){
    var that=this
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        var sendData = {
          thirdSessionId: res.data,
          scheduleId: that.data.scheduleId,
          scheduleServiceId: that.data.scheduleServiceId,//泽哥添加
          timeFormat: that.data.timeFormat,
          customerId: that.data.customerId,
          day:that.data.day
        }
        console.log('订单详情初始化参数')
        console.log(sendData)
        wx.request({
          url: getApp().url + 'staff/replaceTime',
          method: 'POST',
          data: sendData,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            wx.hideLoading();
            if (res.data.status === 200) {
              console.log(res.data.data)
              wx.navigateTo({
                url: '../time/time?timetocraftman=true' + '&timeformat=' + that.data.timeFormat + '&isreplacetime=y' + '&scheduleserviceid=' + that.data.scheduleServiceId + '&daytowhat=' + that.data.day,
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
          },
          fail:function(){
            wx.hideLoading();
            //设置toast时间，toast内容  
            that.setData({
              count: 2000,
              toastText: '网络错误'
            });
            that.showToast();
          }
        })
      },
      fail:function(){

      }
    })
  },
  //点击打开地图
  toWhere:function(e){
    var that=this
    var latitude = e.currentTarget.dataset.latitude//获取标签上绑定的维度
    var longitude = e.currentTarget.dataset.longitude//获取标签上绑定的经度
    var name = e.currentTarget.dataset.departmentName
    var address = e.currentTarget.dataset.address
    // 调用坐标转换接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 3,
      success: function (res) {//门店有经纬度

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
        console.log(res);
        //设置toast时间，toast内容  
        that.setData({
          count: 2000,
          toastText: "定位中..."
        });
        that.showToast();
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // 复制粘贴板
  setClipboard:function(){
    wx.setClipboardData({
      data: this.data.serviceCode.toString(),//必须是字符串形式
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 800
        })
        // wx.getClipboardData({
        //   success: function (res) {
        //     console.log(res.data) // data
        //   }
        // })
      }
    })
  },
  //匿名评价
  anonymous:function(){
    this.setData({
      isAnonymous: !this.data.isAnonymous
    })
    console.log(111111)
  },
  //点击五角星
  handleToggle:function(e){
    const objList = [
      "非常不满意，特别失望",
      "不满意，有点失望",
      "一般，普普通通",
      "比较满意，仍可改善",
      "非常满意",
    ];
    const that = this;
    const index = e.currentTarget.dataset.index;
    const list = [];
    for(let i=0;i<5;i++){
      list[i] = (i <= index);
    }
    this.setData({ starList: list, starText: objList[index], selectStarIndex: index});
  },
  //更改评价内容
  changeEvaluateContent:function(e){
    const that = this;
    console.log(e.detail.value && (e.detail.value.length < 51));
    if (e.detail.value && (e.detail.value.length<51)){
      that.setData({
        evaluateContent: e.detail.value
      })
    }
  },
  //点击评价标签
  handleBg:function(e){
    var target = e.currentTarget.dataset.str//获取当前对象
    var targetValue = this.data.bg[target]//获取当前对象所对应的值，是布尔值
    //重新设置对象
    var obj=this.data.bg
    //改变新对象里的某个值
    obj[target] = !targetValue
    //更新数据
    this.setData({
      bg: obj
    })


    //重新设置对象
    var objj = this.data.arrObj
    for(var i=0;i<objj.length;i++){
      var everyElement = objj[i]
      if (everyElement[target] == false || everyElement[target]==true){//找到当前这个对象
          //改变新对象里的某个值
          objj[i][target] = !targetValue
          //更新数据
          this.setData({
            arrObj: objj
          })
      }
    }

  }, 
  //抽奖
  lottery:function(){
    const that = this;
    const { serviceId, evaluateGiftId } = that.data//服务单id
    requestAppid({
      URL: raffle,
      param:{
        serviceId,
        evaluateGiftId
      }
    },function(data){
      console.log(data);
      if(isEmpty(data)){
        data = {}
      }
      wx.redirectTo({
        url: '../scrapeprice/scrapeprice?award=' + JSON.stringify(data),
      })
      // wx.redirectTo({
      //   url: '../scrapeprice/scrapeprice?award=',
      // })
      }, function (data){
        wx.redirectTo({
          url: '../scrapeprice/scrapeprice?award=',
        })
      })
  },
  //提交评价
  submitEvevate:function(e){
    // console.log(e.detail.formId)
    var that=this;
    const { evaluateGiftId, starList, status, recordData } = that.data;
    let starNum = 0;
    // 获取五角星的个数
    
    for(let item of starList){
      if(item){
        starNum++
      }else{
        break;
      }
    };
    if (starNum == 0 && recordData.serviceType!=1) {
      that.openToast("星级是必选的哦!", 2000)
      return false;
    }
    // return false;
    // this.setData({
    //   nScore: starNum
    // });
    //是否匿名转换成y或n
    var isAnonymous=""
    if (this.data.isAnonymous){
      isAnonymous='y'
    }else{
      isAnonymous = 'n'
    }
    //获取门店标签id与手艺人标签id
    var arrObj=that.data.arrObj
    var departLabels =[]
    var beauticianLabels = []
    var departLabelsString = ''
    var beauticianLabelsString = ''
    for (var i = 0; i < arrObj.length; i++) {
      var curr = arrObj[i]
      var currIds = arrObj[i]['evaluateLableId']
      if (curr[currIds]===true){
        if (curr.evaluateLableType === 1) {
          departLabels.push(curr.evaluateLableId)
          departLabelsString = departLabels.join(',')
        } else if (curr.evaluateLableType === 2) {
          beauticianLabels.push(curr.evaluateLableId)
          beauticianLabelsString = beauticianLabels.join(',')
        }
      }
    }
    
    //提交评价
    console.log({
      serviceId: that.data.serviceId,//服务单id
      evaluateScore: starNum,//评分
      departLabels: departLabelsString,
      beauticianLabels: beauticianLabelsString,
      isAnonymous: isAnonymous,
      evaluateContent: that.data.evaluateContent,//评价详情
      formId: e.detail.formId
    });
    that.closeModal();
    let url;
    if(status==0){
      url = billConfirmBill;
    }else{
      url = userScheduleServiceSaveEvaluate;
    }
    requestAppid({
      URL: url,
      param: {
        serviceId: that.data.serviceId,//服务单id
        evaluateScore: starNum,//评分
        departLabels: departLabelsString,
        beauticianLabels: beauticianLabelsString,
        isAnonymous: isAnonymous,
        evaluateContent: that.data.evaluateContent,//评价详情
        formId: e.detail.formId
      }
    }, function (data) {
      //如果有活动ID 说明可以抽奖
      if (evaluateGiftId || recordData.evaluateGiftEntity) {
        that.lottery()
      } else if (status==0){ //erp小程序结账
        wx.redirectTo({
          url: '../success/success?successText=消费确认成功&toPag=index&content=消费确认成功,请预约下次护理哦~&buttonText=立即预约',
        })
      }else {
        //页面跳转成功后，设置上个页面值
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]//上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          status: 2
        })
        console.log('提交成功')
        wx.navigateBack({
          delta: 1,
          // url: '../order/order',
          success: function () {

          }
        })
      }
      
      // common.status(res, that)//状态401和402
    }, function (msg) {
      //设置toast时间，toast内容
      that.openToast(msg);
      // that.setData({
      //   count: 2000,
      //   toastText: msg
      // });
      // that.showToast();
    })
  },
  //取消预约
  showModal:function(e){
    const that=this;
    that.setData({
      cancelMask:true,//显示模态框
      formId: e.detail.formId,
    })
  },
  // 取消预约确定
  cancelSuccess:function(){
    var that=this;
    const { formId} = that.data;
    that.setData({
      cancelMask:false
    })
    wx.getStorage({//异步获取随机数
      key: getApp().globalData.appid,
      success: function (res) {
        wx.request({
          url: getApp().url + 'schedule/cancelOrder',
          method: 'POST',
          data: {
            thirdSessionId: res.data,
            scheduleServiceId: that.data.scheduleServiceId,//排班订单id
            formId: formId
          },
          header:{ 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log('success响应数据')
            console.log(res.data)
            // //页面跳转成功后，设置上个页面值
            // var pages = getCurrentPages();
            // var prevPage = pages[pages.length - 2]//上一个页面
            // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            // prevPage.setData({
            //   status: 3
            // })
            if (res.data.status === 200) {
              //页面跳转到订单列表页面
              wx.redirectTo({
                url: '../order/order?status=3',
              })
              // wx.navigateBack({
              //   delta: 1,
              //   // url: '../order/order',
              //   success: function () {

              //   }
              // })
            } else if (res.data.status === 400) {
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
            console.log('取消预约服务器失败')
            console.log(res);
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
  // 取消预约取消
  cancelFail: function () {
    var that=this
    that.setData({
      cancelMask: false
    })
  },

  //gotoConsumeDetail查看消费详情
  gotoConsumeDetail: function () {
    const that = this;
    const { recordData } = that.data;
    this.getOrderDetail(recordData.serviceId);
    this.setData({
      showShadow: true
    })
  },

  openModal:function(){
    const that = this;
    const { recordData } = that.data;
    if (recordData.serviceType==1){
      that.submitEvevate();
    }else{
      this.setData({
        showShadow: true,
      })
    }
    
  },

  closeModal: function () {
    const that = this;
    
    this.setData({
      showShadow: false,
    })
  },
  //消息提醒
  openToast: function (toastText,time){
    const that = this;
    //设置toast时间，toast内容  
    that.setData({
      count: time||2000,
      toastText: toastText
    });
    that.showToast();
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
  },

  //获取订单详情用的通用获取接口
  getData(key, serviceId){
    const that = this;
    requestAppid({
      URL:URL[key],
      param: { serviceId: serviceId}
    },function (data) {
      
      if(isEmpty(data)){
        return ;
      }
      console.log(data, key)
      const Data = { showConsumeTitle:true};
      Data[key] = data;
      that.setData({
        ...Data
      })
    })
  },

  //获取订单所有详情
  getOrderDetail(serviceId){
    const that = this;
    //所有要获取的详情接口list
    const getKeyList = [
      "serviceOpenCardInfo",
      "serviceCardRecharge",
      "serviceCardBuy",
      "serviceCardConsume",
      "serviceCardPick",
      "serviceCardReturn",
      "serviceCardTrans",
      "serviceCardDiscountCodeGive",
    ];

    for(let key of getKeyList){
      that.getData(key, serviceId);
    }
  },

  changeModule:function(e){
    console.log(e.target.dataset.index);
    const selectModuleList = [];
    for (let i = 0; i < e.target.dataset.index; i++) {
      selectModuleList[i] = false;
    }
    selectModuleList[e.target.dataset.index] = true;
    this.setData({
      selectModuleList
    })
  },
  
  goToIndex(){
    wx.switchTab({
      url: "../index/index",
      success: function () {
        console.log("success")
      },
      fail:function(e){
        console.log(e)
      }
    })
  },
})