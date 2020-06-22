/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React ,{ Component} from 'react'
import _ from 'lodash'
import {Map, Marker, NavigationControl,
  InfoWindow, MapTypeControl, ScaleControl,
   OverviewMapControl, BMapLib, MapvLayer, MarkerList ,
   Boundary
 } from 'react-bmap'
import { message } from 'antd'
import {colors} from '../colors'

import simpleMapStyle from './styleJson'
const markerStyle = {
  minWidth:'160px',height: 'auto', lineHeight: '20px', background: '#009966', color:'#ffffff',borderRadius:'40px',
  boxShadow:"0px 0px 5px 1px rgba(0,204,102,1)",textAlign:"left",padding: "0 20px 0 20px",
  cursor:"pointer",
  "&:hover":{opacity:"0.8"},
  "&:active":{opacity:"1"},
}
class MapCityTech extends Component{
  //属性
  //mapStyle={{style: 'midnight'}} 样式配置
  //events={this.getEvents()} // 为地图添加各类监听事件
  state={
    curProps:{},
    curShow: 0,
    height: 200
  }
  componentDidMount(){
    this._isMounted = true
    if(this.props.curProps && this.props.curProps.lng){
      const { curProps,height } = _.cloneDeep(this.props)
      if(this._isMounted){
        this.setState({
          curProps,
          height
        },()=>{
          this.paoMove(this.state.curProps.cityTechData)
        })
      }
    }
  }
  paoMove = (data)=>{
    if(this.timer1){
      clearInterval(this.timer1)
    }
    const len = data.length
    let index = 0
    this.timer1 = setInterval(()=>{
      if(this._isMounted){
        this.setState({
          curShow: index
        },()=>{
          index = index + 1
          if(index === len){
            index = 0
          }
        })
      }
     },3000)
  }
  componentWillReceiveProps(nextProps){
    if((! _.isEqual(this.props.curProps,nextProps.curProps)) || this.props.height !== nextProps.height){
      const { curProps, height } = _.cloneDeep(nextProps)
      if(this._isMounted){
        this.setState({
          curProps,
          height
        },()=>{
          this.paoMove(this.state.curProps.cityTechData)
        })
      }
    }
  }

