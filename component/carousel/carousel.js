
module.exports = {
  data:{
    //indicatorDots:true,  //显示面板指示点
    autoplay:true,     //自动切换
    interval:5000,    //自动切换时间间隔
    duration:1000,    //滑动动画时长
    imgUrls:[
            'http://pic2.sc.chinaz.com/files/pic/pic9/201804/zzpic11491.jpg',
            'http://pic.sc.chinaz.com/files/pic/pic9/201804/zzpic11585.jpg',
      'http://pic.sc.chinaz.com/files/pic/pic9/201804/zzpic11417.jpg',
    ],
    imgIndex:1,
  },
  intervalChange:function(e){
    let { current,source} = e.detail;
    let imgIndex = current+1;
    // console.log(imgIndex);
    // console.log(source);
    this.setData({
      imgIndex,
    })
  }
} 

 