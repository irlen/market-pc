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


import { simpleMapStyle } from './mapStyle'
const markerStyle = {
  minWidth:'160px',height: 'auto', lineHeight: '20px', background: '#009966', color:'#ffffff',borderRadius:'40px',
  boxShadow:"0px 0px 5px 1px rgba(0,204,102,1)",textAlign:"left",padding: "0 20px 0 20px",
  cursor:"pointer",
  "&:hover":{opacity:"0.8"},
  "&:active":{opacity:"1"},
}
class RbMap extends Component{
  //属性
  //mapStyle={{style: 'midnight'}} 样式配置
  //events={this.getEvents()} // 为地图添加各类监听事件
  state={
    curProps:{},
    curShowInfo:'',
    info:{}
  }
  componentDidMount(){
    this._isMounted = true
    if(this.props.curProps && this.props.curProps.lng){
      const curProps = _.cloneDeep(this.props)
      if(this._isMounted){
        this.setState({
          curProps
        })
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props,nextProps)){
      if(this._isMounted){
        this.setState({
          curProps: _.cloneDeep(nextProps.curProps)
        })
      }
    }
  }
  changeInfo=(id)=>{
    if(this._isMounted){
      if(this.state.curProps.cityParkData){
        const cityParkData = this.state.curProps.cityParkData
        const info = _.find(cityParkData, function(o) { return o.id === id })
        this.setState({
          curShowInfo:id,
          info
        })
        return
      }
      this.setState({
        curShowInfo:id
      })
    }
  }
  cancelInfo=()=>{
    if(this._isMounted){
      this.setState({
        curShowInfo:''
      })
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
    const { center, zoom, parkData, cityParkData, height } = this.state.curProps
    const { curShowInfo, info } = this.state
    return(
      <div style={{width:"100%",height:`${height}px`}}>
      {
        center && center.lng?
        <Map
          center={center && center.lng?center:{lng: 114.0661345267, lat: 22.5485544122}}
          zoom={zoom?zoom:'14'}
          style={{height:"100%"}}
          enableScrollWheelZoom={true}
          mapStyle={{style: 'midnight'}}
        >

        { //indusPark数据
          parkData?
          <Marker position={parkData.position}>
            <div
              //onClick={()=>{this.changeInfo(parkData.parkDetail.id)}}
              style={{cursor:"pointer"}}
              onMouseEnter={()=>{this.changeInfo(parkData.parkDetail.id)}}
              onMouseOut={()=>{this.changeInfo()}}
            >
              <div><img  src={require('../../asets/10.png')} width={60} /></div>
              <div><span style={{color:"#00FF33"}}>{parkData.parkDetail.park_name}</span></div>
            </div>
          </Marker>
          :
          ''
        }
        { //indusPark数据
          parkData && curShowInfo ?
          <Marker
            position={parkData.position}
            offset={new BMap.Size(-180, -220)}
          >
              <div onClick={()=>{alert('跳转至用户编辑页面，需后台校验正确后写入，可编辑字段待定')}}
                style={{
                width: '400px', height: '200px', lineHeight: '30px',
                background: 'rgba(0,0,0,0.8)',
                textAlign: 'center',
                borderRadius:"5px",
                position:"relative"
              }}>
                <div style={{color:"00FF33",textAlign:"left",padding:"10px 20px 0 20px"}}>
                  <div style={{textAlign:"center"}}>可加载图片资源...</div>
                  <div style={{textAlign:"center",color:"#00FF33"}}>{parkData.parkDetail.park_name}</div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>项目情况：</div>
                    <div style={{flex:"1 1 auto"}}>{parkData.parkDetail.project_status}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>楼宇数量：</div>
                    <div style={{flex:"1 1 auto"}}>{parkData.parkDetail.built_number}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>企业数量：</div>
                    <div style={{flex:"1 1 auto"}}>{parkData.parkDetail.enterprises_number}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>园区地址：</div>
                    <div
                      title={parkData.parkDetail.detailed_address}
                      style={{
                          flex:"1 1 auto",
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                      }}
                  >{parkData.parkDetail.detailed_address}</div>
                  </div>
                </div>
                <div
                  style={{
                    width:0,
                    height:0,
                    overflow:'hidden',
                    fontSize: 0,     /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
                    lineHeight: 0,  /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
                    borderWidth:'10px 10px 10px 10px',
                    borderStyle:'solid',
                    borderColor:'rgba(0,0,0,0.8) transparent transparent transparent',
                    position:'absolute',
                    bottom:'-20px',
                    left: '50%',
                  }}
                ></div>
              </div>
              <span
                style={{position:"absolute",top: '5px',
                  right:'8px',
                  cursor:"pointer"
                }}
                onClick={this.cancelInfo}
                >
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
          </Marker>
          :
          ''
        }
        {
          //indusCityPark数据
          cityParkData && cityParkData.length>0?
          cityParkData.map(item=>{
            const { lng, lat } = item
            const position = {lng,lat}
            return  <Marker
            key={item.id}
            position={position}
            >
                <div
                  style={{cursor:"pointer"}}
                  onClick={
                    this.props.toPark?
                    ()=>{this.props.toPark({type_id:item.id, type:"park", mapArea:item.area})}
                    :
                    ()=>{return}
                  }
                  onMouseEnter={()=>{this.changeInfo(item.id)}}
                  onMouseOut={()=>{this.changeInfo()}}
                >
                  <div><img  src={require('../../asets/10.png')} width={60} /></div>
                  <div style={{color:"#00FF33"}}>{item.name}</div>
                </div>
              </Marker>
          })
          :
          ''
        }
        { //indusCityPark数据
          cityParkData && curShowInfo && info ?
          <Marker
            position={{lng: info.lng,lat: info.lat}}
            offset={new BMap.Size(-180, -280)}
            zIndex={10000}
          >
              <div onClick={()=>{alert('跳转至用户编辑页面，需后台校验正确后写入，可编辑字段待定')}}
                style={{
                width: '400px', height: '270px', lineHeight: '30px',
                background: 'rgba(0,0,0,0.8)',
                textAlign: 'center',
                borderRadius:"5px",
                position:"relative"
              }}>
                <div style={{color:"00FF33",textAlign:"left",padding:"10px 20px 0 20px"}}>
                  <div style={{textAlign:"center"}}>可加载图片资源...</div>
                  <div style={{textAlign:"center",color:"#00FF33"}}>{info.name}</div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>开发时间：</div>
                    <div style={{flex:"1 1 auto"}}>{info.development_time}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>园区地址：</div>
                    <div
                      title={info.detailed_address}
                      style={{
                          flex:"1 1 auto",
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                      }}
                  >{info.detailed_address}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>开发商：</div>
                    <div style={{flex:"1 1 auto"}}>{info.developer_name}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>开发商属性：</div>
                    <div style={{flex:"1 1 auto"}}>{info.developer_attr}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>用地属性：</div>
                    <div style={{flex:"1 1 auto"}}>{info.land_usage}</div>
                  </div>
                  <div style={{display:"flex"}}>
                    <div style={{flex:"0 0 100px"}}>项目情况：</div>
                    <div style={{flex:"1 1 auto"}}>{info.project_status}</div>
                  </div>
                </div>
                <div
                  style={{
                    width:0,
                    height:0,
                    overflow:'hidden',
                    fontSize: 0,     /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
                    lineHeight: 0,  /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
                    borderWidth:'10px 10px 10px 10px',
                    borderStyle:'solid',
                    borderColor:'rgba(0,0,0,0.8) transparent transparent transparent',
                    position:'absolute',
                    bottom:'-20px',
                    left: '50%',
                  }}
                ></div>
              </div>
              <span
                style={{position:"absolute",top: '5px',
                  right:'8px',
                  cursor:"pointer"
                }}
                onClick={this.cancelInfo}
                >
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
          </Marker>
          :
          ''
        }
        </Map>
        :
        ''
      }

      </div>
    )
  }
}

export default RbMap


//curProps参数
//中心点
//center:{lng: 114.3527681268, lat: 22.6971726959}
//缩放级别
//zoom:'14'
//标记
{
  // <Marker position={{lng: 114.3527681268, lat: 22.6971726959}} offset={new BMap.Size(-75, -60)}>
  //     <div
  //       onClick={function(){alert('返回区域ID和产业ID')}}
  //       css={markerStyle}>
  //         <div>区域：坪山新区</div>
  //         <div>个数：12344</div>
  //     </div>
  // </Marker>
}
{
  // <Marker position={{lng: 114.2542519005, lat: 22.7261548561}}>
  //   <div><img  src={require('../../asets/logo.png')} /></div>
  // </Marker>
}
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
