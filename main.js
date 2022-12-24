
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

/* eslint-disable no-new */
var app =new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
  ,data:{
    city:"",
    weatherList:[]
    
},
data: {
  tianapi_data:''
}, 
methods:{
send:function (){
axios({  
method:'post',
url:'https://apis.tianapi.com/hotreview/index',
data:Qs.stringify({key:'3d9b6f0831beee35e232453fda4e8864'}),
headers:{'Content-Type': 'application/x-www-form-urlencoded'}
}).then(res => {
this.tianapi_data = res.data
})        
}    
},
  methods:{
      getweather:function(){
          // 定义一个that指向外面的this
          var that=this
          // （网络请求库）axios是请求后台资源的摸块（可以使用get与post等请求）
          axios.get('http://wthrcdn.etouch.cn/weather_mini?city='+this.city)
          // then为获取数据成功，catch为获取数据失败
          // response和err是自定义但data是数据之一，具体看有什么数据去网页f12控制台上看
          .then((response)=>{
              // console.log(response)可以看出axios了网页有什么数据
              console.log(response.data.data.forecast)
              that.weatherlist=response.data.data.forecast
          })
          .catch((err)=>{
              console.log(err)
          })
      },

      changecity:function(city){
          this.city=city;   //city为v-model的参数
          this.getweather();
      }
  },

  // js代码如下
// 显示地图
showMap: function () {
  // 创建Map实例
  let map = new BMap.Map("allmap");
  // 初始化地图,设置中心点坐标，
  let point = new BMap.Point(120.21,30.25);
  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom(true)
  map.enableDoubleClickZoom(true)
  map.setCurrentCity("杭州"); 
  let marker = new BMap.Marker(point);  
  map.addOverlay(marker);
},
//根据输入的地址信息进行搜索
setPlace:function () {
  let map = new BMap.Map("allmap");
  let point = new BMap.Point(120.21,30.25);
  map.enableScrollWheelZoom(true)
  map.enableDoubleClickZoom(true)
  let province = $.trim($("#province option:selected").text())
  let city = $.trim($("#city option:selected").text())
  let myValue
  if (province == city) {
    myValue = province+$.trim($("#area option:selected").text())+$.trim($("#street").val())
  } else {
    myValue = province+city+$.trim($("#area option:selected").text())+$.trim($("#street").val())
  }
  //清除地图上所有覆盖物
  map.clearOverlays();    
  let vm = this
  let local = new BMap.LocalSearch(map, { //智能搜索
    onSearchComplete: function () {
      vm.userlocation = local.getResults().getPoi(0).point;    //获取智能搜索的结果
      map.centerAndZoom(vm.userlocation, 18);
      map.addOverlay(new BMap.Marker(vm.userlocation));    //添加标注
      //经度
      $("#longitude").val(vm.userlocation.lng)
      //维度
      $("#latitude").val(vm.userlocation.lat)
    }
  });
  local.search(myValue);
},
//逆地址解析 根据经纬度显示详细地址名称
resetPlace: function () {
  let vm = this
  let longitude = $("#longitude").val()
  let latitude = $("#latitude").val()
  let map = new BMap.Map("allmap");
  let point = new BMap.Point(longitude,latitude);
  map.centerAndZoom(point,20)
  map.enableScrollWheelZoom(true)
  if(longitude != "" && latitude != ""){
    map.clearOverlays(); 
    let point = new BMap.Point(longitude,latitude);
    let geoc = new BMap.Geocoder(); 
    geoc.getLocation(point,function(rs){ 
      let addComp = rs.addressComponents; 
      let site_address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
      $('#street').val(site_address)
    });
    let marker = new BMap.Marker(point);  
    map.addOverlay(marker)
  } else {
    alert("请输入经纬度");
  }
},

})
