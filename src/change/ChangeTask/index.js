/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Row, Col, Table, Spin, Empty, Input, message } from 'antd'

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'

import WyDatePicker from '../../components/WyDatePicker'
const { Search } = Input
function ChangeTask(props){
  const [pageInfo,setPageInfo] = useState({rangeTime:[],search:"",pageSize:10,current:1})
  const [orderList,setOrderList] = useState({xxx:[],yyy:[],total:0})
  const [spinning,setSpinning] = useState(false)
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);
  },[])

  //监控windowH
  useEffect(()=>{
    setWindowH(props.windowH);
  },[props.windowH])

  useEffect(()=>{
    if(pageInfo.rangeTime && pageInfo.rangeTime.length>0){
      getAllOrder()
    }
  },[pageInfo])

 function rangeTimeChange(value){
   const curPageInfo = _.cloneDeep(pageInfo)
   curPageInfo.rangeTime = value
   setPageInfo(curPageInfo)
 }
 function getAllOrder(){
   wyAxiosPost('Order/getAllOrder',{...pageInfo},(result)=>{
      if(result.status === 1){
        let curxData = _.cloneDeep(result.msg.xxx)
        if(curxData && curxData.length>0){
          curxData.map(item=>{
            if(item.dataIndex === 'progress'){
              item.render=(text, record, index)=>{
                const colors = ['#BBBBBB','#33CC00','#FFFF00','#FF3300']
                return <div style={{width:"80%",display:"flex"}}>
                  {
                    text && text.length>0?
                    text.map((subItem,index)=>{
                      return <div key={index} style={{height:"10px",background:colors[subItem.color],width:"20%",marginRight:"2px"}}></div>
                    })
                    :
                    ''
                  }
                </div>
              }
            }else if(item.dataIndex === 'status'){
              item.filters =[
                              {
                                text: '进行中',
                                value: 1,
                              },
                              {
                                text: '已取消',
                                value: 0,
                              },
                            ]
              item.filterMultiple = false
              item.onFilter = (value, record) => {
                return record.status === value
              }
              item.render=(text, record, index)=>{
                return record.status === 1?<span>进行中</span>:<span style={{color:"#cdcdcd"}}>已取消</span>
              }
            }else{
              item.render=(text, record, index)=>{
                if(record.status === 0){
                  return <span style={{color:"#cdcdcd"}}>{text}</span>
                }else{
                  return <span>{text}</span>
                }
              }
            }
          })
        }





        const curOrderList = _.cloneDeep(result.msg)
        const newOrderList = Object.assign({},curOrderList,{xxx:curxData})
        setOrderList(newOrderList)
      }else{
        message.warning(result.msg)
      }
   })
 }
 function pageChange(value){
   const curPageInfo = _.cloneDeep(pageInfo)
   const newPageInfo = Object.assign({},curPageInfo,{current: value})
   setPageInfo(newPageInfo)
 }
 function searchChange(value){
   const curPageInfo = _.cloneDeep(pageInfo)
   const newPageInfo = Object.assign({},curPageInfo,{search: value,current:1})
   setPageInfo(newPageInfo)
 }

 function pageSizeChange(current, size){
   const curPageInfo = _.cloneDeep(pageInfo)
   const newPageInfo = Object.assign({},curPageInfo,{pageSize: size,current: 1})
   setPageInfo(newPageInfo)
 }
  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>
        <Row gutter={16}>
          <Col span={24} style={{marginBottom:"20px"}}>
            <WyDatePicker rangeTimeChange={(value)=>{rangeTimeChange(value)}} />
            <Search
              placeholder="input search text"
              onSearch={searchChange}
              style={{ width: 200 }}
              size={'small'}
            />
          </Col>
          <Col span={24}>
            <div>
            {
              orderList.yyy && orderList.yyy.length>0?
              <Spin spinning={spinning}>
                <Scrollbars
                  autoHide
                  autoHideTimeout={100}
                  autoHideDuration={200}
                  universal={true}
                  style={{height: windowH===0?0 : windowH-180+'px'}}
                >
                  {
                    orderList.yyy && orderList.yyy.length>0?
                    <Table
                      columns ={orderList.xxx}
                      dataSource={orderList.yyy}
                      bordered
                      pagination={{
                        pageSize: pageInfo.pageSize,
                        pageSizeOptions: ["5","10","20","30","40"],
                        showSizeChanger: true,
                        showQuickJumper: true,
                        current: pageInfo.current,
                        total: orderList.total,
                        onShowSizeChange: pageSizeChange,
                        onChange: pageChange
                      }}
                    />
                    :
                    <Empty style={{paddingTop:"100px"}}/>
                  }
                </Scrollbars>
              </Spin>
              :
              <Empty style={{marginTop:"100px"}}/>
            }
            </div>
          </Col>
        </Row>
    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(ChangeTask)
