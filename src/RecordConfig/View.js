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
class View extends Component{
  state = {
    viewData:[],
    windowH: 200,
    activeKey:'',
  }
  componentDidMount(){
    this._isMounted = true
    const { viewData, windowH, activeKeys} = this.props
    this.setState({
      windowH
    })
    if(viewData){
      let activeKey = viewData[0].key
      if(activeKeys.key){
        activeKey = activeKeys.key
      }
      this.setState({
        viewData,
        activeKey
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.viewData !== nextProps.viewData){
      if(this._isMounted){
        this.setState({
          viewData: nextProps.viewData
        })
      }
    }
    if(this.props.windowH !== nextProps.windowH && this._isMounted){
      this.setState({
        windowH: nextProps.windowH
      })
    }
    if(! _.isEqual(this.props.activeKeys,nextProps.activeKeys)){
      if(nextProps.activeKeys.key){
        this.setState({
          activeKey: nextProps.activeKeys.key
        })
      }else{
        this.setState({
          activeKey: nextProps.viewData && nextProps.viewData.length>0?nextProps.viewData[0].key:''
        })
      }
    }
  }
  tabsChange = (activeKey)=>{
    const { viewData } = this.state
    const subTabData = _.find(viewData,o=>{return o.key === activeKey})
    let name = ''
    if(subTabData && subTabData.data && subTabData.data.length>0){
      name = subTabData.data[0].key
    }
    const value = {key: activeKey,name}
    this.props.doSetActiveKeys(value)
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { viewData, windowH, activeKey } = this.state
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
            viewData && viewData.length>0?
            viewData.map(item=>{
              return (
                <TabPane tab={item.name} key={item.key}>
                  <Scrollbars
                    autoHide
                    autoHideTimeout={100}
                    autoHideDuration={200}
                    universal={true}
                    style={{height: height+'px'}}
                  >
                    {
                      item.showType === 'table'?
                      <ViewTable data={item.data}/>
                      :
                      ''
                    }
                    {
                      item.showType === 'text'?
                      <ViewText data={item.data}/>
                      :
                      ''
                    }
                    {
                      item.showType === 'tabsTable'?
                      <ViewTabsTable data={item.data}/>
                      :
                      ''
                    }

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
  windowH: state.windowH.windowH,
  activeKeys: state.recordConfig.activeKeys
})
const mapDispatchToProps = dispatch =>({
  doSetActiveKeys: (value)=>{dispatch(setActivekeys(value))}
})

export default connect(mapStateToProps,mapDispatchToProps)(View)
