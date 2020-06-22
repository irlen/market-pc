import React, { Component } from 'react'
import { Input, Select, Row, Col } from 'antd'
import _ from 'lodash'

const { TextArea } = Input
class ConstantForm_Editless extends Component {
  state = {
    data: {}
  }

  componentDidMount(){
    this._isMounted = true
    const {data} = this.props
    if(data){
      this.setState({
        data
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      const { data } = nextProps
      if(this._isMounted){
        this.setState({
          data
        })
      }
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { data } = this.state
    return (
      <div style={{lineHeight:"40px"}}>
        <div>
          工单名称：
        </div>
        <div>
          <span style={{fontWeight:"bold"}}>{data.order_name}</span>
        </div>
        <div style={{marginTop:"40px"}}>
          工单备注：
        </div>
        <div>
          {data.order_note}
        </div>
      </div>
    )
  }
}


export default ConstantForm_Editless
