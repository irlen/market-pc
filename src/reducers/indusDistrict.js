import _ from 'lodash'
const indusDistrict = (state={mapArea:"",city:"",modules:[]},action)=>{
  switch(action.type){
   case 'SET_MAPAREA_FOR_DISTRICT':
     let new1State = _.cloneDeep(state)
     new1State.mapArea = action.value.area
     new1State.city = action.value.city
     return Object.assign({},new1State)
   case 'INIT_MODULES_FOR_DISTRICT':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION_FOR_DISTRICT':
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


export default indusDistrict
