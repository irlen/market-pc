import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
import { host } from '../Host'

const wyAxiosPost = (url,data,callback)=>{
  const dataAuthList = []
  if(localStorage.userAuth && JSON.parse(localStorage.userAuth).dataAuth.length>0){
    const dataAuth = JSON.parse(localStorage.userAuth).dataAuth
    dataAuth.map(item=>{
      dataAuthList.push(item.api_name)
    })
  }
  if(dataAuthList.length>0 && dataAuthList.indexOf(url) !== -1){
    message.warning("非常抱歉，您没有权限进行此操作")
    return
  }

  const wholeUrl = host+url
  let udata = data
  // if(localStorage.userInfo){
  //   udata = Object.assign({},data,{userInfo:localStorage.userInfo})
  // }
  const postData = qs.stringify(udata)
  let user_token = ''
  if(localStorage.user_token){
    user_token = localStorage.user_token
  }
  axios.defaults.withCredentials=true
  axios.defaults.headers.common['Authorization'] = user_token
  axios({
    url: wholeUrl,
    data: postData,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
  }
).then((result)=>{
  //console.log('获取结果')
  //console.log(result)
    // if(result.data.ret === 200){
    //   if(result.data.data.status === 1){
    //     callback(result.data)
    //   }else{
    //     //message.error(url+':'+result.data.data.msg)
    //     message.error(result.data.data.msg)
    //   }
    // }else{
    //   //message.error('业务请求错误：'+url+result.data.msg)
    //   message.error(result.data.msg)
    // }
    if(result.status === 200){
      callback(result)
    }
  }).catch(error=>{
    //console.log('错误')
    //console.log(error)
	  // message.error('系统请求错误：'+url+error)
	  message.error('系统请求有误')
    return
  })
}

export { wyAxiosPost }
