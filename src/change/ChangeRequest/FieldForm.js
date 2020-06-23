/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Button, message, Collapse, Icon, Modal, Spin, Empty } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { FaFontAwesomeFlag } from 'react-icons/fa'
import { FaCode } from 'react-icons/fa'
import { AiFillCopy } from 'react-icons/ai'


import { wyAxiosPost } from '../../components/WyAxios'
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
function FieldForm(props){
  const [constantField,setConstantField] = useState({
    order_name:'',
    order_note:'',
    errors:[],
  });
  const [atomList,setAtomList] = useState([
    {
      id:'94242805',
      device:[],
      source_address:[],
      des_address:[],
      port:[],
      behavior:'permit',
      atom_note:'',
      errors:[]
    }
  ]);

  //第二步数据
  const [step_two,setStep_two] = useState([]);
  const [step_three,setStep_three] = useState([]);
  const [step_two_errors,setStep_two_errors] = useState([]);
  const [windowH,setWindowH] = useState(100);
  const [loading,setLoading] = useState(false);
  const [id,setId] = useState("");
  const [curPage,setCurPage] = useState(1);
  const [total,setTotal] = useState(3);
  const [flag,setFlag] = useState(0);
  const [_isMounted,set_isMounted] = useState(true);
  const [copied,setCopied] = useState(false);
  useEffect(()=>{
    const { windowH, id } = props
    if(windowH){
      setWindowH(windowH)
    }
    if(id){
      setId(id);
      setCurPage(1);
    }
    return ()=>{
      setStep_two_errors([])
      set_isMounted(false)
      props.setId("")
      setId("")
    }
  },[])

  useEffect(()=>{
    const { windowH } = props
    setWindowH(windowH)
  },[props.windowH])

  useEffect(()=>{
    const { id } = props
    setId(id)
  },[props.id])
  useEffect(()=>{
    if(id){
      getDataById(id)
    }
  },[id])

  function getDataById(id){
    wyAxiosPost('Order/getOrderById',{id},(result)=>{
      const responseData = result
      const constantField = {
        order_name: responseData.msg.order_name,
        order_note: responseData.msg.order_note,
        errors:[]
      }
      const atomList = _.cloneDeep(responseData.msg.stragidy)
      // if(atomList && atomList.length>0){
      //   atomList.map(item=>{
      //     item.errors = []
      //   })
      // }
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
      if(_isMounted){
          setConstantField(constantField);
          setAtomList(atomList);
          setFlag(flag);
          setCurPage(curPage);
          setStep_two(step_two);
          setStep_three(step_three)
      }
    })
  }
  function addStragidy(){
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
    const newAtomList = _.cloneDeep(atomList)
    newAtomList.push(atom)
    if(_isMounted){
      setAtomList(newAtomList)
    }
  }
  function removeStragidy(id){
    const newAtomList = _.cloneDeep(atomList)
    const cur = newAtomList.filter((o)=>{return o.id !== id})
    if(_isMounted){
      setAtomList(cur)
    }
  }
  //获取名称和备注
  function getConstentField(value){
    // const keyNameArr = Object.keys(value)
    // const keyName = keyNameArr[0]
    // const obj = value[keyName]
    // const curField = _.cloneDeep(constantField)
    // curField[keyName] = obj['value']
    // if(obj.errors){
    //   if(curField.errors.indexOf(keyName) === -1){
    //     curField.errors.push(keyName)
    //   }
    // }else if(!obj.errors){
    //   if(curField.errors && curField.errors.length>0){
    //     const curErrors = curField.errors.filter(o=>{ return o !== keyName})
    //     curField.errors = _.cloneDeep(curErrors)
    //   }
    // }
    if(_isMounted){
        setConstantField(_.cloneDeep(value))
    }
  }
  //获取第二步的数据
  function setAtomField(value){
    // const { id,changedFields } = info
    // const keyNameArr = Object.keys(changedFields)
    // const keyName = keyNameArr[0]
    // const obj = changedFields[keyName]
    // const curField = _.cloneDeep(atomList)
    // for(let item of curField){
    //    if(item.id === id){
    //     item[keyName] = obj['value']
    //     if(obj.errors){
    //       if(item.errors.indexOf(keyName) === -1){
    //         item.errors.push(keyName)
    //       }
    //       break
    //     }else if(!obj.errors){
    //       if(item.errors && item.errors.length>0){
    //         const curErrors = item.errors.filter(o=>{ return o !== keyName})
    //         item.errors = _.cloneDeep(curErrors)
    //       }
    //       break
    //     }
    //   }
    // }
    let curField = _.cloneDeep(atomList);
    const newValue = _.cloneDeep(value);
    const index = _.findIndex(curField,o=>{
      return o.id === newValue.id
    })
    if(index !== -1){
      curField[index] = newValue
    }else{
      curField.push(newValue)
    }
    if(_isMounted){
        setAtomList( _.cloneDeep(curField))
    }
  }

  //获取第三步中的数据
  function setStepTwo(info){
    const curStep_two = _.cloneDeep(step_two)
    const relField = info.data.name
    const id = info.id
    const arrField = relField[0].split("-");
    if(arrField[0] === 'acl_name'){
      curStep_two[id]['cmd']['acl_name'] = info.data.value
    }else{
      curStep_two[id]['cmd'][arrField[1]][arrField[2]]['group'][arrField[4]]['name'] = info.data.value
    }
    setStep_two(curStep_two)

    // const { id,changedFields } = info
    // const keyNameArr = Object.keys(changedFields)
    // const keyName = keyNameArr[0]
    // const obj = changedFields[keyName]
    // const curField = _.cloneDeep(step_two)
    // const errors = obj.errors
    // let step_two_errors = _.cloneDeep(step_two_errors)
    // if(errors){
    //   if(step_two_errors.indexOf(keyName) === -1){
    //     step_two_errors.push(keyName)
    //   }
    // }else{
    //   if(step_two_errors.indexOf(keyName) !== -1){
    //     const curErrors = step_two_errors.filter(o=>{ return o !== keyName})
    //     step_two_errors = _.cloneDeep(curErrors)
    //   }
    // }
    // const name_arr = keyName.split('-')
    // if(name_arr[0] === 'acl_name'){
    //   curField[id]['cmd']['acl_name'] = obj.value
    // }else{
    //   //cmd-add-${index}-group-source-name
    //   curField[id]['cmd'][name_arr[1]][name_arr[2]]['group'][name_arr[4]]['name'] = obj.value
    // }
    // if(_isMounted){
    //     setStep_two_errors(step_two_errors);
    //     setStep_two(_.cloneDeep(curField));
    // }
  }



  function saveOrder(save_and_next){ return new Promise((resolve,reject)=>{
    let isRight = true
    //名称的校验
    if(!constantField.order_name || constantField.order_name === ''  || constantField.errors.length>0){
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
        if(
          !(item.device && item.device.length> 0 &&
          item.source_address && item.source_address.length > 0 &&
          item.des_address &&  item.des_address.length> 0 &&
          item.port && item.port.length > 0 &&
          item.behavior && item.behavior.length>0)
        ){
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
    if(_isMounted){
      setLoading(true)
    }
    if(isRight){
      wyAxiosPost('Order/saveOrder',{all_field},(result)=>{
        const responseData = result
        setLoading(false)
        if(responseData.status === 1){
          props.getDataList()
          if(!save_and_next){
            props.onClose()
            resolve('stop')
            message.success(responseData.msg)
          }else{
            props.setId(responseData.msg.id)
            resolve(responseData.msg)
          }

        }else{
          message.warning(responseData.msg)
          reject()
        }
        if(_isMounted){
          setLoading(false);
        }
      })
    }else{
      if(_isMounted){
        setLoading(false);
      }
      message.warning('填写有误，请正确填写所有必填项！')
      reject()
    }

  })}


  function saveStepTwo(save_and_next){ return new Promise((resolve,reject)=>{
    let all_field = {id,decode_msg: step_two}
    if(save_and_next){
      all_field.flag = flag + 1
    }else{
      all_field.flag = flag
    }
    all_field.save_and_next = save_and_next
    if(_isMounted){
      setLoading(true)
    }
    if(step_two_errors.length === 0){
      wyAxiosPost('Order/saveOrder',{all_field},(result)=>{
        const responseData = result
        setLoading(false)
        if(responseData.status === 1){
          props.getDataList()
          if(!save_and_next){
            props.onClose()
            resolve('stop')
            message.success(responseData.msg)
          }else{
            resolve(responseData.msg)
          }
        }else{
          message.warning(responseData.msg)
          reject()
        }
        if(_isMounted){
          setLoading(false);
        }
      })
    }else{
      if(_isMounted){
        setLoading(false)
      }
      message.warning('填写有误，请正确填写所有必填项！')
      reject()
    }
  })}
  function toNextStep(save_and_next){
    if(save_and_next){
      if(curPage === 1){
        saveOrder(save_and_next).then((data)=>{
          if(_isMounted){
              setStep_two(data.decode_msg);
              props.setId(data.id);
              setCurPage(curPage + 1);
              setFlag(parseInt(data.flag));
          }
        },(error)=>{
          return
        })
      }else if(curPage === 2){
        saveStepTwo(save_and_next).then((data)=>{
          if(_isMounted){
            setStep_three(data.make_cmd);
            props.setId(data.id);
            setCurPage(curPage + 1);
            setFlag(parseInt(data.flag));
          }
        },(error)=>{
          return
        })
      }
    }else{
      setCurPage(curPage + 1)
    }
  }
  function toLastStep(){
    if(curPage>1 && _isMounted){
      setCurPage(curPage - 1);
    }
  }
  function toCurStep(step){
    if(_isMounted){
      setCurPage(step);
    }
  }
  function compelete(){
    wyAxiosPost('Order/saveComplete',{id,flag:3},(result)=>{
      const responseData =  result
      if(responseData.status === 1){
        props.onClose()
        message.success(responseData.msg)
      }else{
        message.warning(responseData.msg)
      }
    })
  }
  function sendToDevice(info){
    const infomodal = new InfoModal(info.name)
    infomodal.getModal()
    wyAxiosPost('Order/lowerEquipment',{info},(result)=>{
      const responseData = result
      if(responseData.status === 1){
        infomodal.updateModal(_.cloneDeep(responseData.msg))
      }else{
        infomodal.destroyModal()
        message.warning(responseData.msg)
      }
    })
  }
    let height = 200
    if(windowH && windowH>340){
      height = windowH - 330
    }
    const isSave = (curPage === 1 || curPage === 2)
    const isSave_and_quit = (curPage>flag && curPage<total)
    const isSave_or_next = (curPage<total)

    return (
      <div style={{display:"flex"}}>
        <div style={{flex:"0 0 200px",padding:"0 20px 0 0"}}>
        {
          flag === 0?
          <ConstantForm
            getConstentField={(value)=>{getConstentField(value)}}
            data={constantField}
          />
          :
          <ConstantForm_Editless
            getConstentField={(value)=>{getConstentField(value)}}
            data={constantField}
          />
        }
        </div>
        <div style={{flex:"1 1 auto",borderLeft:"#cccccc solid 1px",padding:"0 20px 0 20px"}}>
          <div style={{width:"100%",height:"40px",lineHeight:"40px", display:"flex",padding:"0 40px 0 40px",borderBottom:"#cccccc dashed 1px"}}>
            <StyledDiv
              style={{background: flag>0?"#01bd4c":"none",color: flag>0?"#ffffff":"#333333",position:"relative"}}
              onClick={flag>0?()=>{toCurStep(1)}:()=>{return}}
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
                  <FaFontAwesomeFlag />
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
              onClick={flag>1?()=>{toCurStep(2)}:()=>{return}}
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
                  <FaFontAwesomeFlag />
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
              onClick={flag>2?()=>{toCurStep(3)}:()=>{return}}
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
                  <FaFontAwesomeFlag />
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
            style={{height: `${height}px`}}
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
                          removeStragidy={(id)=>removeStragidy(id)}
                          setAtomField={(info)=>{setAtomField(info)}}
                        />
                      )
                    }else{
                      return (
                        <AtomForm_Editless
                          key={item.id}
                          id={item.id}
                          data={_.cloneDeep(item)}

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
                              setStepTwo={(info)=>setStepTwo(info)}
                            />
                            :
                            <StepTwo_Editless
                              id={index}
                              data={_.cloneDeep(item)}
                              setStepTwo={(info)=>setStepTwo(info)}
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
                              sendToDevice(item)
                            }} title='下发设备' style={{color:"rgb(0, 204, 102)",marginRight:"20px"}}>
                              <FaCode />
                            </span>
                            <span onClick={(event)=>{event.stopPropagation()}} title='复制信息' style={{color:"rgb(0, 204, 102)"}}>
                              <CopyToClipboard
                                text={item.msg}
                                onCopy={
                                  ()=>{
                                    setCopied(true);
                                    message.success('复制成功！')
                                  }
                                }
                              >
                                <AiFillCopy />
                              </CopyToClipboard>
                            </span>
                          </span>
                        }
                      >
                      {
                        <StepThree
                          id={id}
                          data={_.cloneDeep(item)}
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
          </Scrollbars>
          <div style={{display:"flex", borderTop:"#cccccc solid 1px"}}>
            <div style={{flex:"0 0 120px"}}>
            {
              curPage === 1 && flag === 0?
              <Button style={{marginTop:"10px",marginLeft:"20px"}} onClick={addStragidy}>
                <span><i className="fa fa-plus" aria-hidden="true"></i></span>
                <span style={{marginLeft:"10px"}}>添加</span>
              </Button>
              :
              ''
            }
            </div>
            <div style={{flex:"1 1 auto"}}></div>
            <div style={{flex:"0 0  600px",textAlign:"right"}}>
              <Button  type="primary" style={{margin:"10px 10px 0 0"}} onClick={props.onClose}>
                取消
              </Button>
              { curPage >1?
                <Button  type="primary" style={{margin:"10px 10px 0 0"}} onClick={toLastStep}>
                  上一步
                </Button>
                :
                ''
              }
              {
                isSave_and_quit ?
                <Button loading={loading} type="primary" style={{margin:"10px 10px 0 0"}} onClick={
                  curPage === 1?
                  ()=>{saveOrder(false)}
                  :
                  ()=>{saveStepTwo(false)}
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
                  ()=>{toNextStep(true)}
                  :
                  ()=>{toNextStep(false)}
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
                <Button onClick={compelete} loading={loading} type="primary" style={{margin:"10px 10px 0 0"}}>
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

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
export default connect(mapStateToProps,null)(FieldForm)
