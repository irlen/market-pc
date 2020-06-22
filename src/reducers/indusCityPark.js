import _ from 'lodash'
const indusCityPark = (state={modules:[],cityParkInfo:{},cityParkDetail:{}},action)=>{
  switch(action.type){
   case 'INIT_MODULES_FOR_CITYPARK':
     let new2State = _.cloneDeep(state)
     new2State.modules = action.value
     return Object.assign({},new2State)
   case 'SET_POSITION_FOR_CITYPARK':
     let new3State = _.cloneDeep(state)
     new3State.modules.map(item=>{
       const newPosition = _.find(action.value,(o)=>{
         return o.i === item.id
       })
       item.position = _.cloneDeep(newPosition)
     })
     return Object.assign({},new3State)
  case 'SET_CITYPARK_INFO':
    let new4State = _.cloneDeep(state)
    new4State.cityParkInfo = _.cloneDeep(action.value)
    return Object.assign({},new4State)
  case 'SET_CITYPARK_DETAIL':
    let new5State = _.cloneDeep(state)
    new5State.cityParkDetail = _.cloneDeep(action.value)
    return Object.assign({},new5State)
   default:
      return  state
  }
}


export default indusCityPark
