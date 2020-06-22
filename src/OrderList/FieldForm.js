/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Button, message, Collapse, Icon, Modal, Spin } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import { wyAxiosPost } from '../components/WyAxios'
import ConstantForm from './ConstantForm'
import ConstantForm_Editless from './ConstantForm_Editless'
import AtomForm from './AtomForm'
import AtomForm_Editless from './AtomForm_Editless'
import StepTwo from './StepTwo'
import StepTwo_Editless from './StepTwo_Editless'
import StepThree from './StepThree'
const { Panel } = Collapse


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
class InfoModal {
  constructor(deviceName){
    this.deviceName = deviceName
    this.modal = Modal.info({
      width: 800,
      title:`请稍候，正在执行对设备${this.deviceName}的命令下发...`,
      content:<Spin indicator={antIcon} />
    })
  }
  getModal(){
    return this.modal
  }
  updateModal(msg){
    const doWrap = (str)=>{
      const newStr=str.replace(/\\n/g,"<br/>")
      //const nextStr = newStr.replace(/\s/g,'&nbsp;')
      return newStr
    }
    let relmsg = ''

    if(msg){
      relmsg = doWrap(msg)
    }
    this.modal.update({
      width:800,
      title:`设备${this.deviceName}命令下发成功`,
      content: <code style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{ __html:relmsg }}>

      </code>,
    })
  }
  destroyModal(){
    this.modal.destroy()
  }
}
const StyledDiv = styled.div({
  height:"30px",
  borderRadius:"20px",
  border: "#cccccc solid 1px",
  lineHeight:"30px",
  textAlign:"center",
  cursor:"pointer",
  flex:"0 0 30px"
})
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}
const StyledLine = styled.div({
  flex:"1 1 auto",
  height:"15px",
  borderBottom:"#cccccc solid 1px",
  margin: "0 10px 0 10px"
})
class FieldForm extends Component {
  state = {
    constantField:{
      order_name:'',
      order_note:'',
      errors:[],
    },
    //第一步数据
    atomList:[
      {
        id:'18907428',
        device:[],
        source_address:[],
        des_address:[],
        port:[],
        behavior:'permit',
        atom_note:'',
        errors:[]
      }
    ],
    //第二步数据
    step_two:[],
    step_two_errors:[],
    windowH: 0,
    loading: false,
    id:'',
    curPage: 1,
    total: 3,
    flag: 0
  }
  componentDidMount(){
    this._isMounted = true
    const { windowH, id } = this.props
    this.setState({
      windowH
    })
    if(id){
      this.setState({
        id,
        curPage: 1
      })
    }
    if(id){
      this.getDataById(id)
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.windowH !== nextProps.windowH){
      const {windowH} = nextProps
      if(this._isMounted && windowH){
        this.setState({
          windowH
        })
      }
    }
    if((this.props.id !== nextProps.id) && nextProps.id){
      const { id } = nextProps
      if(this._isMounted){
        this.setState({
          id
        })
      }
      this.getDataById(id)
    }
  }
  getDataById = (id)=>{
    wyAxiosPost('Order/getOrderById',{id},(result)=>{
      const responseData = result.data.msg
      const constantField = {
        order_name: responseData.msg.order_name,
        order_note: responseData.msg.order_note,
        errors:[]
      }
      const atomList = _.cloneDeep(responseData.msg.stragidy)
      if(atomList && atomList.length>0){
        atomList.map(item=>{
          item.errors = []
        })
      }
      const flag = responseData.msg.flag
      let curPage = flag+1
      if(flag === 3){
        curPage = 3
      }
      let step_two = []
      if(responseData.msg.decode_msg && responseData.msg.decode_msg.length>0){
        step_two = _.cloneDeep(responseData.msg.decode_msg)
      }
      let step_three = []
      if(responseData.msg.make_cmd && responseData.msg.make_cmd.length>0){
        step_three = _.cloneDeep(responseData.msg.make_cmd)
      }
      if(this._isMounted){
        this.setState({
          id,
          constantField,
          atomList,
          flag,
          curPage,
          step_two,
          step_three
        })
      }
    })
  }
  addStragidy = ()=>{
    const id1 = (Math.random()+1)*100000
    const id2 = Date.now()
    const id3 = parseInt(id1 + id2).toString()
    const id = id3.substring(id3.length-8,id3.length)
    const atom = {
      id,
      device:[],
      source_address:[],
      des_address:[],
      port:[],
      behavior:'permit',
      atom_note:'',
      errors:[],
      copied: true
    }
    const newAtomList = _.cloneDeep(this.state.atomList)
    newAtomList.push(atom)
    if(this._isMounted){
      this.setState({
        atomList: newAtomList
      })
    }
  }
  removeStragidy = (id)=>{
    const newAtomList = _.cloneDeep(this.state.atomList)
    const cur = newAtomList.filter((o)=>{return o.id !== id})
    if(this._isMounted){
      this.setState({
        atomList: cur
      })
    }
  }







