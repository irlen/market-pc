import React, { Component } from "react"
import NodeGroup from "react-move/NodeGroup"
import './barChart.css'
import _ from 'lodash'
import $ from 'jquery'
import { message } from 'antd'

let barHeight = 40;
let barPadding = 16;
let barColour = [
  "#6600CC","#99FF00","#00CC00",
  "#CCFF00","#FF0033","#0000FF",
  "#00FF00","#CC00FF","#990066",
  "#999933","#CC3300","#CCCC33",
  "#FF3333"
];
let widthScale = d => d * 5;

const BarGroup = (props)=>{
  //let width = widthScale(props.state.value);
  let yMid = barHeight * 0.5;
  const domWidth = $('.svgCont').width()
  const relWidth = (domWidth,maxValue,value)=>{
    if(!domWidth){
      return 0
    }
    const num_domWidth = parseInt(domWidth)
    const num_value = parseInt(value)
    if(num_domWidth<201){
      message.warning('模块宽度太小')
      return 0
    }
    const haha = num_domWidth - 200
    const compileW = parseInt(haha * num_value / maxValue)
    return compileW
  }


  //const width = relWidth(domWidth,props.maxValue,props.data.value) || 100
  const domV = domWidth - 240
  let width = parseInt(props.state.value/props.maxValue*domV) || 1

  let dom = ''
  if(width){
    dom = <g className="bar-group" transform={`translate(0, ${props.state.y})`}>
      <rect
        y={barPadding * 0.5}
        width={width}
        height={barHeight - barPadding}
        style={{
           fill: barColour[props.index],
           opacity: props.state.opacity ,
           margin:"5px 0 5px 0"

         }}
      />
      <text
        className="value-label"
        x={width + 20}
        y={yMid}
        alignmentBaseline="middle"
      >
        {props.state.value.toFixed(0)}
      </text>
      <text
        className="name-label"
        x="-16"
        y={yMid}
        alignmentBaseline="middle"
        style={{ opacity: props.state.opacity ,color:"rgba(0,0,0,0.8)"}}
      >
        {props.data.name}
      </text>
    </g>
  }

  return (
    <g className="bar-group" transform={`translate(0, ${props.state.y})`}>
      <rect
        y={barPadding * 0.5}
        width={width}
        height={barHeight - barPadding}
        style={{
           fill: barColour[props.index],
           opacity: props.state.opacity ,
         }}
      />
      <text
        className="value-label"
        x={width + 20}
        y={yMid}
        alignmentBaseline="middle"
      >
        {props.state.value.toFixed(0)}
      </text>
      <text
        className="name-label"
        x="-16"
        y={yMid}
        alignmentBaseline="middle"
        style={{ opacity: props.state.opacity ,color:"rgba(0,0,0,0.8)"}}
      >
        {props.data.name}
      </text>
    </g>
  );
}
class BarMove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[
        {
          id:'a',
          name:'新一代信息技术',
          value:'123'
        },{
          id:'b',
          name:'高端装备',
          value:'67'
        },{
          id:'c',
          name:'新材料',
          value:'45'
        },{
          id:'d',
          name:'数字创意',
          value:'46'
        },{
          id:'e',
          name:'新能源',
          value:'127'
        },{
          id:'f',
          name:'新能源汽车',
          value:'67'
        },{
          id:'g',
          name:'生物产业',
          value:'25'
        },{
          id:'h',
          name:'相关服务业',
          value:'78'
        }
      ],
      atom:[],
      year:'',
      height: 200,
    };

    // this.handleAdd = this.handleAdd.bind(this);
    // this.handleRemove = this.handleRemove.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
  }

  // handleAdd() {
  //   this.setState({
  //     data: getAppendedData(this.state.data)
  //   });
  // }
  //
  // handleRemove() {
  //   this.setState({
  //     data: getTruncatedData(this.state.data)
  //   });
  // }
  //
  // handleUpdate() {
  //   this.setState({
  //     data: getUpdatedData(this.state.data)
  //   });
  // }

  startTransition(d, i) {
    return { value: 0, y: i * barHeight, opacity: 1000 };
  }

  enterTransition(d) {
    return { value: [d.value], opacity: [1], timing: { duration: 1000 }};
  }

  updateTransition(d, i) {
    return { value: [d.value], y: [i * barHeight], timing: { duration: 1900 }};
  }

  leaveTransition(d) {
    return { y: [-barHeight], opacity: [0], timing: { duration: 1000 } };
  }
  componentDidMount(){
    this._isMounted = true
    const { data, height } = this.props
    if(data && data.length>0){
      this.setState({
        data:_.cloneDeep(data),
        height
      })
    }

    // this.timer1 = setInterval(()=>{
    //   const cur = this.state.data
    //   let newCur = []
    //   newCur = cur.map((item)=>{
    //     const rand = Math.random()
    //     const value = parseInt(rand*100)
    //     return {id: item.id, name: item.name, value}
    //   })
    //
    // const rel = _.sortBy(newCur, function(item) {
    //     return -item.value;
    //   })
    //   this.setState({
    //     data: rel
    //   })
    // },3000)




  }
  barRun = (data)=>{
    const keysArr = Object.keys(data)
    const valuesArr = Object.values(data)
    const len = keysArr.length
    let index = 0
    if(keysArr && keysArr.length>0){
      if(this.timer1){
        clearInterval(this.timer1)
      }
      this.timer1 = setInterval(()=>{
        if(this._isMounted){
          this.setState({
            atom: valuesArr[index],
            year: keysArr[index]
          },()=>{
            index = index + 1
            if(index === len){
              index = 0
            }
          })
        }
       },3000)
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.height !== nextProps.height){
      if(this._isMounted){
        this.setState({
          height: nextProps.height
        })
      }
    }
    if(! _.isEqual(this.props.data,nextProps.data)){
      if(this._isMounted){
        this.setState({
          data: _.cloneDeep(nextProps.data)
        },()=>{
          this.barRun(this.state.data)
        })
      }
    }
  }

  componentWillUnmount(){
    this._isMounted = false
    if(this.timer1){
      clearInterval(this.timer1)
    }
  }
  render() {
    const {atom} = this.state
    let maxValue = 0
    if(atom && atom.length>0){
      const maxValueObj = _.maxBy(atom,(o)=>{
        return parseInt(o.value)
      })
      maxValue = parseInt(maxValueObj.value) || 1
    }
    const { height } = this.state
    return (
      <div className="svgCont" style={{padding: "0 20px 0 20px", position:"relative"}}>
      {
        maxValue?
        <svg width="100%" height={`${height}px`}>
          <g className="chart" transform="translate(100,10)">
            <NodeGroup
              data={this.state.atom}
              keyAccessor={d => d.name}
              start={this.startTransition}
              enter={this.enterTransition}
              update={this.updateTransition}
              leave={this.leaveTransition}
            >
              {nodes => (
                <g>
                  {nodes.map(({ key, data, state },index) => (
                    <BarGroup maxValue={maxValue} key={key} data={data} state={state} index={index} />
                  ))}
                </g>
              )}
            </NodeGroup>
          </g>
        </svg>
        :
        ''
      }
        <div style={{width:"100px", position:"absolute", bottom:"60px", right:"40px",fontSize:"30px",color:"#009900"}}>
          {this.state.year}
        </div>
      </div>
    );
  }
}

export default BarMove
