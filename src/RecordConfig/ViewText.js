import React, { Component } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import _ from 'lodash'
import { Button, message } from 'antd'
class ViewText extends Component {
  state = {
    data: '',
    isShow: false,
    copied: false,
  }
  componentDidMount(){
    this._isMounted = true
    const { data } = this.props
    if(data && this._isMounted){
      this.setState({
          data
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      if(nextProps.data && this._isMounted){
        const { data } = nextProps
        this.setState({
            data
        })
      }
    }
  }
  showCopyButton = ()=>{
    if(this._isMounted){
      this.setState({
        isShow: true
      })
    }
  }
  hideCopyButton = ()=>{
    if(this._isMounted){
      this.setState({
        isShow: false
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const {data,isShow} = this.state
    const doWrap = (str)=>{
      const newStr=str.replace(/\n/g,"<br/>")
      return newStr
    }
    return (
      <div onMouseOver={this.showCopyButton} onMouseOut={this.hideCopyButton}>
        <span style={{float:"right",marginRight:"20px",display:isShow && data?'block':'none'}}>
          <CopyToClipboard
            text={data}
            onCopy={() => this.setState({copied: true},()=>{message.success('复制成功！')})}
          >
            <Button >复制文本</Button>
          </CopyToClipboard>
        </span>
        <div style={{whiteSpace:"pre-wrap"}}  dangerouslySetInnerHTML={{__html:data?doWrap('<code >'+data+'</code>'):''}}>
        </div>
      </div>
    )
  }
}

export default ViewText
