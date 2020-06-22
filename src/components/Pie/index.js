import React ,{ Component } from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import _ from 'lodash'
import { themeOne } from '../echartTheme'
import DropList from '../DropList'
class Pie extends Component{
  constructor(){
    super()
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: "{b} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        right:1,
        top: '20',
        textStyle:{ //图例样式
          color: 'rgb(1, 189, 76)',
          fontSize:'12px'
        }
      }
    }
    this.state={
      option,
      height:300,
      onChartClick: function(){},
    }
  }
  componentDidMount(){
    const { pieData, name, unit, height } = this.props
    let onChartClick
    //点击事件判断
    if(!this.props.onChartClick){
       onChartClick = function(){}
    }else{
       onChartClick = this.props.onChartClick
    }
    this.setState({
      option: Object.assign({},{...this.state.option},
        {
        series : [
          {
            name:name,
            type:'pie',
            radius: ['50%', '70%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:pieData
          }
      ],
    },),
      onChartClick,
      height
    })
  }

  componentWillReceiveProps(nextProps){
    if(
      !(
        JSON.stringify(this.props.pieData) === JSON.stringify(nextProps.pieData) &&
        this.props.name === nextProps.name &&
        this.props.unit === nextProps.unit
      )
    ){
      const { pieData, name, unit } = nextProps
      this.setState({
        option: Object.assign({},{...this.state.option},{
          series : [
            {
              name:name,
              type:'pie',
              radius: ['50%', '70%'],
              center: ['25%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '12',
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:pieData
            }
        ],
      })
    })
    }
    if(this.props.height && this.props.height !== nextProps.height){
      this.setState({
        height: nextProps.height
      })
    }
  }
  render(){
    echarts.registerTheme('my_theme',themeOne)
    //const viewId = this.state.viewId
    const { height } = this.state
    return(
      <div>
        <ReactEcharts
          option={this.state.option}
          theme="my_theme"
          style={{height:height?`${height}px`:'300px'}}
          opts={{renderer: 'canvas'}}
          onEvents={
            {
              'click': (params,viewId)=>{this.state.onChartClick(params,this.state.viewId)},
            }
          }
        />
      </div>
    )
  }
}

export default Pie

//viewId 视图ID，通常指这个视图的这条数据ID
//name   string 指标名称
//unit string 单位
