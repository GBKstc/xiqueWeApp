let URL = require('../../utils/URL.js');
let util = require('../../utils/util.js');
const {
  requestAppid,
  getCustomerDiscountCodeList
} = URL;
const {
  isEmpty
} = util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.customerDiscountCodeList();

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


  chancenouse: function (e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    const { list } = that.data;
    const selectItem = list[index];
    wx.navigateTo({
      url: '../chancenouse/chancenouse?item='+JSON.stringify(selectItem),
    })
  },

  customerDiscountCodeList:function(){
    const that = this;
    requestAppid(
      {
        URL: getCustomerDiscountCodeList,
        param: {
          pageNo: 1,
          pageSize: 20,
        },
      },
      function (data) {
        console.log(data.list);
        let list = data.list;
        if (isEmpty(data.list)){
          list = [];
        }
        // for(let i=0;i<list.length;i++){
        //   let string = "";
        //   switch (list[i].discountCodeStatus){
        //     case 0:
        //       string = "未使用";
        //       break;
        //     case 1:
        //       string = "已过期";
        //       break;
        //     case 2:
        //       string = "已使用";
        //       break;

        //   }
        //   list[i].discountCodeStatusString = string;
        // }
        that.setData({
          list: list
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
    
  }
})