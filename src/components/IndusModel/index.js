/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
//import titlebg from '../../asets/modeltitlebg.png'
const StyleTitle = styled.div({
  height:"30px",
  width:"auto",
  display:"inline-block",
  cursor:"move",
  lineHeight:"30px",
  padding: "0 20px 0 20px",
  borderRadius: "5px 5px 0 0",
  color:"#01bd4c",
  //background: "url(../../asets/modeltitlebg.png) no-repeat"
  //background: `url(${titlebg}) no-repeat`,
  backgroundSize: '100% 100%',
  backgroundPosition:"0 5px",
  marginBottom:"4px"
  //background: "linear-gradient(120deg, rgba(255,255,255,0.2), rgba(0,0,0,0.2))" /* 标准的语法 */
})

const StyleBody = styled.div({
  borderRadius: "0 0 5px 5px",
})
const StyleContainer = styled.div({
  boxShadow: "rgba(221, 221, 221, 0.8) 0px 0px 5px",
  borderRadius:"3px",
  padding:"20px"

})

const PageTitle11 = styled.div({
  background:"rgba(0,0,0,0.2)",
  borderRadius:"5px",
  lineHeight:"40px",
  textAlign:"center",
  fontWeight:"bold",
  color:"#01bd4c"
})
const PageTitle = (props)=>{
  const LeftDiv = styled.div({
    display:"inline-block",
    flex:"0 0  70%",
    height:"30px",
    background:"-webkit-linear-gradient(60deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    background:"-moz-linear-gradient(60deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    background:"linear-gradient(60deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    borderTop:"1px solid #ddd",
    borderImage: "-webkit-linear-gradient(right, rgba(25,33,57,1) -10%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-moz-linear-gradient(right, rgba(25,33,57,1) -10%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "linear-gradient(right, rgba(25,33,57,1) -10%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    transform:"-webkit-skew(30deg)",
    transform:"-moz-skew(30deg)",
    transform:"-ms-skew(30deg)",
    transform:"skew(30deg)",
  })
  const LeftDiv_R = styled.div({
    display:"inline-block",
    flex:"0 0  70%",
    height:"30px",
    background:"-webkit-linear-gradient(-120deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    background:"-moz-linear-gradient(-120deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    background:"linear-gradient(-120deg,rgba(97,128,255,0) 20%, rgba(3,50,241,0.5) 80%)",
    borderTop:"1px solid #ddd",
    borderImage: "-webkit-linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-moz-linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    transform:"-webkit-skew(-30deg)",
    transform:"-moz-skew(-30deg)",
    transform:"-ms-skew(-30deg)",
    transform:"skew(-30deg)",
  })
  const RightDiv = styled.div({
    height:"30px",
    borderLeft:"1px solid #ddd",
    borderBottom:"1px solid #ddd",
    borderImage: "-webkit-linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-moz-linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-ms-linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "linear-gradient(left, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    transform:"-webkit-skew(30deg)",
    transform:"-moz-skew(30deg)",
    transform:"-ms-skew(30deg)",
    transform:"skew(30deg)",
    flex:"1 1 auto"
  })
  const RightDiv_R = styled.div({
    height:"30px",
    borderRight:"1px solid #ddd",
    borderBottom:"1px solid #ddd",
    borderImage: "-webkit-linear-gradient(right, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-moz-linear-gradient(right, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "-ms-linear-gradient(right, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    borderImage: "linear-gradient(right, rgba(175,241,255,0.6) 0%, rgba(0,138,255,0.6) 30%, rgba(0,84,255,0.6) 60%, rgba(18,0,255,0.6) 90%) 5",
    transform:"-webkit-skew(-30deg)",
    transform:"-moz-skew(-30deg)",
    transform:"-ms-skew(-30deg)",
    transform:"skew(-30deg)",
    flex:"1 1 auto"
  })
  const MidDiv_L = styled.div({
    width:"10px",
    height:"26px",
    marginLeft:"10px",
    background:"-webkit-linear-gradient(120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
    background:"-moz-linear-gradient(120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
    background:"linear-gradient(120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
  })
  const MidDiv_R = styled.div({
    width:"10px",
    height:"26px",
    marginRight:"10px",
    background:"-webkit-linear-gradient(-120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
    background:"-moz-linear-gradient(-120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
    background:"linear-gradient(-120deg,rgba(97,128,255,0.8) 0%, rgba(3,50,241,1) 80%)",
  })
  return <div style={{
    borderRadius:"5px",
    lineHeight:"30px",
    height:"30px",
    textAlign:"center",
    fontWeight:"bold",
    display:"flex",
  }}>
    <div style={{flex:"1 1 auto"}}>
      <div style={{display:"flex"}}>
        <LeftDiv style={{display:"relative"}}>
          <div style={{width:"20px",position:"absolute",height:"30px",background:"rgb(25, 33, 57)",left:"-10px"}}></div>
        </LeftDiv>
        <RightDiv>
          <div style={{display:"flex"}}>
            <MidDiv_L></MidDiv_L>
            <MidDiv_L></MidDiv_L>
            <MidDiv_L></MidDiv_L>
            <MidDiv_L style={{flex:"1 1 auto"}}></MidDiv_L>
          </div>
        </RightDiv>
      </div>
    </div>
    <div style={{padding:"0 60px 0 60px",color:""}}>
      <span style={{color:"#01bd4c"}}>{props.children}</span>
    </div>
    <div style={{flex:"1 1 auto"}}>
      <div style={{display:"flex"}}>
        <RightDiv_R style={{
        }}>
          <div style={{display:"flex"}}>
            <MidDiv_R style={{flex:"1 1 auto"}}></MidDiv_R>
            <MidDiv_R></MidDiv_R>
            <MidDiv_R></MidDiv_R>
            <MidDiv_R></MidDiv_R>
          </div>
        </RightDiv_R>
        <LeftDiv_R style={{position:"relative"}}>
          <div style={{width:"20px",position:"absolute",height:"30px",background:"rgb(25, 33, 57)",right:"-10px"}}></div>
        </LeftDiv_R>

      </div>
    </div>
  </div>
}

export { StyleTitle, StyleBody, StyleContainer, PageTitle }
