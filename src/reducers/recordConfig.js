import _ from 'lodash'
const recordConfig = (state={activeKeys:{}},action)=>{
  switch(action.type){
   case 'SET_ACTIVEKEYS':
     let new2State = _.cloneDeep(state)
     new2State.activeKeys = action.value
     return Object.assign({},new2State)
   default:
      return  state
  }
}


export default recordConfig
