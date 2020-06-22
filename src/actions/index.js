import _ from 'lodash'
import { wyAxiosPost } from '../components/WyAxios'



//设置当前城市
export const setCity = (value)=>({
  type:'SET_CITY',
  value
})


export const doToggle = (collapsed)=>({
  type: 'DO_TOGGLE',
  collapsed
})
//设置windowH
export const setWindowH = (windowH)=>({
  type:'SET_WH',
  windowH
})

export const updateIndus = (value)=>({
  type:'UPDATE_INDUS',
  value
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

//recordConfig页面
export const setActivekeys = (value)=>({
  type:"SET_ACTIVEKEYS",
  value
})
