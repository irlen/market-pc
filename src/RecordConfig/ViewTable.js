import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { setActivekeys } from '../actions'

import WyTable from '../components/WyTable'


class ViewTable extends Component{
  state = {
    pageSize: 5,
    current: 1,
    total:'',
    xData:[],
    yData:[]
  }
  componentDidMount(){
    this._isMounted = true
    const { data } = this.props
    if(data && this._isMounted){
      let total = 0
      let xData = _.cloneDeep(data.xxx)
      let yData = _.cloneDeep(data.yyy)
      if(data.yyy && data.yyy.length>0){
        total = data.yyy.length
        xData.map(item=>{
          const name = item.dataIndex+'_name'
          const key = item.dataIndex+'_key'
            item.render = (text, record, index)=>(
              record[name] && record[key]?
              <span title="点击查看详情" style={{fontWeight:"bold",color:"#22c960",cursor:"pointer"}} onClick={()=>this.toDetail({key:record[key],name:record[name]})}>{text}</span>
              :
              <span>{text}</span>
            )
        })
      }
      this.setState({
          xData,
          yData,
          total
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      if(nextProps.data && this._isMounted){
        const { data } = nextProps
        let total = 0
        let xData = _.cloneDeep(data.xxx)
        let yData = _.cloneDeep(data.yyy)
        if(data.yyy && data.yyy.length>0){
          total = data.yyy.length
          xData.map(item=>{
            const name = item.dataIndex+'_name'
            const key = item.dataIndex+'_key'
              item.render = (text, record, index)=>(
                record[name] && record[key]?
                <span title="点击查看详情" style={{fontWeight:"bold",color:"#22c960",cursor:"pointer"}} onClick={()=>this.toDetail({key:record[key],name:record[name]})}>{text}</span>
                :
                <span>{text}</span>
              )
          })
        }
        if(this._isMounted){
          this.setState({
              xData,
              yData,
              total,
              current:1
          })
        }
      }
    }
  }
  tableChange = (pagination)=>{
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
  }
  toDetail = (value)=>{
    this.props.doSetActiveKeys(value)
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  render(){
    const { total, current, pageSize, xData, yData } = this.state
    return (
      <div>
        {
          yData && yData.length>0?
          <WyTable
            xData={xData?xData:[]}
            yData={yData?yData:[]}
            tableChange={this.tableChange}
            total={total}
            current={current}
            pageSize={pageSize} />
          :
          ''
        }
      </div>
    )
  }
}
const mapDispatchToProps = dispatch =>({
  doSetActiveKeys: (value)=>{dispatch(setActivekeys(value))}
})

export default connect(null,mapDispatchToProps)(ViewTable)
