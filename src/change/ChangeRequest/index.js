/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Tabs , Row, Col, Button, Divider, Drawer, Table, Spin, Empty, message, Popconfirm } from 'antd'
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { wyAxiosPost } from '../../components/WyAxios'
import { curTheme } from '../../styles/defineColor'



const { TabPane } = Tabs
function ChangeRequest(props){
  //页面高度
  const [ windowH,setWindowH ]  = useState(0);
  const [visible, setVisible]  = useState(false)
  const [id, setId]  = useState("")
  //我的列表
  const [tableData,setTableData] = useState({total:0,xxx:[],yyy:[]})
  const [spinning,setSpinning] = useState(false)
  //分页信息
  const [pageInfo,setPageInfo] = useState({pageSize:10,current:1, search:""})
  //选中条数
  const [ selectedRowKeys,setSelectedRowKeys ] = useState([])
  const [ _isMounted,set_isMounted ] = useState(true)
  //做初始化
  useEffect(()=>{
    setWindowH(props.windowH);

    return ()=>{
      set_isMounted(false)
    }
  },[])
  useEffect(()=>{
    setWindowH(props.windowH)
  },[props.windowH])



  return (
    <div style={{background:curTheme.moduleBg,padding:"20px"}}>


    </div>
  )
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(ChangeRequest)
