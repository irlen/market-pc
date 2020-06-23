import _ from 'lodash'
import { wyAxiosPost } from '../../components/WyAxios'




//设置windowH
export const setWindowH = (windowH)=>({
  type:'SET_WH',
  windowH
})

//lookset页面
export const getCurDevice = (value)=>({
  type:'GET_DEVICE_ID',
  value: value
})

export const setVersionId = (value)=>({
  type:'SET_VERSION_ID',
  value: value
})

export const setIds = (value)=>({
  type:'SET_IDS',
  value:value
})

//用户登入登出
export const doLogin = (value)=>({
  type:"USER_LOGIN",
  value
})

export const doLogout = (value)=>({
  type:"USER_LOGOUT",
  value
})
