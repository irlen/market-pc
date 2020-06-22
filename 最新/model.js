//Input输入
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区名称">
    {getFieldDecorator('park_name', {
      rules: [
        { required: false, message: '' }
    ],
  })(<Input  />)}
  </Form.Item>
</Col>

//输入数字
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区总投资额">
    {getFieldDecorator('investment', {
      rules: [
        { required: false, message: '' }
    ],
  })(<InputNumber css={{width:"80%"}} min={0} />)}
  {' 亿元'}
  </Form.Item>
</Col>

//输入文本
<Col sm={24} md={12} lg={8} css={{height:"93px"}}>
  <Form.Item label="园区主导产业">
    {getFieldDecorator('prime_industry', {
      rules: [
        { required: false, message: '' }
    ],
  })(<TextArea autosize={{minRows:1, maxRows:2}} />)}
  </Form.Item>
</Col>

//百分比
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区容积率">
    {getFieldDecorator('volume_ratio', {
      rules: [
        { required: false, message: '' }
    ],
  })(<InputNumber
    min={0}
    max={100}
    formatter={value => `${value}%`}
    parser={value => value.replace('%', '')}
    css={{width:"100%"}}
  />)}
  </Form.Item>
</Col>
//单选
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区系列">
    {getFieldDecorator('park_series', {
      rules: [
        { required: false, message: '' }
    ],
  })(<Select style={{ width: "100%" }}>
      <Option value="远郊型" key="远郊型">远郊型</Option>
      <Option value="远郊结合型" key="远郊结合型">远郊结合型</Option>
      <Option value="城市型" key="城市型">城市型</Option>
    </Select>)}
  </Form.Item>
</Col>

//多选
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区配套情况">
    {getFieldDecorator('park_situation', {
      rules: [
        { required: false, message: '' }
    ],
  })(<Select
      mode="multiple"
      style={{ width: '100%' }}
      maxTagCount={2}
      maxTagPlaceholder="...等"
    >
      <Option value="住宅" key="住宅">住宅</Option>
      <Option value="食堂" key="食堂">食堂</Option>
      <Option value="餐饮店" key="餐饮店">餐饮店</Option>
      <Option value="银行" key="银行">银行</Option>
    </Select>)}
  </Form.Item>
</Col>
//分组
<Col sm={24} md={12} lg={8}>
  <Form.Item label="园区配套情况">
    {getFieldDecorator('park_situation', {
      rules: [
        { required: false, message: '' }
    ],
  })(<Select
      mode="multiple"
      style={{ width: '100%' }}
      maxTagCount={2}
      maxTagPlaceholder="...等"
    >
      <OptGroup label="技术配套" key="技术配套">
        <Option value="公共研发中心" key="公共研发中心">公共研发中心</Option>
        <Option value="孵化中心" key="孵化中心">孵化中心</Option>
        <Option value="检测认证中心" key="检测认证中心">检测认证中心</Option>
      </OptGroup>
    </Select>)}
  </Form.Item>
</Col>

//测试分支




//数据结构
//柱状图
xxx:['香坊区','道里区','']
yyy:[{
  name:'产业园数量',
  type:'bar',
  data:[12,13,354]
}]
unit:''

//饼图
{
  pieData:[
    {
      name:'',
      value:12,
    },{
      name:'',
      value:12,
    }
  ],
  name:'',
}

//环形分布图
data = [{
    name: '松北区',
    value:2,
    itemStyle: {
        color: '#da0d68'
    },
    children: [
        {
            name: '高等院校',
            value: 1,
            itemStyle: {
                color: '#975e6d'
            }
        }，
        {
          name: '科研院所',
          value: 1,
          itemStyle: {
              color: '#975e6d'
          }
      }
    ]
  }]

//泡泡图
data = [
  {
    "geometry":{
      "type":"Point",
      "coordinates":[116.84037246524984,39.824588422242826]
    },
    "count":2.0423924061051713
  }
]
data = [
  {
    year:'2014',
    list:[
      {
        name: '高等院校',
        data:[
          {
            "geometry":{
              "id":'',
              "type":"Point",
              "coordinates":[116.84037246524984,39.824588422242826]
            },
            "count":2.0423924061051713
          }
        ]
      },{
        name: '科研院所',
        data:[
          {
            "geometry":{
              "id":'',
              "type":"Point",
              "coordinates":[116.84037246524984,39.824588422242826]
            },
            "count":2.0423924061051713
          }
        ]
      }
    ]
  },{
    year:'2015',
    list:[
      {
        name: '高等院校',
        data:[
          {
            "geometry":{
              "id":'',
              "type":"Point",
              "coordinates":[116.84037246524984,39.824588422242826]
            },
            "count":2.0423924061051713
          }
        ]
      },{
        name: '科研院所',
        data:[
          {
            "geometry":{
              "id":'',
              "type":"Point",
              "coordinates":[116.84037246524984,39.824588422242826]
            },
            "count":2.0423924061051713
          }
        ]
      }
    ]
  }
]
