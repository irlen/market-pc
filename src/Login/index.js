/** @jsx jsx */

import { jsx, css } from '@emotion/core'
import React from 'react'
import { message, Row, Col } from 'antd'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { doLogin } from '../redux/actions'
import Loginfrom from './loginform'
import { wyAxiosPost } from '../components/WyAxios'
import Background from '../asets/fireloginbg.png'
class LoginComponent extends React.Component {
  state={
    verificated: false
  }
  componentDidMount(){
    //容器高度自适应
    const loginContainer = document.querySelector(".loginContainer")
    const windowH = parseInt(document.body.clientHeight,0);
    loginContainer.style.height = windowH +'px'
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)
      loginContainer.style.height = rwindowH +'px'
    }
  }
  //登陆提交事件
  loginSubmit = (values)=>{
    console.log(values)
    wyAxiosPost('login/check',values,(result)=>{

      if(result.status === 1){
        const  token = result.msg
        //写入localStorage
        localStorage.user_token = token
        //写入redux
        this.props.doLogin({user_token:token})
        this.props.history.push('/app/set/setmonitor');
        //this.props.history.go();
      }else{
        message.warning(result.msg)
      }
    })
  }
  render(){
      return(
        <div style={{background: `url(${Background}) no-repeat`,backgroundSize:"cover"}} className="loginContainer evntContainer" css={{position: "relative"}}>
          <div className="loginform" css={{ background:"rgba(0,0,0,0.2)",padding:"40px 60px 20px 60px",borderRadius:"10px",position: "absolute", top:"50%", marginTop:"-116px",left:"50%",marginLeft:"-158px"}}>
            <Loginfrom className="formponent" loginSubmit={this.loginSubmit.bind(this)}/>
          </div>
        </div>
      )
  }
}

const mapDispatchToProps = (dispatch)=>({
  doLogin: (value)=>{dispatch(doLogin(value))}
})
export default connect(null,mapDispatchToProps)(withRouter(LoginComponent))
