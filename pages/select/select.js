let URL = require('../../utils/URL.js');
let util = require('../../utils/util.js');
const {
  requestAppid,
  getCustomerDiscountCodeList
} = URL;
const {
  isEmpty,
  formatTimeDay
} = util;

let timeEvent = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    loading:true,

    selectListLeft:0,

    bottomLineLeft: 150,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const that = this;
    // that.customerDiscountCodeList(1);
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
    const that = this;
    console.log("select");
    that.customerDiscountCodeList(1);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  changeSelect(e){
    const that = this;
    const selectListLeft = that.data.selectListLeft;
    const bottomLineLeft = that.data.bottomLineLeft;
    const type = e.target.dataset.type;
    if (isEmpty(type)){
      return false;
    }

    if (timeEvent){
      clearInterval(timeEvent);
      timeEvent=undefined;
    }

    //点击未使用
    if (type =="noUse"){
      if (selectListLeft == 0 && bottomLineLeft==150){
        return false
      }
      this.setData({
        selectListLeft:0,
        bottomLineLeft: 150,
      })
    }

    //点击已失效
    if (type == "Disabled") {
      this.setData({
        selectListLeft: -750,
        bottomLineLeft: 514,
      })
    }
  },


  chancenouse: function (e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    const { list } = that.data;
    const selectItem = list[index];
    wx.navigateTo({
      url: '../chancenouse/chancenouse?item='+JSON.stringify(selectItem),
    })
  },

  customerDiscountCodeList:function(page){
    const that = this;
    requestAppid(
      {
        URL: getCustomerDiscountCodeList,
        param: {
          pageNo: page||1,
          pageSize: 20,
        },
      },
      function (data) {
        let {list} = that.data;
        //let list = data.list;
        if (isEmpty(data.list)){
          // list = [];
          return ;
        } else if ((page || 1)==1){
          list = data.list;
        }else{
          list = list.concat(data.list);
        }
        for(let i of list){
          i.endTime = formatTimeDay(new Date(i.discountCodeEndTime));
        }
        console.log(list)
        that.setData({
          list: list,
          loading: false
        })
      }
    );
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
    const that = this;
    that.customerDiscountCodeList(1);
    that.setData({
      page:1
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("select触底");
    const that = this;
    let { list,page} = that.data;
    page = page+1;
    that.customerDiscountCodeList(page);
    that.setData({
      page
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})