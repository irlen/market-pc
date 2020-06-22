import _ from 'lodash'
const lockedPage = (state={lockedUrl:'/app'},action)=>{
  switch(action.type){
   case 'GET_LOCKED_URL':
     let new2State = _.cloneDeep(state)
     new2State.lockedUrl = action.value
     return Object.assign({},new2State)
    default:
     return  state
  }
}


export default lockedPage
