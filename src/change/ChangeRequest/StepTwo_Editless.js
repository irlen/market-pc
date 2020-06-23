/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ useEffect, useState } from 'react'
import { Form, Input, Select, Row, Col, Button, Tooltip, TreeSelect  } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../../components/WyAxios'
import { singleIp, groupIp, rangeIp, singlePort } from '../../components/RegExp'
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
function StepTwo(props){
  const [data,setData] = useState([])
  const [id,setId] = useState('')
  const [_isMounted,set_isMounted] = useState(true)

  useEffect(()=>{
    const {data,id} = props
    setData(data)
    setId(id)
    return ()=>{
      set_isMounted(false)
    }
  },[])
  useEffect(()=>{
    const {data,id} = props
    setData(data)
    setId(id)
  },[props.id,props.data])
  const doWrap = (str)=>{
    const newStr=str.replace(/\n/g,"<br/>")
    return newStr
  }
  return (
    <div style={{marginBottom:"20px"}}>
      <div>
        <div style={{display:"flex"}}>
          <div style={{flex:"1 1 auto",borderBottom:"#cccccc dashed 1px"}}>
            {
              data && data.name && parseInt(data.status) ===1?
              <Row gutter={16}>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      设备名：
                    </StyleLeft>
                    <StyleRight>
                      {data.name}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      接口：
                    </StyleLeft>
                    <StyleRight>
                      {data.ifname}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24} >
                  <StyleDiv>
                    <StyleLeft>
                      流向：
                    </StyleLeft>
                    <StyleRight>
                      {data.inout}
                    </StyleRight>
                  </StyleDiv>
                </Col>
                {
                  parseInt(data.status) === 1 && parseInt(data.cmd.add_acl) === 1?
                  <Col span={24}>
                    <StyleDiv>
                      <StyleLeft>
                        新增ACL：
                      </StyleLeft>
                      <StyleRight>
                        <span>{data.cmd.acl_name}</span>
                      </StyleRight>
                    </StyleDiv>
                  </Col>
                  :
                  <Col span={24}>
                    ACL：{data.cmd.acl_name?data.cmd.acl_name:''}
                  </Col>
                }
                <Col span={24} style={{fontWeight:"bold"}}>
                  <StyleDiv>
                    <StyleLeft>
                      新增：
                    </StyleLeft>
                    <StyleRight>
                      {data.cmd.add?data.cmd.add.length:0}条记录
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24}>
                  <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                    <div style={{flex:"0 0 120px"}}></div>
                    <div style={{flex:"0 0 40px"}}>序号</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>源</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>目的</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>端口</div>
                  </div>
                </Col>
                {
                  data.cmd.add && data.cmd.add.length>0?
                  data.cmd.add.map((item,index)=>{
                    return (
                      <Col span={24} key={index}>
                        <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                          <div style={{flex:"0 0 120px"}}></div>
                          <div style={{flex:"0 0 40px"}}>{index+1}</div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                              !item.group.source.no_change?
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                                </Tooltip>
                                :
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                                </Tooltip>
                            }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.dest.no_change?
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                          }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.port.no_change?
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                          }
                          </div>
                        </div>
                      </Col>
                    )
                  })
                  :
                  ''
                }
                <Col span={24} style={{fontWeight:"bold"}}>
                  <StyleDiv>
                    <StyleLeft>
                      变更：
                    </StyleLeft>
                    <StyleRight>
                      {data.cmd.change ?data.cmd.change.length:0}条记录
                    </StyleRight>
                  </StyleDiv>
                </Col>
                <Col span={24}>
                  <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                    <div style={{flex:"0 0 120px"}}></div>
                    <div style={{flex:"0 0 40px"}}>序号</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>源</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>目的</div>
                    <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>端口</div>
                  </div>
                </Col>
                {
                  data.cmd.change && data.cmd.change.length>0?
                  data.cmd.change.map((item,index)=>{
                    return (
                      <Col span={24}>
                        <div style={{display:"flex",textAlign:"center",lineHeight:"40px"}}>
                          <div style={{flex:"0 0 120px"}}></div>
                          <div style={{flex:"0 0 40px"}}>{index+1}</div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                              !item.group.source.no_change?
                              <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                              </Tooltip>
                                :
                                <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.source.body))}}></div>} placement="topLeft">
                                  <span>{item.group.source.name?item.group.source.name:item.group.source.body}</span>
                                </Tooltip>
                            }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.dest.no_change?
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.dest.body))}}></div>} placement="topLeft">
                              <span>{item.group.dest.name?item.group.dest.name:item.group.dest.body}</span>
                            </Tooltip>
                          }
                          </div>
                          <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
                            {
                            !item.group.port.no_change?
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                            :
                            <Tooltip title={<div dangerouslySetInnerHTML={{__html:doWrap(_.cloneDeep(item.group.port.body))}}></div>} placement="topLeft">
                              <span>{item.group.port.name?item.group.port.name:item.group.port.body}</span>
                            </Tooltip>
                          }
                          </div>
                        </div>
                      </Col>
                    )
                  })
                  :
                  ''
                }
              </Row>
              :

              data.status === 0?
              <div>{data.msg}</div>
              :
              ''

            }

          </div>
        </div>
      </div>
    </div>
  )
}


export default StepTwo
