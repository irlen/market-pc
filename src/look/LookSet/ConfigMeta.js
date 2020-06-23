/** @jsx jsx */
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'
import { Input, message, Table, Empty } from 'antd'

import { curTheme } from '../../styles/defineColor'
import { wyAxiosPost } from '../../components/WyAxios'

function ConfigMeta(props){
  const [data,setData] = useState({})
  useEffect(()=>{
    const newData = _.cloneDeep(props.data)
    setData(newData)
  },[])
  useEffect(()=>{
    const newData = _.cloneDeep(props.data)
    setData(newData)
  },[props.data])
  return (
    <div style={{border: curTheme.border,borderRadius:"3px",margin:"5px 0 5px 0",padding:"10px"}}>
        <div style={{display:"flex", lineHeight:"40px"}}>
          <div style={{flex:"0 0 120px",textAlign:"right"}}>ACL名称：</div>
          <div style={{flex:"1 1 auto"}}>{data.acl_name || ''}</div>
        </div>
        <div style={{display:"flex",lineHeight:"40px"}}>
          <div style={{flex:"0 0 120px",textAlign:"right"}}>接口/方向：</div>
          <div style={{flex:"1 1 auto"}}>{`${data.interface}/${data.direction}` || ""}</div>
        </div>
        <div>
          {
            data && data.data && data.data.xxx?

            <Table
              columns={data.data.xxx || []}
              dataSource={data.data.yyy || []}
              bordered
              size={"small"}
              pagination={false}
            />
            :
            <Empty />
          }
        </div>
    </div>
  )
}


export default ConfigMeta
