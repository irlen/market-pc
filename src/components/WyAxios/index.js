import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
import { host } from '../Host'

const wyAxiosPost = (url,data,callback)=>{
  const wholeUrl = host+url
  let udata = data

  const postData = qs.stringify(udata);
  //axios.defaults.withCredentials=true
  //axios.defaults.headers.common['Authorization'] = user_token
  axios({
    url: wholeUrl,
    data: data,
    method: "post",
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	  // "Content-Type": "application/json; charset=UTF-8",
    // }
  }
).then((result)=>{
    if(result.status === 200){
      callback(result.data);
    }else{
      message.warning("接口有误")
      return
    }
  }).catch(error=>{
	  message.error('系统请求有误'+wholeUrl)
  })
}


export { wyAxiosPost }
