import _ from 'lodash'
const indusPark = (state={modules:[],typeInfo:{},parkInfo:{}},action)=>{
  switch(action.type){
   case 'INIT_MODULES_FOR_INDUSPARK':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION_FOR_INDUSPARK':
     let new3State = _.cloneDeep(state)
     new3State.modules.map(item=>{
       const newPosition = _.find(action.value,(o)=>{
         return o.i === item.id
       })
       item.position = _.cloneDeep(newPosition)
     })
     return Object.assign({},new3State)
  case 'SET_TYPE_INFO':
    let new4State = _.cloneDeep(state)
    new4State.typeInfo = _.cloneDeep(action.value)
    return Object.assign({},new4State)
  case 'SET_PARK_INFO':
    let new5State = _.cloneDeep(state)
    new5State.parkInfo = _.cloneDeep(action.value)
    return Object.assign({},new5State)
   default:
      return  state
  }
}


export default indusPark
