/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { Scrollbars } from 'react-custom-scrollbars'
import React ,{ Component } from 'react'
import { Row, Col, Button, Input,
  Popconfirm, Drawer, message ,
  Form, TimePicker,Select,
  Modal
} from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'

import WyTable from '../components/WyTable'
import WySpin from '../components/WySpin'
import { wyAxiosPost } from '../components/WyAxios'
import FieldForm from './FieldForm'
const { Search } = Input
const { Option } = Select
const FormRow = styled.div({
  display:"flex"
})

const FormLable = styled.div({
  flex:"0 0 100px",
  textAlign:"right",
  lineHeight:"40px",
  paddingRight:"10px"
})
const {TextArea} = Input
const FormRight = styled.div({
  flex:"1 1 auto",
})

class OrderList extends Component{
  state = {
    xData:[],
    yData:[],
    ids:[],
    id:'',
    visible: false,
    isSpining: false,

    pageSize: 20,
    current: 1,
    total:'',
    search:'',
    modalVisible: false,

    windowH: 200,
    excuteInfo:[],
    order_name:''
  }
  componentDidMount(){
    this._isMounted = true
    const { windowH } = this.props
    this.getDataList()
    this.setState({
      windowH
    })
  }
  componentWillReceiveProps(nextProps){
    if(this.props.windowH !== nextProps.windowH){
      if(this._isMounted){
        const { windowH } = nextProps
        this.setState({
          windowH
        })
      }
    }
  }
  tableChange = (pagination)=>{
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize,
    },()=>{
      this.getDataList(this.state.search)
    })
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
      id:''
    });
  };
  //添加按钮事件
  addDevice = ()=>{
    this.showDrawer()
  }
  //提交
  handleSubmit = e => {
   e.preventDefault();
   this.props.form.validateFieldsAndScroll((err, values) => {
     if (!err) {
       const compiledTime = values.rtime.format('HH:mm')
       values.rtime = compiledTime
       const { id } = this.state
       if(id){
         values.id = id
       }
       if(this._isMounted){
         this.setState({
           loading: true
         })
       }
       wyAxiosPost('Firewall/saveDevice',{info: values},(result)=>{
         const responseData = result.data.msg
         if(responseData.msg.status === 1){
           this.getDataList(this.state.search)
           message.success(responseData.msg.msg)
           this.onClose()
         }else{
           message.warning(responseData.msg.msg)
         }
         if(this._isMounted){
           this.setState({
             loading: false
           })
         }
       })
     }else{
       message.warning('数据填写有误，请按要求填写')
     }
   })
 }
  //获取列表
  getDataList = (search='')=>{
    const {current,pageSize} = this.state
    const info = {current,pageSize}
    if(search){
      info.search = search
    }
    if(this._isMounted){
      this.setState({
        isSpining: true
      })
    }
    wyAxiosPost('Order/getOrderList',{...info},(result)=>{
      const responseData = result.data.msg
      let curxData = _.cloneDeep(responseData.xxx)
        curxData.push({
          title: '操作',
          dataIndex: 'edit',
          render: (text, record, index)=>(
            <span>
              <span title="编辑" style={{cursor:"pointer",color: "#00CC66"}} onClick={()=>{this.editDevice(record.key)}} >
                <i className="fa fa-pencil-square" aria-hidden="true"></i>
              </span>
            </span>
          )
        })
      if(this._isMounted){
        this.setState({
          xData: curxData,
          yData: responseData.yyy,
          total: responseData.total,
          isSpining: false
        })
      }
    })
  }
  //编辑
  editDevice = (id)=>{
    this.setState({
      id
    },()=>{
      this.showDrawer()
    })
  }
  //执行操作
  doExcute = (record)=>{
    const {id,order_name} = record
    wyAxiosPost('Order/cmdGeneration',{id},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        const excuteInfo = responseData.msg
        if(this._isMounted){
          this.setState({
            excuteInfo,
            id,
            order_name
          },()=>{
            this.showModal()
          })
        }
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  tableChange = (pagination)=>{
    this.setState({
      isSpining: true,
      current: pagination.current,
      pageSize: pagination.pageSize,
    },()=>{
      this.getDataList()
    })
  }
  //删除设备
  delDevice = ()=>{
    const {ids} = this.state
    wyAxiosPost('Order/delOrder',{ids},(result)=>{
      const responseData = result.data.msg.msg
      if(responseData.status === 1){
        if(this._isMounted){
          this.setState({
            current: 1,
            ids:[]
          },()=>{
            this.getDataList()
            message.success(responseData.msg)
          })
        }
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  //搜索
  doSearch = (value)=>{
    if(this._isMounted){
      this.setState({
        search: value,
        current: 1
      },()=>{
        this.getDataList(this.state.search)
      })
    }
  }

  //执行操作相关
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleOk = e => {
    this.setState({
      modalVisible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      modalVisible: false,
      excuteInfo: [],
      id:'',
      order_name: ''
    });
  };
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const selectedRowKeys = this.state.ids
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
    const { visible,id, windowH, excuteInfo, order_name } = this.state
    let height = 200
    if(windowH){
      height = windowH - 200
    }
    const doWrap = (str)=>{
      const newStr=str.replace(/\n/g,"<br/>")
      return newStr
    }
    return (
      <div>
        <Row gutter={16}>
          <Col>
            <div css={{display:"flex"}}>
              <div css={{flex:"1 1 auto"}}>
                <Search
                  placeholder="请输入检索内容"
                  onChange={e => this.doSearch(e.target.value)}
                  style={{ width: 200 }}
                />
              </div>
              <div css={{flex:"0 0 318px"}}>
                <Button  style={{marginLeft:"10px"}} onClick={this.addDevice} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>创建工单</span></Button>
                <Popconfirm css={{marginLeft:"10px"}} placement="topLeft" title={this.state.ids.length>0?'确定要删除所选项？':'请先选择您要删除的项？'} onConfirm={this.state.ids.length>0?this.delDevice:()=>{}} okText="确定" cancelText="取消">
                  <Button style={{marginLeft: "10px"}}>
                    <i className="fa fa-minus-square-o" aria-hidden="true"></i>
                    <span style={{marginLeft:"5px"}}>删除</span>
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </Col>
        </Row>
        <Row css={{marginTop:"20px"}}>
          <Col>
            <WySpin isSpining={this.state.isSpining}>
              <WyTable
                rowSelection={rowSelection}
                xData={this.state.xData?this.state.xData:[]}
                yData={this.state.yData?this.state.yData:[]}
                tableChange={this.tableChange}
                total={this.state.total}
                current={this.state.current}
                pageSize={this.state.pageSize}
              />
            </WySpin>
          </Col>
        </Row>
        <div>
          <Drawer
            title={this.state.id === ''?'创建工单':'操作工单'}
            height={height}
            onClose={this.onClose}
            visible={visible}
            placement={'bottom'}
            destroyOnClose={true}
          >
            <FieldForm
              id={id}
              onClose={this.onClose}
              getDataList={this.getDataList}
            />
          </Drawer>
        </div>
        <div>
          <Modal
            title={order_name}
            visible={this.state.modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Scrollbars
              autoHide
              autoHideTimeout={100}
              autoHideDuration={200}
              universal={true}
              style={{height: `${height-200}px`}}
            >
            {
              excuteInfo && excuteInfo.length>0?
              excuteInfo.map(item=>{

                return(
                  <div key={item.name}>
                    <Row>
                      <Col style={{fontWeight:"bold"}}>{item.name}</Col>
                      <Col dangerouslySetInnerHTML={{__html:item.cmd?doWrap(item.cmd):''}}></Col>
                    </Row>
                  </div>
                )
              })
              :
              ''
            }
            </Scrollbars>
          </Modal>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(OrderList)
