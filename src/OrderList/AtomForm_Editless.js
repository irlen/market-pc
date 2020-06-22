/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../components/WyAxios'
import { singleIp, groupIp, rangeIp, singlePort } from '../components/RegExp'
const { TextArea } = Input
const { Option } = Select
const { TreeNode } = TreeSelect
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
class AtomForm_Editless extends Component {
  state = {
    device_list:[],
    data:{},
    devices: []
  }
  componentDidMount(){
    this._isMounted = true
    this.getDevices()
    const {data,form} = this.props
    if(data){
      this.setState({
        data
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      const  data  = _.cloneDeep(nextProps.data)
      const { form } = this.props
      if(this._isMounted){
        this.setState({
          data
        })
      }
    }
  }

  getDevices = ()=>{
    wyAxiosPost('Firewall/getDeviceName',{},(result)=>{
      const responseData = _.cloneDeep(result.data.msg.msg)
      const relData = []
      responseData.map(item=>{
        if(item.children && item.children.length>0){
          const subData = item.children
          subData.map(subItem=>{
            if(subItem.children && subItem.children.length>0){
              const sonData = subItem.children
              sonData.map(sonItem=>{
                const atom = {name: item.name+'-'+subItem.name+'-'+sonItem.name,value: item.value+'-'+subItem.value+'-'+sonItem.value}
                relData.push(atom)
              })
            }else{
              const atom = {name: item.name+'-'+subItem.name,value: item.value+'-'+subItem.value}
              relData.push(atom)
            }
          })
        }else{
          const atom = {name: item.name,value: item.value}
          relData.push(atom)
        }
      })



      if(this._isMounted){
        this.setState({
          device_list: _.cloneDeep(relData)
        })
      }
    })
  }
  minuStragidy = (id)=>{
    this.props.removeStragidy(id)
  }
  handleSubmit = e => {
   e.preventDefault();
   this.props.form.validateFieldsAndScroll((err, values) => {
     if (!err) {
       console.log('Received values of form: ', values);
     }
   })
 }


  componentWillUnmount(){
    this._isMounted = false
  }
  render(){

    const { device_list, data, devices } = this.state
    console.log(data)
    return (
      <div style={{marginBottom:"20px"}}>

          <div style={{display:"flex"}}>
            <div style={{flex:"1 1 auto",borderBottom:"#cccccc dashed 1px"}}>
              <Row gutter={16}>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      {
                        data.device && data.device.length>0?
                        `设备(共${data.device.length})：`
                        :
                        '设备(共0)：'
                      }

                    </StyleLeft>
                    <StyleRight>

                        <Tooltip placement="topLeft" title={
                          <div style={{fontSize:"12px"}}>
                            <div>设备-接口-流向</div>
                          </div>
                        }>
                          { data.device && data.device.length>0?
                            data.device.map(item=>{
                              return <div key={item} title={item} style={{
                                lineHeight:"40px",
                                overflow:"hidden",
                                textOverflow:"ellipsis",
                                whiteSpace:"nowrap"
                              }}>{item}</div>
                            })
                            :
                            ''
                          }
                        </Tooltip>

                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      {
                        data.source_address && data.source_address.length>0?
                        `源地址(共${data.source_address.length})：`
                        :
                        '源地址(共0)：'
                      }
                    </StyleLeft>
                    <StyleRight>
                      { data.source_address && data.source_address.length>0?
                        data.source_address.map(item=>{
                          return <div key={item} title={item} style={{
                            lineHeight:"40px",
                            overflow:"hidden",
                            textOverflow:"ellipsis",
                            whiteSpace:"nowrap"
                          }}>{item}</div>
                        })
                        :
                        ''
                      }
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      {
                        data.des_address && data.des_address.length>0?
                        `目的地址(共${data.des_address.length})：`
                        :
                        '目的地址(共0)：'
                      }
                    </StyleLeft>
                    <StyleRight>
                    { data.des_address && data.des_address.length>0?
                      data.des_address.map(item=>{
                        return <div key={item} title={item} style={{
                          lineHeight:"40px",
                          overflow:"hidden",
                          textOverflow:"ellipsis",
                          whiteSpace:"nowrap"
                        }}>{item}</div>
                      })
                      :
                      ''
                    }
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      端口：
                    </StyleLeft>
                    <StyleRight>
                    {
                      data.port
                    }
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      动作：
                    </StyleLeft>
                    <StyleRight>
                      {
                        data.behavior === 'permit'?
                        '允许'
                        :
                        '拒绝'
                      }
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col sm={12} md={12} >
                  <StyleDiv>
                    <StyleLeft>
                      备注：
                    </StyleLeft>
                    <StyleRight>
                      {data.atom_note}
                    </StyleRight>
                  </StyleDiv>
                </Col>
              </Row>
            </div>
            <div style={{flex:"0 0 120px",borderRight: "#cccccc dashed 1px",textAlign:"center"}}>
            </div>
          </div>

      </div>
    )
  }
}


export default AtomForm_Editless
