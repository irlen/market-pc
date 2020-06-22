import React ,{ Component } from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import _ from 'lodash'


import { themeOne } from '../echartTheme'
import DropList from '../DropList'
import {colors} from '../colors'
class PieSun extends Component{
  constructor(){
    super()
    const option = {
      tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} {d}({d}%)"
      },
      legend: {
          show: false,
          orient: 'horizontal',
          left: 'center',
          bottom: 2,
          textStyle:{ //图例样式
            color: '#3399cc',
            fontSize:'12px',
          }
      }
    };

    this.state={
      option,
      onChartClick: function(){},
      viewId: '',
      onBrushSelected: function(){},
      onContextmenu: function(){return false},

      dropPosition:{x:"0px",y:"0px"},
      dropData: [],
      isexist: false,
      height:300
    }
  }
  setData = (pieData)=>{
    this.setState({
      option: Object.assign({},{...this.state.option},{
        series : {
          type: 'sunburst',
          highlightPolicy: 'ancestor',
          data: pieData,
          radius: [0, '50%'],
          sort: null,
          levels: [{}, {
              r0: '0%',
              r: '20%',
              itemStyle: {
                  borderWidth: 2,
                  borderColor:"rgba(0,0,0,0.2)"
              },
              label: {
                  rotate: 'tangential'
              }
          }, {
              r0: '20%',
              r: '40%',
              itemStyle: {
                  borderWidth: 3,
                  borderColor:"rgba(0,0,0,0.2)"
              },
              label: {
                  align: 'right'
              }
          }, {
              r0: '40%',
              r: '45%',
              label: {
                  position: 'outside',
                  padding: 3,
                  silent: false
              },
              itemStyle: {
                  borderWidth: 3,
                  borderColor:"rgba(0,0,0,0.2)",
              },
          }]
        },
        title : {
          text: '',
          textStyle: {
              fontSize: 14,
              align: 'center'
          }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b}"
        }
      }),
    })
  }
  componentDidMount(){
    const { pieData, height } = this.props
    let onChartClick
    //点击事件判断
    if(!this.props.onChartClick){
       onChartClick = function(){}
    }else{
       onChartClick = this.props.onChartClick
    }
    //let index = 0
    let len = colors.length
    console.log(pieData)
    const data = _.cloneDeep(pieData)
    data.map((item,index)=>{
      item.itemStyle = {
        color: '#f60'
      }
      if(item.children && item.children.length>0){
        item.children.map((threeItem,threeIndex)=>{
          let threeColor = '#f60'
          if(threeIndex<len){
              threeColor = colors[threeIndex]
          }else{
            const cur = threeIndex % len
            threeColor = colors[cur]
          }
          threeItem.itemStyle = {
            color: threeColor
          }

          if(threeItem.children && threeItem.children.length){
            threeItem.children.map(fourItem=>{
              fourItem.name = fourItem.name+" "+fourItem.count
              fourItem.value = 1
              fourItem.itemStyle = {
                color: threeColor,
                textStroke: "1px #3399cc"
              }
            })
          }
        })
      }
    })


    // const digui = (data)=>{
    //   data.map(item=>{
    //     if(! item.children){
    //       item.value = 1
    //       if(item.level === "4"){
    //         item.name = item.name+" "+item.count
    //       }
    //     }
    //     if(index<len){
    //       item.itemStyle={
    //         color: colors[index]
    //       }
    //     }else{
    //       const cur = index % len
    //       item.itemStyle={
    //         color: colors[cur]
    //       }
    //     }
    //     index ++
    //     if(item.children){
    //       digui(item.children)
    //     }
    //   })
    // }
    // digui(pieData)
    if(data && data.length>0){
      console.log(data)
      this.setData(data)
    }
    if(height){
      this.setState({
        height
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.pieData,nextProps.pieData)){
      const { pieData, title} = nextProps
      let index = 0
      let len = colors.length
      const data = _.cloneDeep(pieData)
      data.map((item,index)=>{
        item.itemStyle = {
          color: '#f60'
        }
        if(item.children && item.children.length>0){
          item.children.map((threeItem,threeIndex)=>{
            let threeColor = '#f60'
            if(threeIndex<len){
                threeColor = colors[threeIndex]
            }else{
              const cur = threeIndex % len
              threeColor = colors[cur]
            }
            threeItem.itemStyle = {
              color: threeColor
            }

            if(threeItem.children && threeItem.children.length){
              threeItem.children.map(fourItem=>{
                fourItem.name = fourItem.name+" "+fourItem.count
                fourItem.itemStyle = {
                  color: threeColor,
                }
              })
            }
          })
        }
      })
      // const digui = (data)=>{
      //   data.map(item=>{
      //     if(! item.children){
      //       item.value = 1
      //     }
      //     if(index<len){
      //       item.itemStyle={
      //         color: colors[index]
      //       }
      //     }else{
      //       const cur = index % len
      //       item.itemStyle={
      //         color: colors[cur]
      //       }
      //     }
      //     // let percent = 0
      //     // if(value){
      //     //   percent = parseFloat(item.value/value)
      //     //   percent = percent.toFixed(2)*100
      //     // }
      //     //item.name = item.name+ ' ' + item.value +' '+'('+percent+'%)'
      //     index ++
      //     if(item.children){
      //       digui(item.children)
      //     }
      //   })
      // }
      // digui(pieData)


      if(data && data.length>0){
        this.setData(data)
      }
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
    const { option,height } = this.state
    return(
      <div style={{height:height+'px'}}>
        <ReactEcharts
          option={ option }
          theme="my_theme"
          style={{height:this.state.height?this.state.height+'px':'300px'}}
          onEvents={
            {
              'click': (params)=>{this.props.onChartClick(params)},
              'contextmenu':(params,viewId)=>{
                const xPosition = params.event.event.clientX
                const yPosition = params.event.event.clientY
                const position= {
                  x: xPosition,
                  y: yPosition
                }
                const dom = params.event.event.target
                const curViewId = this.state.viewId
                this.state.onContextmenu(params,dom,position,curViewId)
              },
            }
          }
          opts={{renderer: 'canvas'}}
        />
        <DropList
          dropPosition={_.cloneDeep(this.state.dropPosition)}
          dropData={_.cloneDeep(this.state.dropData)}
          isexist={_.cloneDeep(this.state.isexist)}/>
      </div>
    )
  }
}

export default PieSun

//title  string 饼图标题
//pieData  数组：[{
  //   name: '松北区',
  //   value:2,
  //   itemStyle: {
  //       color: '#da0d68'
  //   },
  //   children: [
  //       {
  //           name: '高等院校',
  //           value: 1,
  //           itemStyle: {
  //               color: '#975e6d'
  //           }
  //       }，
  //       {
  //         name: '科研院所',
  //         value: 1,
  //         itemStyle: {
  //             color: '#975e6d'
  //         }
  //     }
  //   ]
  // }]

//toolbox  值为布尔值，是否开启工具盒 默认为false
//onChartClick  值为一个函数，默认为空
