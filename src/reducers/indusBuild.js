import _ from 'lodash'
const indusBuild = (state={modules:[],buildInfo:{},buildDetail:{}},action)=>{
  switch(action.type){
   case 'INIT_MODULES_FOR_INDUSBUILD':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION_FOR_INDUSBUILD':
     let new3State = _.cloneDeep(state)
     new3State.modules.map(item=>{
       const newPosition = _.find(action.value,(o)=>{
         return o.i === item.id
       })
       item.position = _.cloneDeep(newPosition)
     })
     return Object.assign({},new3State)
  case 'SET_BUILD_INFO':
    let new4State = _.cloneDeep(state)
    new4State.buildInfo = _.cloneDeep(action.value)
    return Object.assign({},new4State)
  case 'SET_BUILD_DETAIL':
    let new5State = _.cloneDeep(state)
    new5State.buildDetail = _.cloneDeep(action.value)
    return Object.assign({},new5State)
   default:
      return  state
  }
}


export default indusBuild
