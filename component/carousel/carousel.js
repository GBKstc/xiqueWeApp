
module.exports = {
  data:{
    //indicatorDots:true,  //显示面板指示点
    autoplay:true,     //自动切换
    interval:5000,    //自动切换时间间隔
    duration:1000,    //滑动动画时长
    imgUrls:[
        '../../image/swiper/image1.png',
        '../../image/swiper/image2.png',
        '../../image/swiper/image3.png',
        '../../image/swiper/image4.png',
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

 