

const currentCity = (state={currentCity: '哈尔滨市'},action)=>{
   switch(action.type){
    case 'SET_CITY':
      return {currentCity:action.value}
    default:
      return state
  }
}

export default currentCity
