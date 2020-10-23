import React, { useEffect, useState } from "react"

import { MatrixDesktop } from "../components/MatrixDesktop"
import { ArtOneMap } from "../components/ArtOneMap"
import "../index.css"
import styled from "styled-components"
import { MatrixMobile } from "../components/MatrixMobile"

export default function ArticleOne() {
  const [isDesktop, setIsDesktop] = useState(undefined)

  useEffect(() => {
    const isDesktop = window.innerWidth > 500
    setIsDesktop(isDesktop)
  }, [])

  return (
    <Container>
      <ArticleTitle>Female Political Represtentation Worldwide</ArticleTitle>
      {isDesktop ? <MatrixDesktop /> : <MatrixMobile />}

      <ArtOneMap isDesktop={isDesktop} />
    </Container>
  )
}
const Container = styled.div`
  background: #efe5db;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
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

  @media (max-width: 500px) {
    font-size: 20px;
    padding-left: 20px;
    line-height: 32px;
  }
`
