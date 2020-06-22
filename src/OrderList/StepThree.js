/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect  } from 'antd'
import _ from 'lodash'


const StyleDiv = styled.div({
  display:"flex",
  lineHeight:"40px"
})
const StyleLeft = styled.div({
  flex: "0 0 120px",
  textAlign: "right",
  paddingRight:"10px"
})
const StyleRight = styled.div({
  flex:"1 1 auto",
  verticalAlign:"middle"
})
class StepThree extends Component {
  state = {
    data:[],
    id:''
  }
  componentDidMount(){
    this._isMounted = true
    const {data,form,id} = this.props
    if(data){
      this.setState({
        data,id
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      const  data  = _.cloneDeep(nextProps.data)
      const { id } = nextProps
      const { form } = this.props
      if(this._isMounted){
        this.setState({
          data,id
        })
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { data } = this.state
    const doWrap = (str)=>{
      const newStr=str.replace(/\n/g,"<br/>")
      return newStr
    }
    const str = _.cloneDeep(data.msg)
    return (
      <div style={{marginBottom:"20px"}}>
        <StyleDiv>
          <StyleLeft>
            名称:
          </StyleLeft>
          <StyleRight>
            {data.name}
          </StyleRight>
        </StyleDiv>
        {
          data.ifname?
          <StyleDiv>
            <StyleLeft>
              接口:
            </StyleLeft>
            <StyleRight>
              {data.ifname}
            </StyleRight>
          </StyleDiv>
          :
          ''
        }
        {
          data.inout?
          <StyleDiv>
            <StyleLeft>
              流向:
            </StyleLeft>
            <StyleRight>
              {data.inout}
            </StyleRight>
          </StyleDiv>
          :
          ''
        }
        {
          str?
          <StyleDiv>
            <StyleLeft>
              信息:
            </StyleLeft>
            <StyleRight>
              <div dangerouslySetInnerHTML={{ __html:doWrap(str) }}></div>
            </StyleRight>
          </StyleDiv>
          :
          ''
        }

      </div>
    )
  }
}


export default StepThree