  setConstentField = (value)=>{
    const keyNameArr = Object.keys(value)
    const keyName = keyNameArr[0]
    const obj = value[keyName]
    const curField = _.cloneDeep(this.state.constantField)
    curField[keyName] = obj['value']
    if(obj.errors){
      if(curField.errors.indexOf(keyName) === -1){
        curField.errors.push(keyName)
      }
    }else if(!obj.errors){
      if(curField.errors && curField.errors.length>0){
        const curErrors = curField.errors.filter(o=>{ return o !== keyName})
        curField.errors = _.cloneDeep(curErrors)
      }
    }
    if(this._isMounted){
      this.setState({
        constantField: _.cloneDeep(curField)
      })
    }
  }
  setAtomField = (info)=>{
    console.log(info)
    const { id,changedFields } = info
    const keyNameArr = Object.keys(changedFields)
    const keyName = keyNameArr[0]
    const obj = changedFields[keyName]
    const curField = _.cloneDeep(this.state.atomList)
    for(let item of curField){
       if(item.id === id){
        item[keyName] = obj['value']
        if(obj.errors){
          if(item.errors.indexOf(keyName) === -1){
            item.errors.push(keyName)
          }
          break
        }else if(!obj.errors){
          if(item.errors && item.errors.length>0){
            const curErrors = item.errors.filter(o=>{ return o !== keyName})
            item.errors = _.cloneDeep(curErrors)
          }
          break
        }
      }
    }
    console.log(curField)
    if(this._isMounted){
      this.setState({
        atomList: _.cloneDeep(curField)
      })
    }

  }
  setStepTwo = (info)=>{
    const { id,changedFields } = info
    const keyNameArr = Object.keys(changedFields)
    const keyName = keyNameArr[0]
    const obj = changedFields[keyName]
    const curField = _.cloneDeep(this.state.step_two)
    const errors = obj.errors
    let step_two_errors = _.cloneDeep(this.state.step_two_errors)
    if(errors){
      if(step_two_errors.indexOf(keyName) === -1){
        step_two_errors.push(keyName)
      }
    }else{
      if(step_two_errors.indexOf(keyName) !== -1){
        const curErrors = step_two_errors.filter(o=>{ return o !== keyName})
        step_two_errors = _.cloneDeep(curErrors)
      }
    }
    const name_arr = keyName.split('-')
    if(name_arr[0] === 'acl_name'){
      curField[id]['cmd']['acl_name'] = obj.value
    }else{
      //cmd-add-${index}-group-source-name
      curField[id]['cmd'][name_arr[1]][name_arr[2]]['group'][name_arr[4]]['name'] = obj.value
    }
    if(this._isMounted){
      this.setState({
        step_two_errors,
        step_two: _.cloneDeep(curField)
      })
    }
  }





