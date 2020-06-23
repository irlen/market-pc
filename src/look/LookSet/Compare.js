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
function Compare(props){
  const [ windowH,setWindowH ]  = useState(0);
  const [ compareData,setCompareData] = useState({})
  const [ ids, setIds ] = useState([])
  const [idInfo,setIdInfo] = useState({device_id:"",reversion:"",is_fire:""})
  const [ curTab, setCurTab ] = useState("visitControl")

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
  },[ids,curTab])
  useEffect(()=>{
    const {device_id,reversion} = props
    setIdInfo({device_id,reversion})
  },[props.device_id, props.reversion])
  function getCompareData(){
    const { device_id, is_fire } = idInfo
    wyAxiosPost('config/contrast', { device_id, is_fire, ids, type:curTab },(result)=>{
      if(result.status === 0){
        message.warning(result.msg)
        return
      }
      const table1 = _.cloneDeep(result.msg.table1)
      const table2 = _.cloneDeep(result.msg.table2)
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
       setCompareData({table1,table2})
    })
  }
  function tabChange(value){
    setCurTab(value)
  }
  return(
    <div className="compareDiv">

      <Tabs
        activeKey={curTab}
        onChange={tabChange}
        tabPosition={"left"}
      >
        <TabPane tab="访问控制" key="visitControl">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-240+'px'}}
          >
            {
              compareData.table1 && compareData.table1.yyy && compareData.table1.yyy.length>0?
              <Row gutter={16}>
                <Col span={12} style={{borderRight:"#3399cc solid 1px",paddingRight:"10px"}}>
                  <HeaderDiv>{compareData.table1.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table1.xxx}
                    dataSource={compareData.table1.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
                <Col span={12} style={{paddingLeft:"10px"}}>
                  <HeaderDiv>{compareData.table2.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table2.xxx}
                    dataSource={compareData.table2.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
              :
              <Empty />
            }
          </Scrollbars>
        </TabPane>
        <TabPane tab="接口" key="interface">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-240+'px'}}
          >
            {
              compareData.table1 && compareData.table1.yyy && compareData.table1.yyy.length>0?
              <Row gutter={16}>
                <Col span={12} style={{borderRight:"#3399cc solid 1px",paddingRight:"10px"}}>
                  <HeaderDiv>{compareData.table1.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table1.xxx}
                    dataSource={compareData.table1.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
                <Col span={12} style={{paddingLeft:"10px"}}>
                  <HeaderDiv>{compareData.table2.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table2.xxx}
                    dataSource={compareData.table2.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
              :
              <Empty />
            }
          </Scrollbars>
        </TabPane>
        <TabPane tab="路由" key="router">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: windowH===0?0 : windowH-240+'px'}}
          >
            {
              compareData.table1 && compareData.table1.yyy && compareData.table1.yyy.length>0?
              <Row gutter={16}>
                <Col span={12} style={{borderRight:"#3399cc solid 1px",paddingRight:"10px"}}>
                  <HeaderDiv>{compareData.table1.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table1.xxx}
                    dataSource={compareData.table1.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
                <Col span={12} style={{paddingLeft:"10px"}}>
                  <HeaderDiv>{compareData.table2.rtr1}</HeaderDiv>
                  <Table
                    columns={compareData.table2.xxx}
                    dataSource={compareData.table2.yyy}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
              :
              <Empty />
            }
          </Scrollbars>
        </TabPane>
      </Tabs>
    </div>
  )
}


const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  ids: state.lookset.ids,
  device_id: state.lookset.deviceId,
  reversion: state.lookset.versionId,
  is_fire: state.lookset.is_fire
})

export default connect(mapStateToProps,null)(Compare)
