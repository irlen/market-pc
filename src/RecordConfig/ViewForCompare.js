/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React , { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button, Modal, Tabs } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'

import { wyAxiosPost } from '../components/WyAxios'
import { StyleContainer } from '../components/IndusModel'
import ViewTable from './ViewTable'
import ViewText from './ViewText'
import ViewTabsTable from './ViewTabsTable'
import { setActivekeys } from '../actions'

const { TabPane } = Tabs
const compare_fields = [
  {name:"版本信息",field: 'version',showType:'text'},
  {name:"配置信息",field: 'running_config',showType:'text'},
  {name:"组信息",field: 'object_group',showType:'text'},
  {name:"策略信息",field: 'access_list',showType:'text'},
  {name:"路由信息",field: 'ip_route',showType:'text'},
  {name:"接口信息",field: 'interfaces',showType:'text'}
]
class ViewForCompare extends Component{
  state = {
    compareData:'',
    windowH: 200,
    activeKey:'version',
    name: '',
    ids:''
  }
  componentDidMount(){
    this._isMounted = true
    const { windowH,ids,name} = this.props
    if(ids && ids.length === 2){
      this.setState({
        windowH,
        ids,
        name
      },()=>{
        //此处请求数据
        const { name, ids, activeKey } = this.state
        const param = { name, ids, activeKey }
        this.getCompareData(param)
      })
    }
  }
  getCompareData = (param)=>{
    wyAxiosPost('Order/textComparison',{...param},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          compareData: responseData
        })
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if(
      this.props.name !== nextProps.name ||
      ! _.isEqual(this.props.ids,nextProps.ids)
    ){
      if(this._isMounted){
        this.setState({
          name: nextProps.name,
          ids: nextProps.ids
        },()=>{
          const { name, ids, activeKey } = this.state
          const param = { name, ids, activeKey }
          this.getCompareData(param)
        })
      }
    }
    if(this.props.windowH !== nextProps.windowH && this._isMounted){
      this.setState({
        windowH: nextProps.windowH
      })
    }
  }
  tabsChange = (activeKey)=>{
    if(this._isMounted){
      this.setState({
        activeKey
      },()=>{
        //取最新的对比
        const { name, ids, activeKey } = this.state
        const param = { name, ids, activeKey }
        this.getCompareData(param)
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { windowH, activeKey, compareData } = this.state
    let height = 300
    if(windowH>400){
      height = windowH - 260
    }
    return (
      <Tabs
        tabPosition={'left'}
        onChange={this.tabsChange}
        activeKey={activeKey}
      >
          {
            compare_fields && compare_fields.length>0?
            compare_fields.map(item=>{
              return (
                <TabPane tab={item.name} key={item.field}>
                  <Scrollbars
                    autoHide
                    autoHideTimeout={100}
                    autoHideDuration={200}
                    universal={true}
                    style={{height: height+'px'}}
                  >
                    <div dangerouslySetInnerHTML={{__html:compareData}}>

                    </div>
                  </Scrollbars>
                </TabPane>
              )
            })
            :
            ''
          }
      </Tabs>
    )
  }
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})


export default connect(mapStateToProps,null)(ViewForCompare)
