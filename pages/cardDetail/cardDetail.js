// pages/cardDetail/cardDetail.js
let util = require('../../utils/util.js');
let URL = require('../../utils/URL.js');
const {
  requestAppid,
  cardLiaochengDetailProducts,
  cardLiaochengAndProm,
  cardProjects,
  cardGoods,
  cardBalance,
  cardPromDetailProducts
} = URL;
const { isEmpty,  } = util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalBottom:"-100%",
    showShadow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"卡详情");
    this.getCardDetail(options)
    this.setData({
      card: options
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
    console.log("分享成功")
  },
  /**
   * 选择疗程
   */
  selectProject:function(e){
    const that = this;
    const { card} = this.data;
    console.log(e.currentTarget);
    that.getCardLiaochengDetailProducts({
      cardId: card.cardId,
      orderId: e.currentTarget.dataset.orderid,
      productId: e.currentTarget.dataset.productid,
    })
    this.setData({
      showShadow: true,
      cardLiaochengDetailProducts:[]
    },()=>{
      this.setData({
        modalBottom: 0,
      })
    })
  },
  /**
   * 选择方案
   */
  selectPromotion: function (e) {
    const that = this;
    const { card } = this.data;
    console.log(e.currentTarget);
    that.getCardPromDetailProducts({
      cardId: card.cardId,
      orderId: e.currentTarget.dataset.orderid,
      productId: e.currentTarget.dataset.productid,
    })
    this.setData({
      showShadow: true,
      cardLiaochengDetailProducts: []
    }, () => {
      this.setData({
        modalBottom: 0,
      })
    })
  },

  /**
   * 疗程详情
   */
  getCardLiaochengDetailProducts(data){
    const that = this;
    // const { recordData } = that.data;
    requestAppid({
      URL: cardLiaochengDetailProducts,
      param: { ...data }
    }, function (data) {
        console.log(data);
        if(isEmpty(data)){
          return
        }
        const list = [];
        for(let item of data){
          if (!isEmpty(item.surplusbuycount) && item.surplusbuycount > 0){
            item.count = item.surplusbuycount;
            list.push({
              count: item.surplusbuycount,
              unit: item.unit,
              name: item.name,
            })
          }
          if (!isEmpty(item.surplusgivecount) && item.surplusgivecount>0) {
            item.count = item.surplusgivecount;
            list.push({
              count: item.surplusgivecount,
              unit: item.unit,
              name: item.name,
              isGive:true
            })
          }
        }
        that.setData({
          cardLiaochengDetailProducts: list,
          surplusTimes:""
        })
    })
  },

  /**
   * 者方案详情
   */
  getCardPromDetailProducts(data) {
    const that = this;
    // const { recordData } = that.data;
    requestAppid({
      URL: cardPromDetailProducts,
      param: { ...data }
    }, function (data) {
      console.log(data);
      if (isEmpty(data.list)) {
        return
      }
      const list = [];
      for (let item of data.list) {
        list.push({
          count: "",
          unit: "",
          name: item.name,
        })
      }
      that.setData({
        cardLiaochengDetailProducts: list,
        surplusTimes: data.surplusTimes||""
      })
    })
  },

  closeModal:function(){
    const that = this;
    this.setData({
      showShadow: false,
      modalBottom: "-100%",
    })
  },

  //获取卡详情用的通用获取接口
  getData(key, card) {
    const that = this;
    // const { recordData } = that.data;
    requestAppid({
      URL: URL[key],
      param: { ...card}
    }, function (data) {

      if (isEmpty(data)) {
        return;
      }
      console.log(data, key)
      const Data = {};
      Data[key] = data;
      that.setData({
        ...Data
      })
    })
  },

  //获取订单所有详情
  getCardDetail(card) {
    const that = this;
    //所有要获取的详情接口list
    const getKeyList = [
      "cardLiaochengAndProm",
      "cardProjects",
      "cardGoods",
      "cardBalance",
    ];

    for (let key of getKeyList) {
      console.log(key);
      that.getData(key, card);
    }


  },
})