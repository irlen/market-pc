/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect } from 'react'
import { Tooltip,Row, Col } from 'antd'
import _ from 'lodash'

import { singleIp, groupIp, rangeIp, singlePort } from '../../components/RegExp'

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
function AtomForm_Editless(props){

  const [data, setData] = useState({});
  const [_isMounted,set_isMounted] = useState(true);

  useEffect(()=>{
    setData(props.data);
    return ()=>{
      set_isMounted(false);
    }
  },[])

  useEffect(()=>{
    if(_isMounted){
      setData(props.data);
    }
  },[props.data])

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


export default AtomForm_Editless
