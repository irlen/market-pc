/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/core'

import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { connect } from 'react-redux'
import { wyAxiosPost } from '../components/WyAxios'

const StyleButton = styled.span({
  lineHeight:"22px",
  cursor:"pointer",
  "&:hover":{
    fontWeight:"bold",
    opacity: 0.8
  },
  "&:active":{
    opacity: 1
  }
})
const BreadRoute = [
  {
    name:"首页",
    url:'/app',
    param:{}
  },
  {
    name:'市产业数据',
    url: '/app/industry/wholeview',
    param: {city:"哈尔滨市"}
  },
  {
    name:'区产业数据',
    url: '/app/industry/indusdistrict',
    param: {city:"哈尔滨市",area:"道里区"}
  },
  {
    name:'单个产业园',
    url: '/app/industry/induspark',
    param: {type_id:"11",type:"park",mapArea:"松北区"}
  },
  {
    name:'市产业园',
    url: '/app/industry/induscitypark',
    param: {type:"park",city:"哈尔滨市"}
  },
  {
    name:'市创新平台',
    url: '/app/industry/induscitytechnology',
    param: {type:"technology",city:"哈尔滨市"}
  },{
    name:'一级产业类别',
    url: '/app/industry/indusfirst',
    param: {type:"industry",level:"1",type_id:"1"}
  },{
    name:'二级产业类别',
    url: '/app/industry/indussecond',
    param: {type:"industry",level:"1",type_id:"1",pid:"12"}
  }
]
class BreadNav extends Component{
  state={
    breadNavList:[]
  }
  componentDidMount(){
    this._isMounted = true
    const path = this.props.match.path
    const param = JSON.parse(decodeURIComponent(this.props.match.params.id))
    const relPath = path.slice(0,-4)
    let breadNavList = []
    if(relPath === '/app/industry/indusdistrict'){
      //区产业数据
      const area = this.props.indusDistrict
      const {city} = this.props
      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },
        {
          name: area,
          url:'/app/industry/indusdistrict',
          param:{city,area}
        }
      ]
    }else if(relPath === '/app/industry/induspark'){
      //单个产业园数据
      const { type_id, type, mapArea } = this.props.indusPark
      const { city, parkName } = this.props
      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },{
          name: mapArea,
          url:'/app/industry/indusdistrict',
          param:{city,area:mapArea}
        },{
          name: parkName,
          url:'/app/industry/induspark',
          param:{type_id,type,mapArea}
        }
      ]
    }else if(relPath === '/app/industry/induscitypark'){
      //市产业园
      const { type, city } = this.props.indusCityPark
      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },{
          name: city+'产业园',
          url:'/app/industry/induscitypark',
          param:{city,type}
        }
      ]
    }else if(relPath === '/app/industry/induscitytechnology'){
      //市创新平台
      const { type, city } = this.props.indusCityTechnology
      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },{
          name: city+'创新平台',
          url:'/app/industry/induscitytechnology',
          param:{city,type}
        }
      ]
    }else if(relPath === '/app/industry/indusfirst'){
      //一级产业类别
      const { type, level, type_id, name } = this.props.indusFirst
      const { city } = this.props
      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },{
          name: name,
          url:'/app/industry/indusfirst',
          param:{ type, level, type_id }
        }
      ]
    }else if(relPath === '/app/industry/indussecond'){
      //二级产业类别
      const { type, level, type_id, name, pid, name1} = this.props.indusSecond
      const { city } = this.props

      breadNavList = [
        {
          name: city,
          url:'/app/industry/wholeview',
          param: {city}
        },{
          name: name1,
          url:'/app/industry/indusfirst',
          param:{ type, level, type_id:pid }
        },{
          name: name,
          url:'/app/industry/indussecond',
          param:{ type, level, type_id, pid }
        }
      ]
    }
    if(this._isMounted){
      this.setState({
        breadNavList
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props,nextProps)){
      const path = nextProps.match.path
      const param = JSON.parse(decodeURIComponent(nextProps.match.params.id))
      const relPath = path.slice(0,-4)
      let breadNavList = []
      if(relPath === '/app/industry/indusdistrict'){
        //区产业数据
        const area = nextProps.indusDistrict
        const {city} = nextProps
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },
          {
            name: area,
            url:'/app/industry/indusdistrict',
            param:{city,area}
          }
        ]
      }else if(relPath === '/app/industry/induspark'){
        //单个产业园数据
        const { type_id, type, mapArea } = nextProps.indusPark
        const { city, parkName } = nextProps
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },{
            name: mapArea,
            url:'/app/industry/indusdistrict',
            param:{city,area:mapArea}
          },{
            name: parkName,
            url:'/app/industry/induspark',
            param:{type_id,type,mapArea}
          }
        ]
      }else if(relPath === '/app/industry/induscitypark'){
        //市产业园
        const { type, city } = nextProps.indusCityPark
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },{
            name: city+'产业园',
            url:'/app/industry/induscitypark',
            param:{city,type}
          }
        ]
      }else if(relPath === '/app/industry/induscitytechnology'){
        //市创新平台
        const { type, city } = nextProps.indusCityTechnology
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },{
            name: city+'创新平台',
            url:'/app/industry/induscitytechnology',
            param:{city,type}
          }
        ]
      }else if(relPath === '/app/industry/indusfirst'){
        //一级产业类别
        const { type, level, type_id, name } = nextProps.indusFirst
        const { city } = nextProps
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },{
            name: name,
            url:'/app/industry/indusfirst',
            param:{ type, level, type_id }
          }
        ]
      }else if(relPath === '/app/industry/indussecond'){
        //二级产业类别
        const { type, level, type_id, name, pid, name1 } = nextProps.indusSecond
        const { city } = this.props
        breadNavList = [
          {
            name: city,
            url:'/app/industry/wholeview',
            param: {city}
          },{
            name: name1,
            url:'/app/industry/indusfirst',
            param:{ type, level, type_id:pid }
          },{
            name: name,
            url:'/app/industry/indussecond',
            param:{ type, level, type_id, pid }
          }
        ]
      }
      if(this._isMounted){
        this.setState({
          breadNavList
        })
      }
    }
  }
  toBack = ()=>{
    this.props.history.goBack()
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { breadNavList } = this.state
    return (
      <div style={{paddingLeft:"20px",fontSize:"12px",opacity:"0.6",paddingBottom:"10px",display:"flex"}}>
        <div style={{flex:"0 0 60px"}}>
          <StyleButton onClick={this.toBack}><i style={{color:"#01bd4c"}} className="fa fa-angle-double-left" aria-hidden="true"></i><span style={{paddingLeft:"10px",color:"#01bd4c"}}>返回</span></StyleButton>
        </div>
        <div style={{flex:"1 1 auto"}}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to='/app'>
                首页
              </Link>
            </Breadcrumb.Item>
            {
              breadNavList && breadNavList.length>0?
              breadNavList.map((item,index)=>{
                const relUrl = item.url +'/'+encodeURIComponent(JSON.stringify(item.param))
                return (
                  <Breadcrumb.Item key={item.url}>
                    <Link to={relUrl}>
                      {item.name}
                    </Link>
                  </Breadcrumb.Item>
                )
              })
              :
              ''
            }

          </Breadcrumb>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  city: state.currentCity.currentCity,
  indusDistrict: state.indusDistrict.mapArea,

  indusPark: state.indusPark.typeInfo,
  parkName: state.indusPark.parkInfo.name,

  indusCityPark: state.indusCityPark.cityParkInfo,

  indusCityTechnology: state.indusCityTechnology.cityTechnologyInfo,

  indusFirst: state.indusFirst.indusFirstInfo,

  indusSecond: state.indusSecond.indusSecondInfo,
})
export default connect(mapStateToProps,null)(withRouter(BreadNav))
