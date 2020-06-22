
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { message } from 'antd'
import { connect } from 'react-redux'

import { getLockedUrl } from '../actions'
class MyRedirect extends Component{
  componentDidMount(){
    // if(localStorage.user_token){
    //   message.warning('sorry,您没有访问权限')
    //   setTimeout(()=>{this.props.history.goBack()},3000)
    // }else{
    //   console.log(this.props.history)
    //   const lockedPath = this.props.history.location.pathname
    //   this.props.getLockedUrl(lockedPath)
    //   this.props.history.push('/userlogin')
    // }
  }
  render(){
    return(
      <div>
        请您先登录
      </div>
    )
  }
}
// const mapDispatchToProps = (dispatch)=>({
//   getLockedUrl: (value)=>{dispatch(getLockedUrl(value))}
// })
export default connect()(withRouter(MyRedirect))
