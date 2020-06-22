import React, { Component } from 'react'
import _ from 'lodash'
import { Tabs } from 'antd'
import { connect } from 'react-redux'

import ViewTable from './ViewTable'

const { TabPane } = Tabs
class ViewTabsTable extends Component{
  state = {
    data:[],
    activekey:''
  }
  componentDidMount(){
    this._isMounted = true
    const { data, activeKeys } = this.props
    let activeKey = data[0].key
    if(activeKeys.name){
      activeKey = activeKeys.name
    }
    if(data && this._isMounted){
      this.setState({
        data,
        activeKey
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      if(nextProps.data && this._isMounted){
        const { data } = nextProps
        this.setState({
            data
        })
      }
    }


    if(! _.isEqual(this.props.activeKeys,nextProps.activeKeys) && nextProps.activeKeys.name){
      this.setState({
        activeKey: nextProps.activeKeys.name
      })
    }



  }
  tabsChange = (activeKey)=>{
    if(activeKey){
      this.setState({
        activeKey
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    const { data, activeKey } = this.state
    return (
      <div>
      {
        data && data.length>0?
        <Tabs
          type="card"
          size="small"
          activeKey={activeKey}
          onChange={this.tabsChange}
        >
          {
            data && data.length>0?
            data.map(item=>{
              return (
                <TabPane tab={item.name} key={item.key}>
                  {
                    item.key === activeKey?
                    <ViewTable data={item.data}/>
                    :
                    ''
                  }

                </TabPane>
              )
            })
            :
            ''
          }
        </Tabs>
        :
        ''
      }
      </div>
    )
  }
}

const mapStateToProps = state=>({
  activeKeys: state.recordConfig.activeKeys
})

export default connect(mapStateToProps, null)(ViewTabsTable)
