import React from "react"

import { ArtOneMatrix } from "../components/ArtOneMatrix"
import { ArtOneMap } from "../components/ArtOneMap"
import "../index.css"
import styled from "styled-components"

export default class ArticleOne extends React.Component {
  render() {
    return (
      <Container>
        <ArticleTitle>Female Political Represtentation Worldwide</ArticleTitle>
        <ArtOneMatrix />
        <ArtOneMap />
      </Container>
    )
  }
}
const Container = styled.div`
  background: #efe5db;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
`
const ArticleTitle = styled.h1`
  width: 20%;
  margin: 0;
  padding-top: 50px;
  padding-left: 60px;
  font-size: 30px;
  color: #ff5c00;
  text-transform: uppercase;
  line-height: 42px;
  font-family: Major Mono;
`
