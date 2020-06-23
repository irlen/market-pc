
/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core'
import React, {useState, useEffect} from 'react';
import './App.css';
import { Button } from 'antd';
import { globalStyle } from './styles/globalStyle'
import { connect } from 'react-redux'
import './styles/style.less'


import { setWindowH } from './redux/actions'
import { FirstRoute } from './router'
function App(props) {
  const [ windowH,setWindowH ]  = useState(0);
  useEffect(()=>{
    const windowH = parseInt(document.body.clientHeight,0);
    props.setWindowH(windowH);
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0);
      props.setWindowH(rwindowH);
    }
  },[])
  return (
    <div className="app">
      <Global styles={{...globalStyle}} />
      <FirstRoute />
    </div>
  );
}
const mapDispatchToProps = (dispatch)=>({
  setWindowH: (windowH)=>{dispatch(setWindowH(windowH))}
})


export default connect(null,mapDispatchToProps)(App);
