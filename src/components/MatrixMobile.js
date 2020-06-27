import React from "react"
import * as d3 from "d3"
import styled from "styled-components"
import { hogs } from "../data/hogObj.js"
import {
  dOutlineManBody,
  dFilledManBody,
  dOutlineManHead,
  dFilledManHead,
  paleCoral,
} from "./sharedVariables"

export class MatrixMobile extends React.Component {
  state = {
    info: {
      country: "",
      countryCode: "",
      HOGIsMan: true,
      HOGAlwaysMan: true,
      yearsHogWoman: 0,
      daysHogWoman: 0,
      femaleLeaders: [],
    },
    infoClicked: false,
  }
  componentDidMount() {
    d3.select("svg").attr("width", 300).attr("height", 800)

    const scoreObj = function (o) {
      let score = 0
      if (o.HOGIsMan) {
        score -= 1
      }
      if (o.HOGAlwaysMan) {
        score -= 1
      }
      return score
    }

    const sortedData = hogs.sort((a, b) => {
      return scoreObj(a) - scoreObj(b)
    })

    this.drawPeople(sortedData)
    this.drawLegend()
  }

  drawPeople = data => {
    const svg = d3.select("svg")
    const enterSelection = svg
      .selectAll(`.person-group`)
      .data(data)
      .enter()
      .append("g")
      .attr("class", d => `person-group-${d.countryCode}`)
      .on("mouseover", d => {
        d3.select(`.person-group-${d.countryCode}`).style("cursor", "pointer")
        if (!this.state.infoClicked) {
          this.setState({ info: d })
        }
      })
      .on("click", d => {
        d3.selectAll(`.person-${d.countryCode}`).attr("fill", "sienna")

        this.setState(prevState => {
          const defaultColor = d.HOGAlwaysMan
            ? paleCoral
            : d.HOGIsMan
            ? "coral"
            : "lightsteelblue"

          if (this.state.infoClicked) {
            d3.selectAll(`.person-${prevState.info.countryCode}`).attr(
              "fill",
              defaultColor
            )
          }
          return { info: d, infoClicked: true }
        })
      })
      .on("mouseout", d => {
        if (!this.state.infoClicked) {
          this.setState({
            info: {
              country: "",
              countryCode: "",
              HOGIsMan: true,
              HOGAlwaysMan: true,
              yearsHogWoman: 0,
              daysHogWoman: 0,
              femaleLeaders: [],
            },
          })
        }
      })

    const body = enterSelection
      .append("path")
      .attr("d", (d, i) => (d.HOGAlwaysMan ? dFilledManBody : dOutlineManBody))
    const head = enterSelection
      .append("path")
      .attr("d", (d, i) => (d.HOGAlwaysMan ? dFilledManHead : dOutlineManHead))

    this.positionPath(body)
    this.positionPath(head)
  }
  drawLegend = () => {
    const svg = d3.select("svg")
    svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(5,330)")

    this.drawLegendItem(
      0,
      "= Countries where head of government is a man, and has always been a man",
      `translate(0,0) scale(0.035, 0.045)`,
      "filled",
      paleCoral
    )
    this.drawLegendItem(
      1,
      "= Countries where head of government is a man but has once been a woman",
      `translate(-2,30) scale(0.22, 0.25)`,
      "outline",
      "coral"
    )
    this.drawLegendItem(
      2,
      "= Countries where head of government is a woman",
      `translate(-2,60) scale(0.22, 0.25)`,
      "outline",
      "lightsteelblue"
    )
  }

  drawLegendItem = (index, text, transform, type, color) => {
    const legend = d3.select(".legend")
    legend
      .append("path")
      .attr("d", type === "outline" ? dOutlineManHead : dFilledManHead)
      .attr("fill", color)
      .attr("transform", transform)

    legend
      .append("path")
      .attr("d", type === "outline" ? dOutlineManBody : dFilledManBody)
      .attr("fill", color)
      .attr("transform", transform)

    legend
      .append("text")
      .text(text)
      .attr("x", 20)
      .attr("y", 18 + index * 30)
      .attr("font-size", 10)
      .attr("font-family", "Major Mono")
  }

  positionPath = selection => {
    selection
      .attr("class", d => `person person-${d.countryCode}`)
      .attr("fill", d =>
        d.HOGAlwaysMan ? paleCoral : d.HOGIsMan ? "coral" : "lightsteelblue"
      )
      .attr("transform", (d, i) => {
        const dotsPerCol = 10
        const iconWidth = 5
        const iconHeight = 12
        const xoffset = d.HOGAlwaysMan ? 1.5 : 0
        const x = this.getY2Coordinate(i, dotsPerCol, iconWidth) + xoffset
        const yoffset = d.HOGAlwaysMan ? 1 : 0
        const y = this.getX2Coordinate(i, dotsPerCol, iconHeight) + yoffset
        const scale = d.HOGAlwaysMan ? "0.035, 0.045" : "0.22, 0.25"

        return `translate(${x}, ${y}) scale(${scale})`
      })
  }

  getY2Coordinate = (index, dotsPerCol, radius) => {
    const placeInCol = Math.floor(index / dotsPerCol)
    const padding = 5
    return placeInCol * (padding + radius * 2)
  }

  getX2Coordinate = (index, dotsPerCol, radius) => {
    const placeInRow = index % dotsPerCol
    const padding = 5
    return placeInRow * (radius * 2 + padding)
  }
  render() {
    const { info } = this.state

    return (
      <Container id="viz-div">
        <PStyled style={{ paddingLeft: 20 }}>
          Female representation in the highest position of executive power in un
          member states.
        </PStyled>
        <Flex>
          <svg id="leaders-people" />
          <PositionedInfoBox>
            {info.country && (
              <div>
                <CountryName>{info.country}</CountryName>
                {info.femaleLeaders.length > 0 &&
                  info.femaleLeaders.map((l, i) => (
                    <PStyled key={i}>{l.name}</PStyled>
                  ))}
                <PStyled>total time female leader:</PStyled>

                <PStyledSienna>
                  {info.yearsHogWoman} years and {info.daysHogWoman} days
                </PStyledSienna>
              </div>
            )}
          </PositionedInfoBox>
        </Flex>
      </Container>
    )
  }
}

const CountryName = styled.p`
  font-size: 16px;
  margin-top: 0;
  font-family: Major Mono;
  color: grey;
`

const PStyled = styled.p`
  font-size: 10px;
  font-family: Major Mono;
  width: 80%;
`
const PStyledSienna = styled.p`
  font-size: 10px;
  color: sienna;
  font-weight: bold;
  font-family: Major Mono;
`
const Container = styled.div`
  position: relative;
  padding-top: 80px;
`

const PositionedInfoBox = styled.div`
  border: 1px solid rgba(255, 127, 80, 0.4);
  min-height: 190px;
  width: 200px;
  padding: 20px;
  box-sizing: border-box;
  height: fit-content;
`
const Flex = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px;
`
