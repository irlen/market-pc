/** @jsx jsx */
import React, { Component } from 'react'
import { Menu, Icon, Button } from 'antd'
import { withTheme } from 'emotion-theming'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import { adminRoute } from '../Routes/routeConfig'
import { base64Decode } from '../components/Base64'

const SubMenu = Menu.SubMenu
const selectStyle = {color:"#01bd4c"}
class SideNav extends Component {
  state = {
    collapsed: false,
    openKeys:[]
  }
  componentDidMount(){
    this._isMounted = true
  }
  toggleCollapsed = () => {
    if(this._isMounted){
      const coll = this.state.collapsed
      if(coll){
        //this.props.setLeftW('200')
        this.props.setLeftW('160')
      }else{
        this.props.setLeftW('60')
      }

      this.setState({
        collapsed: !this.state.collapsed,
        openKeys: !this.state.collapsed?[]:this.state.openKeys
      }
    )}
  }

  onOpenChange = (openKeys)=>{
    if(this._isMounted){
      this.setState({
        openKeys
      })
    }
    if(openKeys.length === 1 || openKeys.length === 0){
      if(this._isMounted){
        this.setState({
          openKeys
        })
      }
      return
    }
    const latestOpenKey = openKeys[openKeys.length - 1]
    if(this._isMounted){
      this.setState({
        openKeys:[latestOpenKey]
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    let NavStyle = styled.div({
      background:"none"
    })
    const selectedKeys = []
    selectedKeys.push(this.props.location.pathname)
    const reg = /\/[a-z]+/g
    const pathArray = this.props.location.pathname.match(reg)
    const oneLever = pathArray[0]+pathArray[1]
    // if(!localStorage.user_token){
    //   this.props.history.push('/')
    //   return null
    // }
    //const userInfoArr = localStorage.user_token.split('.')
    //const userInfo = JSON.parse(base64Decode(userInfoArr[1]))
    //const userId = userInfo.role

    const userId = '1'
    return (
      <div>
        <NavStyle>
          <Menu
            selectedKeys={selectedKeys}
            mode="inline"
            inlineCollapsed={this.state.collapsed}
            onOpenChange={this.onOpenChange}
            openKeys={this.state.openKeys}
          >
            {
              adminRoute && adminRoute.length>0?
              adminRoute.map(item=>{
                //控制用户页面显示情况
                if(userId === '1' || userId === '2'){
                  return(
                    <SubMenu
                      key={ item.key }
                      title={
                        <span style={oneLever===item.key?selectStyle:{}}>
                          <i className={ item.icon } aria-hidden="true"></i>
                          <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                          <span>{ item.name }</span>
                        </span>
                      }
                    >
                    {
                      item.routes && item.routes.length>0 && item.type==='two'?
                      item.routes.map(subItem=>{
                        return (
                          <SubMenu
                            key={ item.key }
                            title={
                              <span>
                                <i className={ item.icon } aria-hidden="true"></i>
                                <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                                <span>{ item.name }</span>
                              </span>
                            }
                          >
                            {
                              subItem.routes && subItem.routes.length>0?
                              subItem.routes.map(sub2item=>{
                                return (
                                  <Menu.Item key={ sub2item.path }>
                                    <NavLink to={ sub2item.path }> { sub2item.name } </NavLink>
                                  </Menu.Item>
                                )
                              })
                              :
                              ''
                            }
                          </SubMenu>
                        )
                      })
                      :
                      ''
                    }
                    {
                      item.routes && item.routes.length>0?
                      item.routes.map(subItem=>{
                        return (
                          <Menu.Item  key={ subItem.path } onClick={this.selectedKeysChange} >
                            <NavLink to={ subItem.path }> { subItem.name } </NavLink>
                          </Menu.Item>
                        )
                      })
                      :
                      ''
                    }
                    </SubMenu>
                  )
                }else{
                  if(item.key !== '/admin/user'){
                    return(
                      <SubMenu
                        key={ item.key }
                        title={
                          <span style={oneLever===item.key?selectStyle:{}}>
                            <i className={ item.icon } aria-hidden="true"></i>
                            <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                            <span>{ item.name }</span>
                          </span>
                        }
                      >
                      {
                        item.routes && item.routes.length>0 && item.type==='two'?
                        item.routes.map(subItem=>{
                          return (
                            <SubMenu
                              key={ item.key }
                              title={
                                <span>
                                  <i className={ item.icon } aria-hidden="true"></i>
                                  <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                                  <span>{ item.name }</span>
                                </span>
                              }
                            >
                              {
                                subItem.routes && subItem.routes.length>0?
                                subItem.routes.map(sub2item=>{
                                  return (
                                    <Menu.Item key={ sub2item.path }>
                                      <NavLink to={ sub2item.path }> { sub2item.name } </NavLink>
                                    </Menu.Item>
                                  )
                                })
                                :
                                ''
                              }
                            </SubMenu>
                          )
                        })
                        :
                        ''
                      }
                      {
                        item.routes && item.routes.length>0?
                        item.routes.map(subItem=>{
                          return (
                            <Menu.Item  key={ subItem.path } onClick={this.selectedKeysChange} >
                              <NavLink to={ subItem.path }> { subItem.name } </NavLink>
                            </Menu.Item>
                          )
                        })
                        :
                        ''
                      }
                      </SubMenu>
                    )
                  }
                }

              })
              :
              ''
            }

          </Menu>
          <div style={{textAlign:"center",cursor:"pointer",color:"#01bd4c"}} onClick={this.toggleCollapsed}>
            {
              // this.state.collapsed?
              // <span>
              //   <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              //   <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              // </span>
              // :
              // <span>
              //   <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              //   <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              // </span>

            }
          </div>
        </NavStyle>
      </div>
    )
  }
}

export default withTheme(withRouter(SideNav))
