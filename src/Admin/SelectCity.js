/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { message } from 'antd'


import { wyAxiosPost } from '../components/WyAxios'

import { getAdress } from '../components/constants'
import WySpin from '../components/WySpin'

const StyleLi = styled.span({
  float:"left",
  padding: "0 5px 0 5px",
  cursor: "pointer",
  "&:hover":{
    color:"#009641"
  }

})
const StyleDiv = styled.div({
  clear: "both",
  display:"flex",
  lineHeight:"40px"
})
class SelectCity extends Component{
  state = {
    curCity:"",
    isSpining: false
  }
  componentDidMount(){
    this._isMounted = true
    this.setState({
      curCity: this.props.curCity
    })
  }

}

export default connect()(SelectCity)
