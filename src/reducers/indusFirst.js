import _ from 'lodash'
const indusFirst = (state={modules:[],indusFirstInfo:{}},action)=>{
  switch(action.type){
   case 'INIT_MODULES_FOR_INDUSFIRST':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION_FOR_INDUSFIRST':
     let new3State = _.cloneDeep(state)
     new3State.modules.map(item=>{
       const newPosition = _.find(action.value,(o)=>{
         return o.i === item.id
       })
       item.position = _.cloneDeep(newPosition)
     })
     return Object.assign({},new3State)
   case 'SET_INDUSFIRST_INFO':
     let new4State = _.cloneDeep(state)
     new4State.indusFirstInfo = _.cloneDeep(action.value)
     return Object.assign({},new4State)
    default:
     return  state
  }
}


export default indusFirst
