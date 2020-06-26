import React from "react"
import * as d3 from "d3"
import styled from "styled-components"
import { hogs } from "../data/hogObj.js"

export class ArtOneMatrix extends React.Component {
  dOutlineManBody =
    "M43,98V65c-0.002-1.28-0.43-2.473-1.198-3.399c-0.386-0.462-0.862-0.859-1.423-1.146    C39.82,60.169,39.172,59.999,38.5,60l-0.062-0.019c-0.055-0.025-0.17-0.116-0.268-0.29C38.072,59.52,37.999,59.277,38,59V28    c0.001-0.274,0.108-0.515,0.295-0.705C38.485,27.108,38.726,27.001,39,27h20c0.274,0.001,0.515,0.108,0.705,0.295    C59.892,27.485,59.999,27.726,60,28v31c0.002,0.37-0.134,0.678-0.271,0.839l-0.167,0.143L59.5,60    c-0.672-0.001-1.32,0.169-1.879,0.455c-0.842,0.431-1.491,1.104-1.935,1.888C55.244,63.129,55.001,64.04,55,65v33h4V65    c-0.002-0.37,0.133-0.678,0.271-0.839l0.167-0.143L59.5,64c0.672,0.001,1.32-0.169,1.879-0.455    c0.842-0.431,1.491-1.104,1.935-1.888C63.756,60.871,63.999,59.96,64,59V28c-0.007-2.764-2.236-4.993-5-5H39    c-2.764,0.007-4.993,2.236-5,5v31c0.002,1.28,0.429,2.473,1.198,3.399c0.385,0.462,0.862,0.859,1.423,1.146    C37.18,63.831,37.828,64.001,38.5,64l0.062,0.019c0.055,0.025,0.17,0.116,0.268,0.29C38.928,64.48,39.001,64.723,39,65v33H43z"
  dFilledManBody =
    "m332.968 141.964c-49.057-17.338-101.324-17.338-150.381 0-12.87 4.563-21.476 16.725-21.476 30.381v149.878c0 17.795 14.428 32.222 32.222 32.222v161.111h128.889v-161.111c17.795 0 32.222-14.428 32.222-32.222v-149.878c.001-13.657-8.605-25.819-21.476-30.381z"
  dOutlineManHead =
    "M56,12h-2c-0.001,1.388-0.557,2.625-1.465,3.535C51.625,16.443,50.387,16.999,49,17    c-1.388-0.001-2.625-0.557-3.535-1.465C44.557,14.625,44.001,13.388,44,12c0.001-1.388,0.557-2.625,1.465-3.535    C46.375,7.557,47.612,7.001,49,7c1.387,0.001,2.625,0.557,3.535,1.465C53.443,9.375,53.999,10.612,54,12H56h2    c-0.001-4.972-4.028-8.999-9-9c-4.972,0.001-8.999,4.028-9,9c0.001,4.972,4.028,8.999,9,9c4.972-0.001,8.999-4.028,9-9H56z"
  dFilledManHead =
    "m291.955 14.156c18.875 18.875 18.875 49.478 0 68.354-18.875 18.875-49.478 18.875-68.354 0-18.875-18.875-18.875-49.478 0-68.354 18.875-18.875 49.478-18.875 68.354 0"
  paleCoral = "rgba(255, 127, 80, 0.8)"

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
    d3.select("svg").attr("width", 1000).attr("height", 600)

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
            ? this.paleCoral
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
      .attr("d", (d, i) =>
        d.HOGAlwaysMan ? this.dFilledManBody : this.dOutlineManBody
      )
    const head = enterSelection
      .append("path")
      .attr("d", (d, i) =>
        d.HOGAlwaysMan ? this.dFilledManHead : this.dOutlineManHead
      )

    this.positionPath(body)
    this.positionPath(head)
  }
  drawLegend = () => {
    const svg = d3.select("svg")
    svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(5,230)")

    this.drawLegendItem(
      0,
      "= Countries where head of government is a man, and has always been a man",
      `translate(0,0) scale(0.035, 0.045)`,
      "filled",
      this.paleCoral
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
      .attr(
        "d",
        type === "outline" ? this.dOutlineManHead : this.dFilledManHead
      )
      .attr("fill", color)
      .attr("transform", transform)

    legend
      .append("path")
      .attr(
        "d",
        type === "outline" ? this.dOutlineManBody : this.dFilledManBody
      )
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
        d.HOGAlwaysMan
          ? this.paleCoral
          : d.HOGIsMan
          ? "coral"
          : "lightsteelblue"
      )
      .attr("transform", (d, i) => {
        const dotsPerCol = 5
        const iconWidth = 5
        const iconHeight = 12
        const xoffset = d.HOGAlwaysMan ? 1.5 : 0
        const x = this.getY2Coordinate(i, dotsPerCol, iconWidth) + xoffset
        const yoffset = d.HOGAlwaysMan ? 1 : 0
        const y = this.getX2Coordinate(i, dotsPerCol, iconHeight) + yoffset
        // const scale = d.HOGAlwaysMan ? "0.035, 0.045" : "0.22, 0.25"
        const scale = d.HOGAlwaysMan ? "0.055, 0.065" : "0.32, 0.35"

        return `translate(${x}, ${y}) scale(${scale})`
      })
  }

  getY2Coordinate = (index, dotsPerCol, radius) => {
    const placeInCol = Math.floor(index / dotsPerCol)
    const padding = 15
    return placeInCol * (padding + radius * 2)
  }

  getX2Coordinate = (index, dotsPerCol, radius) => {
    const placeInRow = index % dotsPerCol
    const padding = 15
    return placeInRow * (radius * 2 + padding)
  }
  render() {
    const { info } = this.state

    return (
      <Container id="viz-div">
        <PositionedSvg id="leaders-people" />
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
      </Container>
    )
  }
}

const CountryName = styled.p`
  font-size: 16px;
  margin-top: 0;
  font-family: Major Mono;
`

const PStyled = styled.p`
  font-size: 10px;
  font-family: Major Mono;
`
const PStyledSienna = styled.p`
  font-size: 10px;
  color: sienna;
  font-weight: bold;
  font-family: Major Mono;
`
const Container = styled.div`
  position: relative;
  padding-top: 140px;
  height: 400px;
`
const PositionedSvg = styled.svg`
  position: absolute;
  left: 100px;
`
const PositionedInfoBox = styled.div`
  position: absolute;
  left: 1140px;
  border: 1px solid rgba(255, 127, 80, 0.4);
  min-height: 190px;
  width: 200px;
  padding: 20px;
  box-sizing: border-box;
`
