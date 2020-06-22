/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import Avatarmenu from './Avatamenu'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Modal } from 'antd'

import { changeCity } from '../actions'
import { wyAxiosPost } from '../components/WyAxios'
import { userLogout } from '../actions'
import { base64Decode } from '../components/Base64'
import SelectCity from './SelectCity'
import './less/header.less'

class Header extends React.Component {
  state = {
    visible: false
  }
  componentWillMount(){
    this.username = ''
    if(localStorage.user_token){
      const user_token = localStorage.user_token
      const userArr = user_token.split('.')
      const userInfo = JSON.parse(base64Decode(userArr[1]))
      this.username = userInfo.username
    }
  }
  toNavRemember = ()=>{
    this.props.history.push('/')
  }


  handleCancel = e => {
    this.setState({
      visible: false,
    })
  }
  render(){
    return (
      <div className='pagetop' style={{display:"flex",background:"rgba(0,0,0,0.1)",height:"40px",lineHeight:"40px"}} >
          <div style={{background:"#",height:"100%",flex:"0 0 184px",paddingLeft:"10px"}}>
            <img onClick={this.toNavRemember} style={{cursor:"pointer"}} src={require("../asets/logo.png")} height="30" />
            <span style={{marginLeft:"10px"}}>防 火 墙 管 理 系 统</span>
          </div>
          <div style={{flex:"1 1 auto"}}>
          </div>
          <div style={{flex:"0 0 200px"}}>
            <Avatarmenu
              userName={`hello,${this.username}`}
            />
          </div>
      </div>
    )
  }
}


export default connect()(withRouter(Header))
