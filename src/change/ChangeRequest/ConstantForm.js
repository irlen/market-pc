import React, { useEffect, useState } from 'react'
import { Form, Input, Select, Row, Col } from 'antd'
import _ from 'lodash'

const { TextArea } = Input

function ConstantForm(props) {
  const [ form ] = Form.useForm();
  const [data,setData]= useState({});
  const [_isMounted,set_isMounted] = useState(true);

  useEffect(()=>{
    const {data} = props
    if(data && Object.keys(data).length>0){
      setData(data);
    }
    return ()=>{
      set_isMounted(false)
    }
  },[])

  useEffect(()=>{
    setData(props.data)
  },[props.data])
  useEffect(()=>{
    if(data && data.order_name){
      form.setFieldsValue(data)
    }
  },[data])

  return (
    <div>
      <Form
        form={form}
        onFieldsChange={
          (changedFields, allFields)=>{
            //props.getConstentField(allFields);
            // const arr = Object.keys(changedFields)
            // if(arr && arr.length === 1){
            //   props.getConstentField(changedFields)
            // }

            const allData = _.cloneDeep(allFields);
            const newData = {}
            newData.errors = []
            if(allData && allData.length>0){
              allData.map(item=>{
                newData[item.name[0]] = item.value
                if(item.errors && item.errors.length>0){
                  newData.errors = item.errors
                }
              })
            }
            props.getConstentField(newData)
          }
        }
        layout={"vertical"}
      >
        <Form.Item label="工单名称"
          name="order_name"
          initialvalue={data.order_name}
          shouldUpdate={(prevValues, curValues) => prevValues.additional !== curValues.additional}
          rules={ [
            {
              required: true,
              message: '名称为必填项',
            },{
              max: 30,
              message: '长度须小于30'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="工单备注"
          name="order_note"
          rules={
            [
              {
                required: false,
                message: '',
              },
            ]
          }
        >
          <TextArea/>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ConstantForm