  saveOrder = (save_and_next)=>{ return new Promise((resolve,reject)=>{
    const {constantField,atomList,id,flag} = this.state
    let isRight = true
    //名称的校验
    if(constantField.order_name === ''  || constantField.errors.length>0){
      isRight = false
    }
    //工单未添加
    if(atomList && atomList.length === 0){
      isRight = false
      message.warning('工单没有添加事件')
    }
    if(atomList && atomList.length>0){
      for(let item of atomList){
        //必填项为填写校验
        if(item.device.length === 0 || item.source_address.length === 0 || item.des_address === 0 || item.port.length === 0 || item.behavior === ""){
          isRight = false
          break
        }
        //格式错误检测
        if(item.errors && item.errors.length>0){
          isRight = false
          break
        }
      }
    }
    let all_field = _.cloneDeep(constantField)
    if(id){
      all_field.id = id
    }
    all_field.stragidy = atomList
    if(save_and_next){
      all_field.flag = flag + 1
    }else{
      all_field.flag = flag
    }
    all_field.save_and_next = save_and_next
    if(this._isMounted){
      this.setState({
        loading: true
      })
    }
    if(isRight){
      wyAxiosPost('Order/saveOrder',{all_field},(result)=>{
        const responseData = result.data.msg
        if(this._isMounted){
          this.setState({
            loading: false
          })
        }
        if(responseData.msg.status === 1){
          this.props.getDataList()
          if(!save_and_next){
            this.props.onClose()
            resolve('stop')
          }else{
            resolve(responseData.msg)
          }
          message.success(responseData.msg.msg)
        }else{
          message.warning(responseData.msg.msg)
          reject()
        }
        if(this._isMounted){
          this.setState({
            loading: false
          })
        }
      })
    }else{
      if(this._isMounted){
        this.setState({
          loading: false
        })
      }
      message.warning('填写有误，请正确填写所有必填项！')
      reject()
    }
  })}
  saveStepTwo = (save_and_next)=>{ return new Promise((resolve,reject)=>{
    const { step_two, id, flag, step_two_errors } = this.state
    let all_field = {id,decode_msg: step_two}
    if(save_and_next){
      all_field.flag = flag + 1
    }else{
      all_field.flag = flag
    }
    all_field.save_and_next = save_and_next
    if(this._isMounted){
      this.setState({
        loading: true
      })
    }
    if(step_two_errors.length === 0){
      wyAxiosPost('Order/saveOrder',{all_field},(result)=>{
        const responseData = result.data.msg
        if(this._isMounted){
          this.setState({
            loading: false
          })
        }
        if(responseData.msg.status === 1){
          this.props.getDataList()
          if(!save_and_next){
            this.props.onClose()
            resolve('stop')
          }else{
            resolve(responseData.msg)
          }
          message.success(responseData.msg.msg)
        }else{
          message.warning(responseData.msg.msg)
          reject()
        }
        if(this._isMounted){
          this.setState({
            loading: false
          })
        }
      })
    }else{
      if(this._isMounted){
        this.setState({
          loading: false
        })
      }
      message.warning('填写有误，请正确填写所有必填项！')
      reject()
    }
  })}


