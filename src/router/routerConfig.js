
import React from 'react'
import { SettingFilled, EyeFilled, ControlFilled } from '@ant-design/icons';
import { FaServer, FaLayerGroup, FaUserCog, FaBarcode, FaRegListAlt, FaTasks } from 'react-icons/fa'
import { IoIosSwitch } from 'react-icons/io'
import { MdSecurity } from 'react-icons/md'
import { GiCardExchange } from 'react-icons/gi'

export const routerConfig = [
  {
    path:"/app/change",
    name:"类目",
    icon: <ControlFilled />,
    key:"/app/change",
    children:[
      {path:"/app/change/changerequest",key:"changerequest",name:"类目列表",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><GiCardExchange /></span>},
      //{path:"/app/change/changetask",key:"changetask",name:"变更任务",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaTasks /></span>},
      //{path:"/app/change/changesecurity",key:"changesecurity",name:"安全变更",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><MdSecurity /></span>},
    ]
  },
  {
    path:"/app/look",
    name:"商品",
    icon: <EyeFilled />,
    key:"/app/look",
    children:[
      {path:"/app/look/lookset",key:"lookset",name:"商品列表",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaRegListAlt /></span>},
    ]
  },
  {
    path:"/app/set",
    name:"订单",
    icon: <SettingFilled />,
    key:"/app/set",
    children:[
      {path:"/app/set/setmonitor",key:"setmonitor",name:"订单列表",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaServer /></span>},
      // {path:"/app/set/setgroup",key:"setgroup",name:"分组",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaLayerGroup /></span>},
      // {path:"/app/set/setuser",key:"setuser",name:"用户",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaUserCog /></span>},
      // {path:"/app/set/setauth",key:"setauth",name:"外部认证",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><FaBarcode /></span>},
      // {path:"/app/set/setplatform",key:"setplatform",name:"平台配置",icon: <span style={{verticalAlign:"middle",marginRight:"10px"}}><IoIosSwitch /></span>},

    ]
  }
]
