Component({
  properties: {
    stopRecord: {
      type: String,
      value: '{"id": 80,"name": "城西静港","province": "浙江省","city": "杭州市","district": "下城区","address": "江南巷16号","longitude": 120.1902580,"latitude": 30.2984940,"distance": 1316,"offten": false}',
    }
  },
  data: {
    stopRecord:[],
  },
  attached: function () {
    let that = this;
    console.log(JSON.parse(that.properties.stopRecord));
    let stopRecord = JSON.parse(that.properties.stopRecord);
    this.setData({
      stopRecord
    })
  },
  methods: {

    
    
  }
})