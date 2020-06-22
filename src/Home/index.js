/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Input } from 'antd'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { wyAxiosPost } from '../components/WyAxios'
const { Search } = Input
const style1 = {
  width:"100%",
  background:"rgba(0,0,0,0.6)",
  borderRadius:"10px",
  padding:"20px",
  lineHeight:"30px"
}
const LiStyle = styled.li({
  float:'left',
  margin:"5px",
  cursor:"pointer",
  "&:hover":{
    color:"#01bd4c"
  },
  "&:active":{
    color:"#01bd4c",
    fontWeight:"bold"
  }
})
const LiStyle2 = styled.li({
  margin:"5px",
  cursor:"pointer",
  lineHeight:"22px",
  "&:hover":{
    color:"#01bd4c"
  },
  "&:active":{
    color:"#01bd4c",
    fontWeight:"bold"
  }
})
const haerbin = [
  {name:"道里",key:"道里"},
  {name:"南岗",key:"南岗"},
  {name:"道外",key:"道外"},
  {name:"平房",key:"平房"},
  {name:"松北",key:"松北"},
  {name:"香坊",key:"香坊"},
  {name:"呼兰",key:"呼兰"},
  {name:"阿城",key:"阿城"}
]


class Home extends Component{
  state={
    indusList:[],
    districtList:[],
    city:'哈尔滨市'
  }
  componentDidMount(){
    this._isMounted = true
    this.getIndusList()
    this.getDistrictList()
  }
  getIndusList = ()=>{
    wyAxiosPost('Industry/getOneClassify',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          indusList: _.cloneDeep(responseData.msg)
        })
      }
    })
  }
  getDistrictList = ()=>{
    const { city } = this.state
    wyAxiosPost('City/getCityArea',{ city },(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          districtList: _.cloneDeep(responseData.msg[0].children)
        })
      }
    })
  }
  toTrade = (param)=>{
    const url = '/app/industry/indusfirst/'+encodeURIComponent(JSON.stringify(param))
    this.props.history.push(url)
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const wH = this.props.wH - 100
    const indusH = this.props.wH - 560
    const { indusList, districtList, city } =  this.state
    return(
      <div style={{position:"relative",height:`${wH}px`,padding:"80px"
      }}>
        <div style={{height:`${wH-120}px`,width:"28%",float:"left"}}>
          <div style={{...style1,height:"134px"}}>
            <div style={{fontWeight:"bold"}}>区域</div>
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height:"76px"}}
              >
              <ul style={{listStyle:"none"}}>
                <LiStyle>
                  <Link to={'/app/industry/wholeview/'+encodeURIComponent(JSON.stringify({city}))} >不限</Link>
                 </LiStyle>
                {
                  districtList && districtList.length>0?
                  districtList.map((item,index)=>{
                    const eightDis = ["松北区","呼兰区","道里区","道外区","南岗区","香坊区","平房区","双城区"]
                    if(eightDis.indexOf(item.name) === -1){
                      return
                    }
                    const param = encodeURIComponent(JSON.stringify({district: item.name,city}))
                    const url = '/app/industry/wholeview/'+param
                    return <LiStyle key={item.name}>
                            <Link to={'/app/industry/indusdistrict/'+encodeURIComponent(JSON.stringify({city,area:item.name}))}>{item.name}</Link>
                           </LiStyle>
                  })
                  :
                  ''
                }
              </ul>
            </Scrollbars>
          </div>
          <div style={{...style1,marginTop:"10px",
            height:"-webkit-calc(100% - 264px)",
            height:"-moz-calc(100% - 264px)",
            height:"calc(100% - 264px)",
          }}>
            <div style={{fontWeight:"bold"}}>产业</div>
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{
                height:`${indusH}px`
              }}
              >
              <ul style={{listStyle:"none"}}>
                {
                  //<LiStyle2>不限</LiStyle2>
                }
                {
                  indusList && indusList.length>0?
                  indusList.map(item=>{
                    return <LiStyle2 onClick={()=>{this.toTrade({type:'industry',level:item.level,type_id: item.id})}} key={item.id}>{item.name}</LiStyle2>
                  })
                  :
                  ''
                }
              </ul>
            </Scrollbars>
          </div>
          <div style={{...style1,marginTop:"10px",height:"70px"}}>
            <Search style={{opacity:0.5}}/>
          </div>
        </div>
        <div style={{height:`${wH-160}px`,width:"68%",float:"right",background:"rgba(0,0,0,0.6)",borderRadius:"10px"}}>
          <div style={{lineHeight:`${wH-160}px`,fontSize:"60px",textAlign:"center"}}>哈尔滨产业地图大数据</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  wH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(withRouter(Home))
