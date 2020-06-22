import _ from 'lodash'
const wholeView = (state={mapArea:"",modules:[]},action)=>{
  switch(action.type){
   case 'SET_MAPAREA':
     let new1State = _.cloneDeep(state)
     new1State.mapArea = action.value
     return Object.assign({},new1State)
   case 'INIT_MODULES':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION':
     let new3State = _.cloneDeep(state)
     new3State.modules.map(item=>{
       const newPosition = _.find(action.value,(o)=>{
         return o.i === item.id
       })
       item.position = _.cloneDeep(newPosition)
     })
     return Object.assign({},new3State)
   default:
      return  state
  }
}


export default wholeView
