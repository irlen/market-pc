/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ Component } from 'react'
import { Row, Col, Button, Input,
  Popconfirm, Drawer, message ,
  Form, TimePicker,Select
} from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'

import WyTable from '../components/WyTable'
import WySpin from '../components/WySpin'
import { wyAxiosPost } from '../components/WyAxios'
import { singleIp } from '../components/RegExp'
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

class FireDevice extends Component{
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

    deviceTypeList: [],
    connTypeList:[],
    loading: false,
  }
  componentDidMount(){
    this._isMounted = true
    this.getDeviceTypeList()
    this.getDataList()
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
    this.props.form.resetFields()
    this.setState({
      visible: false,
      id:''
    });
  };
  //校验ip
  validateIp = (rule, value, callback) => {
    const { form } = this.props
    if (value && !singleIp.test(value)) {
     callback('ip格式尚不正确')
    }else{
      callback();
    }
  }

  //获取设备型号和连接类型
  getDeviceTypeList = ()=>{
    wyAxiosPost('Firewall/getDeviceType',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          deviceTypeList: responseData.msg
        })
      }
    })
  }
  //获取连接类型列表
  device_typeChange = (value)=>{
    const form = this.props.form
    const { deviceTypeList } = this.state
    if(deviceTypeList && deviceTypeList.length>0){
      const item = _.find(deviceTypeList,o=>{return o.type_name === value})
      const connTypeList = item.conn_type
      if(this._isMounted){
        this.setState({
          connTypeList
        },()=>{
          form.setFieldsValue({conn_type:''})
        })
      }
    }
  }
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
    wyAxiosPost('Firewall/getDeviceList',{...info},(result)=>{
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
      this.getDeviceById()
    })
  }

  //获取单条
  getDeviceById = ()=>{
    const { id, deviceTypeList } = this.state
    wyAxiosPost('Firewall/getDeviceById',{id},(result)=>{
      const responseData = result.data.msg
      const { name, ip, username, device_type, label, decribe, conn_type } = responseData.msg
      const curTime = responseData.msg.rtime
      const rtime = moment(curTime,'HH:mm')
      const item = _.find(deviceTypeList,o=>{return o.type_name === device_type})
      const connTypeList = item.conn_type
      if(this._isMounted){
        this.setState({
          connTypeList
        })
      }
      this.props.form.setFieldsValue({ name, ip, username, device_type, label, decribe, rtime, conn_type })
      this.showDrawer()
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
    wyAxiosPost('Firewall/delDevice',{ids},(result)=>{
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
  //收集信息
  collectDevice =()=>{
    const {ids} = this.state
    if(ids && ids.length>0){
      wyAxiosPost('Firewall/getCollectData',{ids},(result)=>{
      })
      message.success('后台即将收集所选数据。')
    }else{
      message.warning('请先选择需要收集的项！')
    }
  }
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
    const { getFieldDecorator } = this.props.form
    const { visible,id, deviceTypeList, connTypeList, loading } = this.state
    const passPlaceholder = id?'****************':''
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
                <Button style={{marginLeft: "10px"}} type="primary" onClick={this.collectDevice}>
                  <i className="fa fa-cart-arrow-down" aria-hidden="true"></i>
                  <span style={{marginLeft:"5px"}}>收集数据</span>
                </Button>
                <Button  style={{marginLeft:"10px"}} onClick={this.addDevice} type="primary"><i className="fa fa-plus-square-o" aria-hidden="true"></i> <span css={{marginLeft:"5px"}}>添加设备</span></Button>
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
            title={this.state.id === ''?'新增设备':'修改设备'}
            width={"60%"}
            onClose={this.onClose}
            visible={visible}
          >
            <Form layout='horizontal' onSubmit={this.handleSubmit}>
              <FormRow>
                <FormLable>
                名称:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '名称不能为空',
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                ip:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('ip', {
                      rules: [
                        {
                          required: true,
                          message: 'ip不能为空',
                        },{
                          validator: this.validateIp,
                        }
                      ],
                    })(<Input />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                账号:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('username', {
                      rules: [
                      ],
                    })(<Input />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                密码:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('passwd', {
                      rules: [
                      ],
                    })(<Input.Password placeholder={passPlaceholder} />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                特权密码:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('tpasswd', {
                      rules: [
                      ],
                    })(<Input.Password placeholder={passPlaceholder} />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                设备型号:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('device_type', {
                      rules: [
                        {
                          required: true,
                          message: '设备型号不能为空',
                        },
                      ],
                    })(
                      <Select
                        onChange={this.device_typeChange}
                      >
                        {
                          deviceTypeList && deviceTypeList.length>0?
                          deviceTypeList.map(item=>{
                            return <Option key={item.type_name} value={item.type_name} >{item.name}</Option>
                          })
                          :
                          ''
                        }

                      </Select>
                    )}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                连接类型:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('conn_type', {
                      rules: [
                        {
                          required: true,
                          message: '连接类型不能为空',
                        },
                      ],
                    })(
                      <Select>
                        {
                          connTypeList && connTypeList.length>0?
                          connTypeList.map(item=>{
                            return <Option key={item} value={item} >{item}</Option>
                          })
                          :
                          ''
                        }
                      </Select>
                    )}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                读取时间:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('rtime', {
                      rules: [
                        {
                          required: true,
                          message: '读取时间不能为空',
                        },
                      ],
                    })(<TimePicker format={'HH:mm'} />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                标签:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('label', {
                      rules: [
                      ],
                    })(<Input />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
              <FormRow>
                <FormLable>
                描述:
                </FormLable>
                <FormRight>
                  <Form.Item label="">
                    {getFieldDecorator('decribe', {
                      rules: [
                      ],
                    })(<TextArea />)}
                  </Form.Item>
                </FormRight>
              </FormRow>
            </Form>
            <div style={{height:"40px"}}></div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{
                  marginRight: 8,
                }}
                onClick={this.onClose}
              >
                取消
              </Button>
              <Button onClick={this.handleSubmit} type="primary" loading={loading}>
                提交
              </Button>
            </div>
          </Drawer>
        </div>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(FireDevice);

export default WrappedRegistrationForm
