import _ from 'lodash'
const lookset = (state={deviceId: '',deviceName:'',versionId:'',is_fire:'',ids:[]},action)=>{
   switch(action.type){
    case 'GET_DEVICE_ID':
      const curState = _.cloneDeep(state)
      const newState = Object.assign({},curState,{deviceId: action.value.key,deviceName: action.value.title,is_fire: action.value.is_fire})
      return newState
      case 'SET_VERSION_ID':
        const curState1 = _.cloneDeep(state)
        const newState1 = Object.assign({},curState1,{versionId: action.value})
        return newState1
      case 'SET_IDS':
        const curState2 = _.cloneDeep(state)
        const newState2 = Object.assign({},curState2,{ids: action.value})
        return newState2
    default:
      return state
  }
}

export default lookset
