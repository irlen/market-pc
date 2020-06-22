/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React , { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Button, Modal, Tabs, message } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'

import WyFrontTable from '../components/WyFrontTable'
import WySpin from '../components/WySpin'
import { wyAxiosPost } from '../components/WyAxios'
import { StyleContainer } from '../components/IndusModel'
import { setActivekeys } from '../actions'
import View from './View'
import ViewForCompare from './ViewForCompare'
const { TabPane } = Tabs
class ModelCompare extends Component{
  state = {
    xData:[],
    yData:[],
    id:'',
    initYData:[],
    ids:[],
    isSpining: false,
    visible: false,
    compareVisible: false,
    detailInfo:{},
    windowH: 200,

    viewId: [],
    showType:'view',
    viewData:[],
  }
  componentDidMount(){
    this._isMounted = true
    const { id, name, windowH} = this.props
    this.setState({
      windowH
    })
    if(id){
      this.setState({
        id,
        name,
      },()=>{
        this.getRecordData(id)
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.id !== nextProps.id){
      const { id, name } = nextProps
      if(this._isMounted){
        this.setState({
          id,
          name,
          ids:[]
        },()=>{
          this.getRecordData(id)
        })
      }
    }
    if(this.props.windowH !== nextProps.windowH && this._isMounted){
      this.setState({
        windowH: nextProps.windowH
      })
    }
  }

  getRecordData = (id)=>{
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Record/getRecordMsg',{id},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.msg.xxx)
      curxData.push({
        title: '操作',
        dataIndex: 'look',
        render: (text, record, index)=>(
          <span>
            <span title="查看" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>{this.seeDetail(record.id)}} >
              <i className="fa fa-eye" aria-hidden="true"></i>
            </span>
          </span>
        )
      })
      let curyData = _.cloneDeep(responseData.msg.yyy)
      curyData.map(item=>{
        const keysAttr = Object.keys(item)
        if(keysAttr && keysAttr.length>0){
          keysAttr.map(subItem=>{
            let len = 0
            if(item[subItem]){
              len = item[subItem].length
            }
            if(len>20 && subItem !== 'id' && subItem !== 'key'){
              const newSub = item[subItem].slice(0,20)
              item[subItem] = newSub + '…'
            }
          })
        }
      })

      if(this._isMounted){
        this.setState({
          xData: curxData,
          initYData: responseData.msg.yyy,
          yData: curyData,
          isSpining: false
        })
      }
    })
  }


  seeDetail = (value)=>{
    const {initYData} = this.state
    initYData.map(item=>{
      if(item.id === value && this._isMounted){
        this.setState({
          detailInfo: item
        })
        return
      }
    })
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Record/getViewById',{ id:value },(result)=>{
      const responseData = result.data.msg
      console.log(responseData)
      if(this._isMounted){
        this.setState({
          viewData: _.cloneDeep(responseData.msg),
          showType: 'view',
          isSpining: false
        },()=>{
          this.showModal()
        })
      }
    })
  }
  handleCancel =()=>{
    if(this._isMounted){
      this.setState({
        visible: false,
        viewData: [],
        ids:[],
        id:''
      },()=>{
        const value = {key:'',name:''}
        this.props.doSetActiveKeys(value)
      })
    }
  }
  compileCancel = ()=>{
    if(this._isMounted){
      this.setState({
        compareVisible: false,
        ids:[],
        id:''
      })
    }
  }
  showModal = ()=>{
    if(this._isMounted){
      this.setState({
        visible: true
      })
    }
  }
  //触发视图
  getView = (value)=>{
    const { ids } = this.state
    if(ids && ids.length === 1){
      if(this._isMounted){
        this.setState({
          viewId: ids[0],
          showType: value
        })
      }
    }else if(ids && ids.length>1){
      message.warning('一次只能查看一条记录的视图！')
    }else if(ids.length === 0){
      message.warning('请选择一条记录查看视图！')
    }
  }
  //触发对比
  doCompare = (value)=>{
    if(value.ids && value.ids.length !== 2){
      message.warning('请选择两条信息做对比')
      return
    }
    if(this._isMounted){
      this.setState({
        compareVisible: true
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { isSpining, xData, yData, detailInfo, windowH, name, showType, viewData, ids } = this.state
    const selectedRowKeys = ids
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        if(this._isMounted){
          this.setState({
            ids: selectedRowKeys
          })
        }
      }
    }
    let height = 300
    if(windowH>400){
      height = windowH - 260
    }
    const doWrap = (str)=>{
      const newStr=str.replace(/\n/g,"<br/>")
      return newStr
    }
    return (
      <div className='nowrapTable' >
        <StyleContainer>
          <div style={{display:"flex",lineHeight:"40px"}}>
            <div style={{flex:"1 1 auto"}}><span style={{paddingLeft:"20px"}}><span style={{fontWeight:"bold"}}>{name}</span></span></div>
            <div style={{flex:"0 0 60px"}}>
              <Button size="small" type="primary" onClick={()=>this.doCompare({name,ids:selectedRowKeys})}>对比</Button>
            </div>
          </div>

          <WySpin isSpining={isSpining}>
            <WyFrontTable
              rowSelection={rowSelection}
              xData={xData?xData:[]}
              yData={yData?yData:[]}
            />
          </WySpin>
        </StyleContainer>
        <Modal
          title={detailInfo.hostname}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          width={'80%'}
        >
          {
            viewData && viewData.length>0?
            <View viewData={viewData} />
            :
            ''
          }
        </Modal>
        <Modal
          title={<span style={{fontWeight:"bold"}}>{name}信息对比</span>}
          visible={this.state.compareVisible}
          onCancel={this.compileCancel}
          footer={null}
          width={'80%'}
        >
          <ViewForCompare ids={ids} name={name} />
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
const mapDispatchToProps = dispatch =>({
  doSetActiveKeys: (value)=>{dispatch(setActivekeys(value))}
})
export default connect(mapStateToProps,mapDispatchToProps)(ModelCompare)
