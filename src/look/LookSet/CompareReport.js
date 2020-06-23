/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs, Tree, Input, message, Row, Col, Table, Empty } from 'antd'


import { wyAxiosPost } from '../../components/WyAxios'
const { TabPane } = Tabs
const HeaderDiv = styled.div({
  lineHeight:"40px",
  fontWeight: "bold",
  paddingLeft:"20px"
})
const ForChange = styled.span({
  color:"#FF6600",
  fontWeight:"bold",
  width:"100%",
  display:"inline-block",
  background:"rgba(255,102,0,0.2)",
  height:"43px",
  verticalAlign:"middle"
})
const ForRemove = styled.span({
  color:"#FF0000",
  fontWeight:"bold",
  width:"100%",
  display:"inline-block",
  background:"rgba(255,0,0,0.2)",
  height:"43px",
  verticalAlign:"middle"
})
const ForAdd = styled.span({
  color:"#00CC33",
  fontWeight:"bold",
  width:"100%",
  display:"inline-block",
  background:"rgba(0,204,51,0.2)",
  height:"43px",
  verticalAlign:"middle"
})
const ChangeDiv = styled.div({
  display:"flex",
  lineHeight:"20px",
  marginBottom:"10px"
})
const ChangeLeft  = styled.div({
  flex:"0 0 100px",
  textAlign:"right"
})
const ChangeRight = styled.div({
  flex:"1 1 auto"
})

