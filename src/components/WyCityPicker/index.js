import React ,{ Component } from 'react'
import { TreeSelect } from 'antd'
import _ from 'lodash'


import { getAdress } from '../constants'
class WyCityPicker extends Component{
  state = {
    value: '',
    treeData:[],
  }
  componentDidMount(){
    this._isMounted = true
    const treeData = getAdress()
    if(this._isMounted){
      this.setState({
        treeData
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(_.isEqual(this.props.cityData,nextProps.cityData)){
      if(this._isMounted){
        this.setState({
          value: nextProps.cityData.selected
        })
      }
    }
  }
  onChange = (value)=>{
    if(this._isMounted){
      this.setState({
        value
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { value, treeData } = this.state
    return(
      <div>
        <TreeSelect
          showSearch
          style={{ width: 300 }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="选择地域"
          allowClear
          treeDefaultExpandAll={false}
          treeData={treeData}
          onChange={this.onChange}
        >

        </TreeSelect>
      </div>
    )
  }
}

export default WyCityPicker
