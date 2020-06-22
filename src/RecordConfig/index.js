/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React ,{ Component } from 'react'
import {
  Tree, Input, Typography
} from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import { Scrollbars } from 'react-custom-scrollbars'


import WySpin from '../components/WySpin'
import { wyAxiosPost } from '../components/WyAxios'
import ModelCompare from './ModelCompare'
const { TreeNode } = Tree
const { Search } = Input
const { Text } = Typography
const getParentKey =(key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}
const changeColorForStr = (target,str)=>{
 let compiled = []
 if(str){
   const arr = str.split('')
   arr.forEach((item,index)=>{
     if(target.indexOf(item) !== -1){
       compiled.push(<Text key={index} type="warning">{item}</Text>)
     }else{
       compiled.push(<Text key={index}>{item}</Text>)
     }
   })
 }
 return compiled
}

class RecordConfig extends Component{
  constructor(props){
    super(props)
    this.debounced =_.debounce(this.doSearch,1000,{leading: false})
  }
  state = {
    //列表生成及搜搜
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,

    treeData: [],
    initTreeData: [],
    searchValue:'',
    autoHeight: 0,

    curDeviceId: '',
    curName:''


  }
  componentDidMount(){
    this._isMounted = true
    const { autoHeight } = this.props
    if(autoHeight){
      this.setState({
        autoHeight
      })
    }
    this.getTreeData()
  }
  componentWillReceiveProps(nextProps){
    if(this.props.autoHeight !== nextProps.autoHeight){
      if(this._isMounted){
        this.setState({
          autoHeight: nextProps.autoHeight
        })
      }
    }
  }
  //展开事件
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getTreeData = ()=>{
    wyAxiosPost('Record/getChangeRecord',{},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          treeData: _.cloneDeep(responseData.msg),
          initTreeData: _.cloneDeep(responseData.msg)
        },()=>{
          const {treeData} = this.state
          for(let item of treeData){
            if(item.children && item.children.length>0){
              const expandedKeys = [item.key]
              const curDeviceId = item.children[0].key
              const curName = item.children[0].title
              if(this._isMounted){
                this.setState({
                  expandedKeys,
                  curDeviceId,
                  curName
                })
              }
              return
            }
          }
        })
      }
    })
  }
  doSearch = ()=>{
    const { treeData, searchValue } = this.state
    let expandedKeys = []
    let data = []
    const runLoop = (iData,value)=>{
      data = _.cloneDeep(iData)
      if(data && data.length>0){
        data.map(item =>{
          if(item.title.indexOf(value) > -1){
            const parentKey = getParentKey(item.key,treeData)
            if(parentKey){
              expandedKeys.push(parentKey)
            }
          }
          runLoop(item.children,value)
        })
      }
    }
    runLoop(treeData,searchValue)
    this.setState({
      expandedKeys: _.uniq(expandedKeys),
      autoExpandParent: true,
    });
  }
  onChange = e => {
    const { value } = e.target;
    if(value){
      if(this._isMounted){
        this.setState({
          searchValue: value
        },()=>{
          this.debounced()
        })
      }
    }else{
      if(this._isMounted){
        this.setState({
          expandedKeys:[],
          autoExpandParent:true,
          treeData: _.cloneDeep(this.state.initTreeData),
          searchValue:''
        })
      }
    }
  }
  doSelect = (value)=>{
    const curId = value[0]
    if( curId &&  curId.indexOf('_') === -1){
      if(this._isMounted){
        const { treeData } = this.state
        for(let item of treeData){
          let isDo = false
          if(item.children && item.children.length>0){
            for(let subItem of item.children){
              if(subItem.key.toString() === curId){
                const curName = subItem.title
                this.setState({
                  curDeviceId: curId,
                  curName
                })
                isDo = true
                return
              }
            }
          }
          if(isDo){
            return
          }
        }
      }
    }
    return
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    const { searchValue, treeData, expandedKeys, autoExpandParent, autoHeight, curDeviceId, curName } = this.state
    let defaultSelectedKeys = []
    if(curDeviceId){
      const curDefaul = curDeviceId.toString()
      defaultSelectedKeys.push(curDefaul)
    }
    let height = 300
    if(autoHeight){
      height = autoHeight - 130
    }
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div style={{display:"flex",width:"100%"}}>
        <div style={{flex:"0 0 200px", padding:"10px",boxShadow: "0 0 5px rgba(221,221,221,0.8)"}}>
          <Search style={{ marginBottom: 8 }} size="small" placeholder="Search" onChange={this.onChange} />
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: height+'px'}}
          >
            {
              curDeviceId?
              <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                defaultValue={curDeviceId}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
                onSelect={this.doSelect}
                defaultSelectedKeys={defaultSelectedKeys}
                blockNode={true}
              >
                {
                  treeData && treeData.length>0?
                  loop(treeData)
                  :
                  ''
                }
              </Tree>
              :
              ''
            }
          </Scrollbars>
        </div>
        <div style={{flex:"1 1 auto",padding:"0 10px 0 10px"}}>
          <ModelCompare id={curDeviceId} name={curName}/>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state)=>({
  autoHeight: state.windowH.windowH
})

export default connect(mapStateToProps,null)(RecordConfig)
