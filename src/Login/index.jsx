/** @jsx jsx */

import { jsx, css } from '@emotion/core'
import React from 'react'
import { message, Row, Col } from 'antd'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { doLogin } from '../actions'
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
    wyAxiosPost('Login/checkLogin',values,(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        const  token = responseData.token
        //写入localStorage
        localStorage.user_token = token
        //写入redux
        this.props.doLogin({user_token:token})
        this.props.history.push('/admin/dashboard/dashboardworkorder')
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  render(){
    // if(this.state.verificated){
    //   return (
    //     <Redirect to={{
    //       pathname: '/app',
    //       search: ''
    //     }}/>
    //   )
    // }else{
      return(
        <div style={{background: `url(${Background}) no-repeat`,backgroundSize:"cover"}} className="loginContainer evntContainer" css={{position: "relative"}}>
        {
          // <div className="apptitle">
          //   <Row>
          //     <Col style={{textAlign:"center"}}>
          //     <div style={{width: "50px",height:"50px",borderRadius:"25px",margin:"0 auto",background:"rgba(255,255,255,0.8)"}}>
          //       <img style={{width:"80px", height:"80px", margin:"-15px 0 0 -15px"}} src={require("../Login/images/dipperpic.png")} width="100%" />
          //     </div>
          //     </Col>
          //   </Row>
          //   <Row style={{marginTop:"8px"}}>
          //     <Col style={{textAlign:"center"}}>
          //       <img style={{width:"120px" ,height:"32px"}} src={require("../Login/images/netdipper.png")} width="100%" />
          //     </Col>
          //   </Row>
          // </div>
        }

          <div className="loginform" css={{ background:"rgba(0,0,0,0.2)",padding:"40px 60px 20px 60px",borderRadius:"10px",position: "absolute", top:"50%", marginTop:"-116px",left:"50%",marginLeft:"-158px"}}>
            <Loginfrom className="formponent" loginSubmit={this.loginSubmit.bind(this)}/>
          </div>
        </div>
      )
    //}
  }
}

const mapDispatchToProps = (dispatch)=>({
  doLogin: (value)=>{dispatch(doLogin(value))}
})
export default connect(null,mapDispatchToProps)(withRouter(LoginComponent))
