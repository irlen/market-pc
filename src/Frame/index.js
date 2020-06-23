import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { routerConfig } from '../router/routerConfig'
import { Link } from 'react-router-dom'


import { ARoute } from '../router'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu
class Frame extends Component{
  state={
    collapsed: false,
    windowH: 0,
    openKeys: ['/app/change'],
    selectedKeys: ['changerequest']
  }
  componentDidMount(){
    const pathname = this.props.location.pathname;
    const pathArry = pathname.split('/');
    let newArry = pathArry.filter(o=>{
      return o !== ""
    })
    if(this.props.windowH){
      this.setState({
        windowH: this.props.windowH
      })
    }
    if(newArry.length === 3){
      const selectedKeys = newArry[2];
      this.setState({
        selectedKeys
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.windowH !== nextProps.windowH){
      this.setState({
        windowH: nextProps.windowH
      })
    }
    if(this.props.location.pathname !== nextProps.location.pathname){
      const pathname = nextProps.location.pathname;
      const pathArry = pathname.split('/');
      let newArry = pathArry.filter(o=>{
        return o !== ""
      })

      if(newArry.length === 3){
        const selectedKeys = newArry[2];
        const openKeys = "/"+newArry[0]+"/"+newArry[1];
        this.setState({
          selectedKeys
        })
      }
    }
  }
  toggle = () => {
    const pathname = this.props.location.pathname;
    const pathArry = pathname.split('/');
    let newArry = pathArry.filter(o=>{
      return o !== ""
    })

    this.setState({
      collapsed: !this.state.collapsed,
    },()=>{
      if(!this.state.collapsed && newArry.length === 3){
        const openKeys = "/"+newArry[0]+"/"+newArry[1];
        this.setState({
          openKeys:[openKeys]
        })
      }else if(this.state.collapsed){
        this.setState({
          openKeys:[]
        })
      }
    })
  }
  openChange=(value)=>{
    this.setState({
      openKeys: value
    })
  }
  itemChange=(value)=>{
    const selectedKeys = value.selectedKeys
    this.setState({
      selectedKeys
    })
  }
  render(){
    const { windowH, openKeys, selectedKeys, collapsed } = this.state
    const digui = (arr)=>{
      return arr.map((item)=>{
        if(item.children && item.children.length>0){
          return <SubMenu
            key={item.key}
            title={
              <span>
                { item.icon }
                <span>{item.name}</span>
              </span>
            }
          >
            { digui(item.children) }
          </SubMenu>
        }else{
          return <Menu.Item key={item.key}>
            <Link to={item.path}>
            <span>{item.icon}</span>
            {item.name}
            </Link>
          </Menu.Item>
        }
      })
    }
    return (
        <Layout style={{height: windowH+"px"}}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div style={{height:"60px"}}>logo位置</div>
            <Menu
              theme="dark"
              mode="inline"
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              inlineIndent={20}
              onOpenChange={this.openChange}
              onSelect={this.itemChange}
              collapsed={collapsed.toString()}
              forceSubMenuRender={true}
            >
              {
                routerConfig && routerConfig.length>0?
                digui(routerConfig)
                :
                ''
              }
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0,color: "rgba(255,255,255,0.8)" }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                padding: 20,
              }}
            >
              <ARoute />
            </Content>
          </Layout>
        </Layout>
    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})

export default connect(mapStateToProps,null)(withRouter(Frame))
