

const user = (state={user_token:"",cur_city:"哈尔滨市"},action)=>{
   switch(action.type){
    case 'USER_LOGIN':
      return Object.assign({},state,action.value)
    case 'USER_LOGOUT':
      return Object.assign({},state,action.value)
    case 'CHANGE_CITY':
      return Object.assign({},state,action.value)
    default:
      return state
  }
}

export default user
