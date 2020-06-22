import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { message, Spin } from 'antd'


import WySpin from '../WySpin'
import styleJson from './styleJson'

class SgMap extends Component{
  state = {
    curProps:{},
    spinning: false,
    autoHeight: 0
  }
  createMap = ()=>{
    // const container = document.getElementById('mapContainer')
    // container.innerHTML = ''
    console.log(this.state.curProps)
    if(this._isMounted){
      this.setState({
        spinning: true
      })
    }
    const _this = this
    const {
      centerPoint, //中心坐标定位
      initScale, //初始缩放值
      centerCity, //中心城市定位
      isScrollWheelZoom,
      boundaryData, //行政区域划分数据
      heatmapData, //热力图数据
      isNavigation, //左上角导航放大
      isScale, //缩放
      isOverview, //全景
      isMapType, //地图类型
      isDragScale, //拉框放大
      mapArea,   //整个地图区域
      isClick,   //是否可点击下级区
      overlayData, //区内产业园，楼宇，企业
    } = this.state.curProps
    //*地图的创建*******************************************************************************************************
    const BMap = window.BMap
    const BMapLib = window.BMapLib
    const { INFOBOX_AT_TOP } = window //显示信息时候要调用
    const opts = {offset: new BMap.Size(10,55)}
    const map = new BMap.Map('mapContainer')
    //map.setMapStyle({styleJson}) //设置地图样式
    //加载热力图
    const loadHeadMap = ()=>{
      if(heatmapData){
        //热力图
        const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
      	map.addOverlay(heatmapOverlay)
      	heatmapOverlay.setDataSet({data:heatmapData,max:100});
      }
    }
    //绘制行政区域外覆盖物
    const getBoundary = (district)=>{
       //map.clearOverlays(); // 清除地图的其余覆盖物
       const bdary = new BMap.Boundary();
       bdary.get(district, (rs) => {
         const count = rs.boundaries.length;
         if (count === 0) {
           return ;
         }
         const EN_JW = '180, 90;';
         const NW_JW = '-180,  90;';
         const WS_JW = '-180, -90;';
         const SE_JW = '180, -90;';
         // 东南西北四个角添加一个覆盖物
         const ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW,
         {
           //strokeColor: '#0B1322',
           strokeColor: 'none',
           strokeOpacity: 0,
           fillColor: '#141A2D',
           fillOpacity: 1,

         });
         map.addOverlay(ply1);
         // 绘制整体的外轮廓
         for (let i = 0; i < count; i++) {
           const ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 0.5,
             strokeColor: '#141A2D', //行政区域分界线颜色
             strokeOpacity: 1,
             fillColor: '#141A2D', //行政区域填充背景颜色颜色
             fillOpacity: 1
            });
          // map.addOverlay(ply);
         }
         if(boundaryData && boundaryData.children.length>0){
           getRegion(boundaryData.children);
         }
       });
     }
    //绘制各个下级行政区域的轮廓
    const getRegion = (districts)=>{
      //获取到省内各个市州的名称以及他们的中心点坐标写成一个变量
      districts.forEach(element => {
          var bdary = new BMap.Boundary();
          bdary.get(element['name'], rs => {
            var count = rs.boundaries.length;
            for (let i = 0; i < count; i++) {
              const ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 1,
                strokeColor: '#00FF66', //下级行政区域分界线颜色
                strokeOpacity:'0.8',
                fillColor: '#00CC66', //下级行政区域填充背景颜色颜色
                fillOpacity: '0.1',
              });
              ply.name = element.name
              // ply.addEventListener("click",(event)=>{message.success('跳转至'+event.target.name)})
              // let curPly = new BMap.Polygon(rs.boundaries[i], {
              //   strokeWeight: 1,
              //   strokeColor: '#00FF66', //下级行政区域分界线颜色
              //   strokeOpacity:'0.8',
              //   fillColor: 'rgba(255,255,255,0.2)', //下级行政区域填充背景颜色颜色
              //   fillOpacity: '0.8'
              // })
              // ply.addEventListener("mouseover",(event)=>{
              //   console.log('进入')
              //   map.addOverlay(curPly)
              // })
              // ply.addEventListener("mouseout",(event)=>{
              //   console.log('出来')
              //   map.removeOverlay(curPly)
              // })
              map.addOverlay(ply);
            }
            citySetLabel(new BMap.Point(element['cp'][0], element['cp'][1]) , element['name']);
          });
        })
      loadHeadMap()
    }
    //城市中心点坐标显示label
    const citySetLabel = (cityCenter, cityName)=>{
        var label = new BMap.Label(cityName, {
          offset: new BMap.Size(-20, -10),
          position: cityCenter
        });
        label.setStyle({
          border: 'none',
          background: 'transparent',
          'font-size': '12px',
          color: '#00FF66',
        });
        map.addOverlay(label);
    }
    //if(this.props.isNavigation){
  //  map.addControl(new BMap.NavigationControl(opts)) //缩放平移控件
    //}

    if(this.props.isScale){
      map.addControl(new BMap.ScaleControl()) //缩放控件
    }
    if(this.props.isOverview){
      map.addControl(new BMap.OverviewMapControl()) //右下角鹰眼控件
    }
    if(this.props.isMapType){
      map.addControl(new BMap.MapTypeControl(opts)) //地图类型选择控件
    }
    //中心坐标和原始缩放
    if(centerPoint && centerPoint.length){
      map.centerAndZoom(new BMap.Point(centerPoint[0], centerPoint[1]), initScale?initScale:10)
    }
    //根据城市名定位
    if(centerCity){
    //  map.centerAndZoom(centerCity,initScale?initScale:11)
    }
    //滚轮缩放
    //if(isScrollWheelZoom){
      map.enableScrollWheelZoom()
    //}
    //拉框放大功能
    if(isDragScale){
      var myDrag = new BMapLib.RectangleZoom(map, {});
      myDrag.open()
    }
    //给地图添加事件
    //地图加载完毕回调
    //map.addEventListener("tilesloaded",()=>{})
    //取消地图双击缩放功能
    map.disableDoubleClickZoom()
    //设置鼠标样式
    map.setDefaultCursor("poiter")
    // 将地图在水平位置上移动x像素，垂直位置上移动y像素(x,y)
    // if(centerCity && (centerCity === '哈尔滨市' || centerCity === '哈尔滨')){
    //   map.panBy(0, -80)
    // }
    if(boundaryData&& boundaryData.name){
        getBoundary(boundaryData.name)
        // console.log(boundaryData)
        // if(boundaryData && boundaryData.children.length>0){
        //   getRegion(boundaryData.children);
        // }
    }

    //单击地图，根据坐标点拾取地图街道
    if(isClick){
      map.addEventListener("click", function (e) {
        const geoc = new BMap.Geocoder();
        const pt = e.point;
        geoc.getLocation(pt, function (rs) {
          const addComp = rs.addressComponents;
          console.log(addComp.province + ", " + addComp.city + ", " + addComp.district+", "+addComp.town );
          const eightDis = ["松北区","呼兰区","道里区","道外区","南岗区","香坊区","平房区","双城区"]
          if(addComp.city === mapArea && _this.props.mapClick && eightDis.indexOf(addComp.district) !== -1){
              const param = {area: addComp.district,city: mapArea}
              //_this.props.mapClick(param)
          }
        })
      })
    }
    //自定义覆盖物
    if(overlayData){
      const ComplexCustomOverlay = function(point,text, mouseoverText,picName,id,mapArea){
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
        this._picName = picName;
        this._id = id;
        this._mapArea = mapArea;
      }
      ComplexCustomOverlay.prototype = new BMap.Overlay()
      ComplexCustomOverlay.prototype.initialize = function(map){
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        //div.style.backgroundColor = "#EE5D5B";
        //div.style.border = "1px solid #BC3B3A";
        div.style.color = "white";
        div.style.height = "auto";
        div.style.padding = "2px";
        div.style.lineHeight = "18px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px"
        div.id = this._id
        div.type = this._picName
        div.mapArea = this._mapArea
        const icon = this._icon = document.createElement("img");
        icon.src = require('../../asets/'+this._picName+'.svg')
        icon.width = 20
        div.appendChild(icon)

        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        var that = this;

        var arrow = this._arrow = document.createElement("div");
        arrow.style.background = "url(//map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
        arrow.style.position = "absolute";
        arrow.style.width = "11px";
        arrow.style.height = "10px";
        arrow.style.top = "20px";
        arrow.style.left = "10px";
        arrow.style.overflow = "hidden";
        //div.appendChild(arrow);
        div.onclick = function(){
          const type_id = this.id
          const type = this.type
          const mapArea = this.mapArea
          const param = {type_id,type,mapArea}
          if(_this.props.clickToPark){
            _this.props.clickToPark(param)
          }
        }
        div.onmouseover = function(){
          //this.style.backgroundColor = "#6BADCA";
          //this.style.borderColor = "#0000ff";
          this.getElementsByTagName("span")[0].innerHTML = that._overText;
          arrow.style.backgroundPosition = "0px -20px";
        }
        div.onmouseout = function(){
          //this.style.backgroundColor = "#EE5D5B";
          //this.style.borderColor = "#BC3B3A";
          this.getElementsByTagName("span")[0].innerHTML = that._text;
          arrow.style.backgroundPosition = "0px 0px";
        }
        map.getPanes().labelPane.appendChild(div);
        return div;
      }
      ComplexCustomOverlay.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top  = pixel.y - 30 + "px";
      }
      overlayData.map(item=>{
        const {cp,type,name,id} = item
        const mapArea = _this.state.curProps.mapArea
        const myCompOverlay = new ComplexCustomOverlay(new BMap.Point(cp.lng,cp.lat),'',name,type,id,mapArea);
        map.addOverlay(myCompOverlay)
      })

    }

    if(this._isMounted){
        this.setState({
          spinning: false
        })
      }
   }

  componentDidMount(){
    this._isMounted = true
    if(this._isMounted){
      this.setState({
        curProps : _.cloneDeep(this.props.mapData)
      },()=>{
        if(this.state.curProps.mapArea){
          this.createMap()
        }
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(this._isMounted && (this.props.autoHeight !== nextProps.autoHeight)){
      this.setState({
        autoHeight: nextProps.autoHeight
      },()=>{
        this.createMap()
      })
    }
    if(this._isMounted && !_.isEqual(this.props.mapData,nextProps.mapData)){
      this.setState({
        curProps : _.cloneDeep(nextProps.mapData)
      },()=>{
        if(this.state.curProps.mapArea){
          this.createMap()
        }
      })
    }
  }
  shouldComponentUpdate(nextProps,nextState){
    if(! _.isEqual(this.props.mapData,nextProps.mapData)){
      return true
    }
    return false
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    const {autoHeight} = this.state
    const relHeight = autoHeight*30-40
    return (
      <div>
      <Spin spinning={this.state.spinning}>
        <div  id="mapContainer" style={{width:"100%",height:`${relHeight}px`,display:this.state.curProps.mapArea?'block':'none'}} >

        </div>
      </Spin>
      </div>
    )
  }
}

export default SgMap

//props
// centerPoint =[116.404, 39.915] 数组内为中心点坐标经纬度
// initScale = 11  地图初始显示的缩放值
// centerCity = '哈尔滨' 以城市为定位依据
// heatmapData = []  热力图数据
// isScrollWheelZoom = ture 是否开启滚轮缩放
