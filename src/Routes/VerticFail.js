
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
class MyRedirect extends Component{
  componentDidMount(){
    if(localStorage.user_token){
      message.warning('sorry,您没有访问权限')
      setTimeout(()=>{this.props.history.goBack()},3000)
    }else{
      this.props.history.push('/login')
    }
  }
  render(){
    return(
      <div>

      </div>
    )
  }
}
export default withRouter(MyRedirect)
