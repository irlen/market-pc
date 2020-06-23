import _ from 'lodash'
const loginInfo = (state={},action)=>{
   switch(action.type){
    case 'USER_LOGIN':
      const curState = _.cloneDeep(action.value)
      return curState
    case 'USER_LOGOUT':
    const curState1 = _.cloneDeep(action.value)
    return curState1
    default:
      return state
  }
}

export default loginInfo
