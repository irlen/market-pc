import React, { useEffect, useState } from 'react'
import { Input, Select, Row, Col } from 'antd'
import _ from 'lodash'

const { TextArea } = Input
 function ConstantForm_Editless(props){
  const [data,setData]= useState({});
  const [_isMounted,set_isMounted] = useState(true);
  useEffect(()=>{
    const {data} = props
    if(data && Object.keys(data).length>0){
      setData(data);
    }
    return ()=>{
      set_isMounted(false)
    }
  },[])
  useEffect(()=>{
    setData(props.data)
  },[props.data])
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


export default ConstantForm_Editless
