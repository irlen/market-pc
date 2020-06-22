import React, { Component } from 'react'
import { Form, Input, Select, Row, Col } from 'antd'
import _ from 'lodash'

const { TextArea } = Input
class ConstantForm extends Component {
  state = {
    data: {}
  }

  componentDidMount(){
    this._isMounted = true
    const {data} = this.props
    if(data){
      this.setState({
        data
      },()=>{
        const {form} = this.props
        form.resetFields(data)
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      const { data } = nextProps
      if(this._isMounted){
        this.setState({
          data
        },()=>{
          const {form} = nextProps
          form.resetFields(data)
        })
      }
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const { data } = this.state
    return (
      <div>
        <Form>
          <Form.Item label="工单名称">
            {getFieldDecorator('order_name', {
              initialValue: data.order_name,
              rules: [
                {
                  required: true,
                  message: '名称为必填项',
                },{
                  max: 30,
                  message: '长度须小于30'
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="工单备注">
            {getFieldDecorator('order_note', {
              initialValue: data.order_note,
              rules: [
                {
                  required: false,
                  message: '',
                },
              ],
            })(<TextArea
              />)}
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create({
  onFieldsChange: (props, changedFields, allFields)=>{
    const arr = Object.keys(changedFields)
    if(arr && arr.length === 1){
      props.setConstentField(changedFields)
    }
  }
})(ConstantForm)
export default WrappedRegistrationForm