function CompareReport(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ compareData,setCompareData] = useState({acl:{},run_config:{},terface:{},route:{}})
  const [ ids, setIds ] = useState([])
  const [idInfo,setIdInfo] = useState({device_id:"",reversion:"",is_fire:""})

  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
  },[])
  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])
  useEffect(()=>{
    setIds(props.ids)
  },[props.ids])
  useEffect(()=>{
    if(ids && ids.length>0){
      getCompareData()
    }
  },[ids])
  useEffect(()=>{
    const {device_id,reversion} = props
    setIdInfo({device_id,reversion})
  },[props.device_id, props.reversion])
  function getCompareData(){
    const { device_id, is_fire } = idInfo
    wyAxiosPost('contrast/presentation', { device_id, is_fire, ids },(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const newCompareData = _.cloneDeep(result.msg)
      const acl = _.cloneDeep(newCompareData.acl)
      const table1 = _.cloneDeep(acl.table1)
      const table2 = _.cloneDeep(acl.table2)
      table1.xxx.map(item=>{
        item.ellipsis = true
        item.align="center"
        item.render=(text,record,index)=>{
          //先判断该行dataIndex是否有改动
          let isChange = false;
          if( record.change_filed && record.change_filed.length>0){
            isChange = record.change_filed.indexOf(item.dataIndex) > -1;
          }

          if(record.diff_status === 0 && isChange){
            return <ForChange>{text}</ForChange>
          }else if(record.diff_status === 1){
            return <ForRemove>{ text }</ForRemove>
          }else if(record.diff_status === 2){
            return <ForAdd>{text}</ForAdd>
          }
          return <span>{text}</span>
        }
      })
      table2.xxx.map(item=>{
        item.ellipsis = true
        item.align="center"
        item.render=(text,record,index)=>{
          //先判断该行dataIndex是否有改动
          let isChange = false;
          if( record.change_filed && record.change_filed.length>0){
            isChange = record.change_filed.indexOf(item.dataIndex) > -1;
          }

          if(record.diff_status === 0 && isChange){
            return <ForChange>{text}</ForChange>
          }else if(record.diff_status === 1){
            return <ForRemove>{text}</ForRemove>
          }else if(record.diff_status === 2){
            return <ForAdd>{text}</ForAdd>
          }
          return <span>{text}</span>
        }
      })
      acl.table1 = table1
      acl.table2 = table2
      const terface = _.cloneDeep(newCompareData.interface)
      const table3 = _.cloneDeep(terface.table1)
      const table4 = _.cloneDeep(terface.table2)
      table3.xxx.map(item=>{
        item.ellipsis = true
        item.align="center"
        item.render=(text,record,index)=>{
          //先判断该行dataIndex是否有改动
          let isChange = false;
          if( record.change_filed && record.change_filed.length>0){
            isChange = record.change_filed.indexOf(item.dataIndex) > -1;
          }

          if(record.diff_status === 0 && isChange){
            return <ForChange>{text}</ForChange>
          }else if(record.diff_status === 1){
            return <ForRemove>{ text }</ForRemove>
          }else if(record.diff_status === 2){
            return <ForAdd>{text}</ForAdd>
          }
          return <span>{text}</span>
        }
      })
      table4.xxx.map(item=>{
        item.ellipsis = true
        item.align="center"
        item.render=(text,record,index)=>{
          //先判断该行dataIndex是否有改动
          let isChange = false;
          if( record.change_filed && record.change_filed.length>0){
            isChange = record.change_filed.indexOf(item.dataIndex) > -1;
          }

          if(record.diff_status === 0 && isChange){
            return <ForChange>{text}</ForChange>
          }else if(record.diff_status === 1){
            return <ForRemove>{text}</ForRemove>
          }else if(record.diff_status === 2){
            return <ForAdd>{text}</ForAdd>
          }
          return <span>{text}</span>
        }
      })
      terface.table1 = table3
      terface.table2 = table4
      const route = _.cloneDeep(newCompareData.route)
      const run_config = _.cloneDeep(newCompareData.run_config)
      setCompareData({acl,terface,route,run_config})
    })
  }

  return(
    <Scrollbars
      autoHide
      autoHideTimeout={100}
      autoHideDuration={200}
      universal={true}
      style={{height: windowH===0?0 : windowH-240+'px'}}
    >

      {
        compareData.acl && compareData.acl.table1?

      <div className="compareDiv">
        {
          compareData.run_config.change && compareData.run_config.change.length === 0 &&
          compareData.run_config.del.length === 0 && compareData.run_config.new.length === 0?
          ''
          :
          <div style={{marginTop:"20px"}}>
            <h3>运行的配置</h3>
          </div>
        }
        {
          compareData.run_config && Object.keys(compareData.run_config).length>0?
          <div>
            {
              //更改
              compareData.run_config.change && compareData.run_config.change.length>0 ?
              <div>
                <div style={{fontWeight:"bold"}}>修改</div>

                {
                  compareData.run_config.change.map(item=>{
                    return <div key={item.num} style={{paddingLeft:"40px"}}>
                            <div>第{item.num}行被修改</div>
                            <ChangeDiv>
                              <ChangeLeft>从：</ChangeLeft>
                              <ChangeRight dangerouslySetInnerHTML={{__html:item["from"]}} ></ChangeRight>
                            </ChangeDiv>
                            <ChangeDiv>
                              <ChangeLeft >改成：</ChangeLeft>
                              <ChangeRight dangerouslySetInnerHTML={{__html:item["to"]}} ></ChangeRight>
                            </ChangeDiv>
                          </div>
                  })

                }
              </div>
              :
              ""
            }
            {
              //新增
              compareData.run_config.new && compareData.run_config.new.length>0 ?
              <div>
                <div style={{fontWeight:"bold"}}>新增</div>
                <div style={{paddingLeft:"40px"}}>
                {
                  compareData.run_config.new.map(item=>{
                    return   <ChangeDiv key={item.num}>
                              <ChangeLeft >{item.num}行：</ChangeLeft>
                              <ChangeRight>{item.msg}</ChangeRight>
                            </ChangeDiv>
                  })

                }
                </div>
              </div>
              :
              ""
            }

            {
              //删除
              compareData.run_config.del && compareData.run_config.del.length>0 ?
              <div>
                <div style={{fontWeight:"bold"}}>删除</div>
                <div style={{paddingLeft:"40px"}}>
                {
                  compareData.run_config.del.map(item=>{
                    return  <ChangeDiv key={item.num}>
                              <ChangeLeft >{item.num}行：</ChangeLeft>
                              <ChangeRight>{item.msg}</ChangeRight>
                            </ChangeDiv>
                  })

                }
                </div>
              </div>
              :
              ""
            }
          </div>
          :
          <Empty />
        }
        {
          compareData.acl && compareData.acl.table1 && compareData.acl.table1.yyy && compareData.acl.table1.yyy.length>0 ?
          <div style={{marginTop:"20px"}}>
            <h3>ACL的配置</h3>
          </div>
          :
          ''
        }
        {
          compareData.acl.table1 && compareData.acl.table1.yyy && compareData.acl.table1.yyy.length>0?
          <Row gutter={16}>
            <Col span={12} style={{paddingRight:"10px"}}>
              <HeaderDiv>{
                compareData.acl.table1.rtr1
              }</HeaderDiv>
              <Table
                columns={compareData.acl.table1.xxx}
                dataSource={compareData.acl.table1.yyy}
                pagination={false}
                bordered
              />
              <HeaderDiv>{
                compareData.acl.table2.rtr1
              }</HeaderDiv>
              <Table
                columns={compareData.acl.table2.xxx}
                dataSource={compareData.acl.table2.yyy}
                pagination={false}
                bordered
              />
            </Col>
            <Col span={12} style={{paddingLeft:"10px"}}>

            </Col>
          </Row>
          :
          ''
        }
        {
          compareData.terface && compareData.terface.table1 && compareData.terface.table1.yyy && compareData.terface.table1.yyy.length>0 ?
          <div style={{marginTop:"20px"}}>
            <h3>接口配置</h3>
          </div>
          :
          ''
        }
        {
          compareData.terface.table1 && compareData.terface.table1.yyy && compareData.terface.table1.yyy.length>0?
          <Row gutter={16}>
            <Col span={12} style={{paddingRight:"10px"}}>
              <HeaderDiv>{
                compareData.terface.table1.rtr1
              }</HeaderDiv>
              <Table
                columns={compareData.terface.table1.xxx}
                dataSource={compareData.terface.table1.yyy}
                pagination={false}
                bordered
              />
              <HeaderDiv>{
                compareData.terface.table2.rtr1
              }</HeaderDiv>
              <Table
                columns={compareData.terface.table2.xxx}
                dataSource={compareData.terface.table2.yyy}
                pagination={false}
                bordered
              />
            </Col>
            <Col span={12} style={{paddingLeft:"10px"}}>

            </Col>
          </Row>
          :
          ''
        }
        {
          compareData.route && compareData.route.change && compareData.route.add && compareData.route.new  ?
          <div style={{marginTop:"20px"}}>
            <h3>路由配置</h3>
          </div>
          :
          ''
        }
        {
          compareData.route && Object.keys(compareData.route).length>0 ?
          <div>
            {
              //更改
              compareData.route.change && compareData.route.change.length>0?
              <div>
                <div style={{fontWeight:"bold"}}>修改</div>

                {
                  compareData.route.change.map(item=>{
                    return <div key={item.num} style={{paddingLeft:"40px"}}>
                            <div>第{item.num}行被修改</div>
                            <ChangeDiv>
                              <ChangeLeft>从：</ChangeLeft>
                              <ChangeRight dangerouslySetInnerHTML={{__html:item["from"]}} ></ChangeRight>
                            </ChangeDiv>
                            <ChangeDiv>
                              <ChangeLeft >改成：</ChangeLeft>
                              <ChangeRight dangerouslySetInnerHTML={{__html:item["to"]}} ></ChangeRight>
                            </ChangeDiv>
                          </div>
                  })

                }
              </div>
              :
              ""
            }
            {
              //新增
              compareData.route.new && compareData.route.new.length>0  ?
              <div>
                <div style={{fontWeight:"bold"}}>新增</div>
                <div style={{paddingLeft:"40px"}}>
                {
                  compareData.route.new.map(item=>{
                    return   <ChangeDiv key={item.num}>
                              <ChangeLeft >{item.num}行：</ChangeLeft>
                              <ChangeRight>{item.msg}</ChangeRight>
                            </ChangeDiv>
                  })

                }
                </div>
              </div>
              :
              ""
            }

            {
              //删除
              compareData.route.del && compareData.route.del.length>0?
              <div>
                <div style={{fontWeight:"bold"}}>删除</div>
                <div style={{paddingLeft:"40px"}}>
                {
                  compareData.route.del.map(item=>{
                    return  <ChangeDiv key={item.num}>
                              <ChangeLeft >{item.num}行：</ChangeLeft>
                              <ChangeRight>{item.msg}</ChangeRight>
                            </ChangeDiv>
                  })

                }
                </div>
              </div>
              :
              ""
            }

          </div>
          :
          <Empty />
        }
      </div>
      :
      <Empty />
    }
    </Scrollbars>
  )
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  ids: state.lookset.ids,
  device_id: state.lookset.deviceId,
  reversion: state.lookset.versionId,
  is_fire: state.lookset.is_fire
})

export default connect(mapStateToProps,null)(CompareReport)