  toNextStep = (save_and_next)=>{
    const { curPage, total } = this.state
    if(save_and_next){
      if(curPage === 1){
        this.saveOrder(save_and_next).then((data)=>{
          if(this._isMounted){
            this.setState({
              step_two: data.decode_msg
            },()=>{
              if(this._isMounted){
                this.setState({
                  id: data.id,
                  curPage: curPage + 1,
                  flag: parseInt(data.flag),
                })
              }
            })
          }
        },(error)=>{
          return
        })
      }else if(curPage === 2){
        this.saveStepTwo(save_and_next).then((data)=>{
          if(this._isMounted){
            this.setState({
              step_three: data.make_cmd
            },()=>{
              if(this._isMounted){
                this.setState({
                  id: data.id,
                  curPage: curPage + 1,
                  flag: parseInt(data.flag),
                })
              }
            })
          }
        },(error)=>{
          return
        })
      }
    }else{
      this.setState({
        curPage: curPage + 1
      })
    }
  }
  toLastStep = ()=>{
    const { curPage } = this.state
    if(curPage>1 && this._isMounted){
      this.setState({
        curPage: curPage - 1
      })
    }
  }
  toCurStep = (step)=>{
    if(this._isMounted){
      this.setState({
        curPage: step
      })
    }
  }
  compelete = ()=>{
    const { id } = this.state
    wyAxiosPost('Order/saveComplete',{id,flag:3},(result)=>{
      const responseData =  result.data.msg
      if(responseData.msg.status === 1){
        this.props.onClose()
      }else{
        message.warning(responseData.msg.msg)
      }
    })
  }
  sendToDevice = (info)=>{
    const infomodal = new InfoModal(info.name)
    infomodal.getModal()
    wyAxiosPost('Order/lowerEquipment',{info},(result)=>{
      const responseData = result.data.msg
      if(responseData.status === 1){
        infomodal.updateModal(_.cloneDeep(responseData.msg))
      }else{
        infomodal.destroyModal()
        message.warning(responseData.msg)
      }
    })
  }
  componentWillUnmount(){
    if(this._isMounted){
      this.setState({
        step_two_errors:[]
      })
    }
    this._isMounted = false
  }
  render(){
    const {
      atomList, windowH, constantField, loading,
      curPage, total, flag, id, step_two, step_three
    } = this.state
    let height = 200
    if(windowH){
      height = windowH - 350
    }
    const isSave = (curPage === 1 || curPage === 2)
    const isSave_and_quit = (curPage>flag && curPage<total)
    const isSave_or_next = (curPage<total)
    return (
      <div style={{display:"flex", padding:"0px 0 20px 0"}}>
        <div style={{flex:"0 0 200px",padding:"0 20px 0 20px"}}>
        {
          flag === 0?
          <ConstantForm
            setConstentField={(value)=>{this.setConstentField(value)}}
            data={constantField}
          />
          :
          <ConstantForm_Editless
            setConstentField={(value)=>{this.setConstentField(value)}}
            data={constantField}
          />
        }
        </div>
        <div style={{flex:"1 1 auto",borderLeft:"#cccccc solid 1px",padding:"0 20px 0 20px"}}>
          <div style={{width:"100%",height:"40px",lineHeight:"40px", display:"flex",padding:"0 40px 0 40px",borderBottom:"#cccccc dashed 1px"}}>
            <StyledDiv
              style={{background: flag>0?"#01bd4c":"none",color: flag>0?"#ffffff":"#333333",position:"relative"}}
              onClick={flag>0?()=>{this.toCurStep(1)}:()=>{return}}
            >
              <span>1</span>
              {
                curPage === 1?
                <span style={{
                  position:"absolute",
                  top:"-21px",
                  left:"13px",
                  color:"rgb(1, 189, 76)"
                }}>
                  <i className="fa fa-flag" aria-hidden="true"></i>
                </span>
                :
                ''
              }

            </StyledDiv>
            <StyledLine
              style={{
                borderBottom: flag>1?"#01bd4c solid 1px":"#cccccc solid 1px",
              }}
            ></StyledLine>
            <StyledDiv
              style={{background: flag>1?"#01bd4c":"none",color: flag>1?"#ffffff":"#333333",position:"relative"}}
              onClick={flag>1?()=>{this.toCurStep(2)}:()=>{return}}
            >
              <span>2</span>
              {
                curPage === 2?
                <span style={{
                  position:"absolute",
                  top:"-21px",
                  left:"13px",
                  color:"rgb(1, 189, 76)"
                }}>
                  <i className="fa fa-flag" aria-hidden="true"></i>
                </span>
                :
                ''
              }
            </StyledDiv>
            <StyledLine
              style={{borderBottom: flag>2?"#01bd4c solid 1px":"#cccccc solid 1px"}}
            ></StyledLine>
            <StyledDiv
              style={{background: flag>2?"#01bd4c":"none",color: flag>2?"#ffffff":"#333333",position:"relative"}}
              onClick={flag>2?()=>{this.toCurStep(3)}:()=>{return}}
            >
              <span>3</span>
              {
                curPage === 3?
                <span style={{
                  position:"absolute",
                  top:"-21px",
                  left:"13px",
                  color:"rgb(1, 189, 76)"
                }}>
                  <i className="fa fa-flag" aria-hidden="true"></i>
                </span>
                :
                ''
              }
            </StyledDiv>
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: `${height -20 }px`}}
          >
            {
              curPage && curPage === 1?
              <div style={{paddingTop:"20px"}}>
                {
                  atomList && atomList.length>0?
                  atomList.map(item=>{
                    if(flag === 0){
                      return (
                        <AtomForm
                          key={item.id}
                          id={item.id}
                          data={_.cloneDeep(item)}
                          removeStragidy={(id)=>this.removeStragidy(id)}
                          setAtomField={(info)=>{this.setAtomField(info)}}
                        />
                      )
                    }else{
                      return (
                        <AtomForm_Editless
                          key={item.id}
                          id={item.id}
                          data={_.cloneDeep(item)}
                          removeStragidy={(id)=>this.removeStragidy(id)}
                          setAtomField={(info)=>{this.setAtomField(info)}}
                        />
                      )
                    }
                  })
                  :
                  ''
                }
              </div>
              :
              ''
            }
            {
              curPage && curPage === 2?
              <div style={{paddingTop:"20px"}}>
                <Collapse
                  bordered={false}
                  defaultActiveKey={['0']}
                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                >

                  {
                    step_two && step_two.length>0?
                    step_two.map((item,index)=>{
                      return (
                        <Panel header={item.name} key={index} style={customPanelStyle}>
                          {
                            flag<2?
                            <StepTwo
                              id={index}
                              data={_.cloneDeep(item)}
                              setStepTwo={(info)=>this.setStepTwo(info)}
                            />
                            :
                            <StepTwo_Editless
                              id={index}
                              data={_.cloneDeep(item)}
                              setStepTwo={(info)=>this.setStepTwo(info)}
                            />
                          }

                        </Panel>
                      )
                    })
                    :
                    ''
                  }
                </Collapse>
              </div>
              :
              ''
            }
            {
              curPage && curPage === 3?
              <div style={{paddingTop:"20px"}}>
              <Collapse
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
              >
                {
                  step_three && step_three.length>0?
                  step_three.map((item,index)=>{
                    return (
                      <Panel
                        header={item.name}
                        key={index}
                        style={customPanelStyle}
                        extra={
                          <span>
                            <span onClick={(event)=>{
                              event.stopPropagation()
                              this.sendToDevice(item)
                            }} title='下发设备' style={{color:"rgb(0, 204, 102)",marginRight:"20px"}}>
                              <i className="fa fa-share-square-o" aria-hidden="true"></i>
                            </span>
                            <span onClick={(event)=>{event.stopPropagation()}} title='复制信息' style={{color:"rgb(0, 204, 102)"}}>
                              <CopyToClipboard
                                text={item.msg}
                                onCopy={
                                  ()=>this.setState({copied: true},()=>{
                                      message.success('复制成功！')
                                    })
                                }
                              >
                                <i className="fa fa-file-text-o" aria-hidden="true"></i>
                              </CopyToClipboard>
                            </span>
                          </span>
                        }
                      >
                        <StepThree
                          id={id}
                          data={_.cloneDeep(item)}
                        />
                      </Panel>
                    )
                  })
                  :
                  ''
                }
              </Collapse>
              </div>
              :
              ''
            }
          </Scrollbars>
          <div style={{display:"flex", borderTop:"#cccccc solid 1px"}}>
            <div style={{flex:"0 0 120px"}}>
            {
              curPage === 1 && flag === 0?
              <Button style={{marginTop:"10px",marginLeft:"20px"}} onClick={this.addStragidy}>
                <span><i className="fa fa-plus" aria-hidden="true"></i></span>
                <span style={{marginLeft:"10px"}}>添加</span>
              </Button>
              :
              ''
            }
            </div>
            <div style={{flex:"1 1 auto"}}></div>
            <div style={{flex:"0 0  600px",textAlign:"right"}}>
              <Button  type="primary" style={{margin:"10px 10px 0 0"}} onClick={this.props.onClose}>
                取消
              </Button>
              { curPage >1?
                <Button  type="primary" style={{margin:"10px 10px 0 0"}} onClick={this.toLastStep}>
                  上一步
                </Button>
                :
                ''
              }
              {
                isSave_and_quit ?
                <Button loading={loading} type="primary" style={{margin:"10px 10px 0 0"}} onClick={
                  curPage === 1?
                  ()=>{this.saveOrder(false)}
                  :
                  ()=>{this.saveStepTwo(false)}
                }>
                  保存并退出
                </Button>
                :
                ''
              }

              {
                isSave_or_next?
                <Button loading={loading} type="primary" style={{margin:"10px 10px 0 0"}}
                onClick={
                  flag<curPage?
                  ()=>{this.toNextStep(true)}
                  :
                  ()=>{this.toNextStep(false)}
                }

                >

                  {
                    flag<curPage ?
                    '保存并进行下一步'
                    :
                    '下一步'
                  }
                </Button>
                :
                ''
              }
              {
                curPage === total && flag<3?
                <Button onClick={this.compelete} loading={loading} type="primary" style={{margin:"10px 10px 0 0"}}>
                  完成
                </Button>
                :
                ''
              }

            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(FieldForm)