  isSupportCanvas = ()=>{
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
  componentWillUnmount(){
    this._isMounted =  false
  }


  render(){
    const BMap = window.BMap
    const { center, zoom, cityTechData, list } = this.state.curProps
    const { curShow, height } = this.state
    let areaList = []
    if(list && list.length>0){
      list.map(item=>{
        item.count = Math.random()*100
        areaList.push(item)
      })
    }
    //console.log(cityTechData[curShow]['list'][0].data)
    return(
      <div style={{height:`${height}px`, position:"relative"}}>
        <Map
          center={center && center.lng?center:{lng: 114.0661345267, lat: 22.5485544122}}
          zoom={'10'}
          style={{height:"100%"}}
          enableScrollWheelZoom={true}
          mapStyle={{style: 'midnight'}}
        >
        {
          // cityTechData?
          // <MapvLayer data={cityTechData[curShow]['list']} options={{
          //     fillStyle: 'rgba(255,51,0,0.3)',
          //     methods: {
          //       click: (item)=>{console.log(item)},
          //       dblclick: (item)=>{alert(item)}
          //     },
          //     shadowColor: 'rgba(255, 153, 102, 1)',
          //     shadowBlur: 50,
          //     globalCompositeOperation: 'lighter',
          //     size: 20,
          //     draw: 'simple',
          //     autoViewport: true,
          //     viewportOptions: {zoomFactor: 1}
          // }} />
          // :
          // ''
        }

        {
          areaList.length>0?
          <Boundary
            data={areaList}
            layerOptions={{
                gradient: {
                    0: '#00CC99',
                    1: '#FF6633',
                },
                max: 100,
                globalAlpha: 0.6,
                draw: 'intensity',
            }}
          />
          :
          ''
        }
        {
          // cityTechData && cityTechData[curShow]['list'].length>0?
          // cityTechData[curShow]['list'].map((item,index)=>{
          //   return (
          //     <MapvLayer key={item.name} data={item.data} options={{
          //         fillStyle: colors[index],
          //         methods: {
          //           click: (item)=>{console.log(item)},
          //           dblclick: (item)=>{alert(item)}
          //         },
          //         shadowColor: 'rgba(255, 153, 102, 0.1)',
          //         shadowBlur: 50,
          //         globalCompositeOperation: 'lighter',
          //         size: 20,
          //         draw: 'simple',
          //         autoViewport: true,
          //         viewportOptions: {zoomFactor: 1}
          //     }} />
          //   )
          // })
          // :
          // ''
        }
          <MapvLayer
              data={
                cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][0]?
                cityTechData[curShow]['list'][0].data
                :
                []
              }
              options={{
                  fillStyle: colors[0],
                  methods: {
                    click: (item)=>{console.log(item)},
                  },
                  shadowColor: 'rgba(255, 153, 102, 0.1)',
                  shadowBlur: 50,
                  globalCompositeOperation: 'lighter',
                  size: 20,
                  draw: 'simple',
                  autoViewport: false,
                  viewportOptions: {zoomFactor: 1},
                  zIndex: 1000
              }}
            />
          <MapvLayer
                data={cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][1]?cityTechData[curShow]['list'][1].data:[]}
                options={{
                    fillStyle: colors[1],
                    methods: {
                      click: (item)=>{console.log(item)},
                    },
                    shadowColor: 'rgba(255, 153, 102, 0.1)',
                    shadowBlur: 50,
                    globalCompositeOperation: 'lighter',
                    size: 20,
                    draw: 'simple',
                    autoViewport: false,
                    viewportOptions: {zoomFactor: 1},
                    zIndex: 1000
                }}
              />
          <MapvLayer
                  data={cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][2]?cityTechData[curShow]['list'][2].data:[]}
                  options={{
                      fillStyle: colors[2],
                      methods: {
                        click: (item)=>{console.log(item)},
                      },
                      shadowColor: 'rgba(255, 153, 102, 0.1)',
                      shadowBlur: 50,
                      globalCompositeOperation: 'lighter',
                      size: 20,
                      draw: 'simple',
                      autoViewport: false,
                      viewportOptions: {zoomFactor: 1},
                      zIndex: 1000
                  }}
                />
          <MapvLayer
                    data={cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][3]?cityTechData[curShow]['list'][3].data:[]}
                    options={{
                        fillStyle: colors[3],
                        methods: {
                          click: (item)=>{console.log(item)},
                        },
                        shadowColor: 'rgba(255, 153, 102, 0.1)',
                        shadowBlur: 50,
                        globalCompositeOperation: 'lighter',
                        size: 20,
                        draw: 'simple',
                        autoViewport: false,
                        viewportOptions: {zoomFactor: 1},
                        zIndex: 1000
                    }}
                  />
          <MapvLayer
                      data={cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][4]?cityTechData[curShow]['list'][4].data:[]}
                      options={{
                          fillStyle: colors[4],
                          methods: {
                            click: (item)=>{console.log(item)},
                          },
                          shadowColor: 'rgba(255, 153, 102, 0.1)',
                          shadowBlur: 50,
                          globalCompositeOperation: 'lighter',
                          size: 20,
                          draw: 'simple',
                          autoViewport: false,
                          viewportOptions: {zoomFactor: 1},
                          zIndex: 1000
                      }}
                    />
          <MapvLayer
            data={cityTechData && cityTechData.length>0 && cityTechData[curShow]['list'][5]?cityTechData[curShow]['list'][5].data:[]}
            options={{
                fillStyle: colors[5],
                methods: {
                  click: (item)=>{console.log(item)},
                },
                shadowColor: 'rgba(255, 153, 102, 0.1)',
                shadowBlur: 50,
                globalCompositeOperation: 'lighter',
                size: 20,
                draw: 'simple',
                autoViewport: false,
                viewportOptions: {zoomFactor: 1},
                zIndex: 1000
            }}
          />

        </Map>
        <div style={{width:"440px",display:"flex",background:"rgba(0,0,0,0.5)",padding:"5px 20px 5px 20px",borderRadius:"3px",position:"absolute",left:"40px",bottom:"40px"}}>
          <div style={{flex:"100px"}}>
            <span style={{color:"#00CC33",fontSize:"30px"}}>{cityTechData && cityTechData.length>0?cityTechData[curShow]['year']:''}</span>
          </div>
          <div style={{flex:"1 1 auto"}}>
            {
              cityTechData && cityTechData.length>0 && cityTechData[curShow]['list']?
              cityTechData[curShow]['list'].map((item,index)=>{
                return (
                  <span key={item.name} style={{color:colors[index],marginLeft:"20px"}}>
                    <span style={{display:"inline-block",width:"10px",height:"10px",borderRadius:"10px",background:colors[index]}}></span>
                    <span style={{marginLeft:"5px",color:colors[index]}}>{item.name}</span>
                    <span style={{marginLeft:"5px",color:colors[index]}}>{item.data.length}</span>
                  </span>
                )
              })
              :
              ''
            }
          </div>
        </div>
      </div>
    )
  }
}

export default MapCityTech


//curProps参数
//中心点
//center:{lng: 114.3527681268, lat: 22.6971726959}
//缩放级别
//zoom:'14'
//气泡图
{
  // <MapvLayer data={data} options={{
  //     fillStyle: 'rgba(255,51,0,1)',
  //     methods: {click: (item)=>{console.log(item)}},
  //     shadowColor: 'rgba(255, 153, 102, 1)',
  //     shadowBlur: 50,
  //     globalCompositeOperation: 'lighter',
  //     size: 20,
  //     draw: 'simple',
  //     autoViewport: true,
  //     viewportOptions: {zoomFactor: 1}
  // }} />
}
