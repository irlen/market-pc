import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { message, Spin } from 'antd'


import WySpin from '../WySpin'
import styleJson from './styleJson'
class ParkMap extends Component{
  state = {
    curProps:{},
    spinning: false,
    autoHeight: 0
  }
  createMap = ()=>{
    const container = document.getElementById('mapContainer')
    container.innerHTML = ''
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
    //绘制行政区域外覆盖物
    const getBoundary = (district)=>{
       map.clearOverlays(); // 清除地图的其余覆盖物
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
           strokeColor: 'none',
           fillColor: '#141A2D',
           fillOpacity: 0.2,
           strokeOpacity: 1
         });
         map.addOverlay(ply1);
         // 绘制整体的外轮廓

         for (let i = 0; i < count; i++) {
           const ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 0.5,
             strokeColor: '#141A2D', //行政区域分界线颜色
             strokeOpacity: 0.1,
             fillColor: '#141A2D', //行政区域填充背景颜色颜色
             fillOpacity: 0.1
            });
           map.addOverlay(ply);
         }
       });
     }

    //map.addControl(new BMap.NavigationControl(opts)) //缩放平移控件
    //中心坐标和原始缩放
    if(centerPoint && centerPoint.length>0){
      map.centerAndZoom(new BMap.Point(centerPoint[0], centerPoint[1]), initScale?initScale:8)
    }
    //根据城市名定位
    if(centerCity){
      map.centerAndZoom(centerCity,initScale?initScale:11)
    }

    //拉框放大功能
    if(isDragScale){
      const myDrag = new BMapLib.RectangleZoom(map, {});
      myDrag.open()
    }

    //取消地图双击缩放功能
    map.disableDoubleClickZoom()
    //设置鼠标样式
    map.setDefaultCursor("auto")

    if(boundaryData && boundaryData.name){
      getBoundary(boundaryData.name)
    }
    //滚轮缩放
    //if(isScrollWheelZoom){
      map.enableScrollWheelZoom()
    //}
    //自定义覆盖物
    if(overlayData){
      const ComplexCustomOverlay = function(
        point, //楼宇定位坐标，数组
        text, //显示文字
        building_floor, //楼宇层数
        type,
        type_id
         //mouseoverText,picName,id
       ){
        this._point = point;
        this._text = text;
        this._building_floor = building_floor
        this._type = type
        this._type_id = type_id
        // this._overText = mouseoverText;
        // this._picName = picName;
        // this._id = id;
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
        // div.id = this._id
        // div.type = this._picName
        const icon = this._icon = document.createElement("img");
        if(!this._biulding_floor){
          icon.src = require('../../asets/30.png')
        }else if(parseInt(this._biulding_floor)<10 || parseInt(this._biulding_floor) === 10){
          icon.src = require('../../asets/10.png')
        }else if(parseInt(this._biulding_floor)>10){
          icon.src = require('../../asets/20.png')
        }
        icon.width = 40
        div.appendChild(icon)
        var span = this._span = document.createElement("span");
        span.style.color = "#01bd4c"
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
        div.ondblclick = function(){
          const type_id = that._type_id
          const type = that._type
          const param = {type_id,type}
          if(_this.props.clickToBuild){
            _this.props.clickToBuild(param)
          }
        }
        div.onmouseover = function(){

          this.style.opacity = 0.5
          this.style.cursor = 'pointer'
          this.getElementsByTagName("span")[0].innerHTML = ''
          arrow.style.backgroundPosition = "0px -20px";
        }
        div.onmouseout = function(){
          this.style.opacity = 1
          this.getElementsByTagName("span")[0].innerHTML = that._text
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
        const {cp,name,type,id} = item
        const { building_floor } = item.detail
        const myCompOverlay = new ComplexCustomOverlay(
          new BMap.Point(cp[0],cp[1]),
          name,
          building_floor,
          type,
          id
        );
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
        this.createMap()
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
          this.createMap()
      })
    }
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
        <div  id="mapContainer" style={{width:"100%",height:`${relHeight}px`}} >
        </div>
      </Spin>
      </div>
    )
  }
}

export default ParkMap

//props
// centerPoint =[116.404, 39.915] 数组内为中心点坐标经纬度
// initScale = 11  地图初始显示的缩放值
// centerCity = '哈尔滨' 以城市为定位依据
// heatmapData = []  热力图数据
// isScrollWheelZoom = ture 是否开启滚轮缩放
