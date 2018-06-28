
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    coverImgUrl: {
      type: Array,
      value:[],
      observer: function (newVal, oldVal, changedPath){
        console.log(newVal, oldVal, changedPath);
        let that = this;
        that.setState({
          coverImgUrl: newVal
        })
      }
    }
  },
  data:{
    //indicatorDots:true,  //显示面板指示点
    autoplay:true,     //自动切换
    interval:5000,    //自动切换时间间隔
    duration:1000,    //滑动动画时长
    //imgUrls: this.properties.coverImgUrl,
    imgIndex:1,
  },
  attached:function(){
    console.log(this.data.coverImgUrl);
  },
  methods: {
    intervalChange: function (e) {
      let { current, source } = e.detail;
      let imgIndex = current + 1;
      this.setData({
        imgIndex,
      })
    }
  },
  
})
 