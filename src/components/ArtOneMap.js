import React from "react";
import * as d3 from "d3";
import { hogs } from "../data/hogObj.js";
import { worldGeoJson } from "./../assets/worldgeojson";
import styled from "styled-components";
export class ArtOneMap extends React.Component {
  svgWidth = 1000;
  svgHeight = 700;
  projection = null;

  componentDidMount() {
    const projection = d3
      .geoMercator()
      .scale(960 / Math.PI / 2) // 960 pixels over 2 π radians
      .translate([480, 300]);
    const path = d3.geoPath(projection);

    const svg = d3
      .select("#map-svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    worldGeoJson.features.forEach((country, countryIndex) => {
      hogs.forEach(hog => {
        if (country.properties.countryCode !== hog.countryCode) {
          return null;
        }
        worldGeoJson.features[countryIndex].properties.info = hog;
      });
    });

    const countryGroups = svg
      .selectAll(".country-groups")
      .data(worldGeoJson.features)
      .enter()
      .append("g")
      .attr("class", "country-groups");
    const tooltipPadding = 10;
    countryGroups
      .append("path")
      .attr("d", path)
      .attr("fill", d => this.getColor(d))
      .attr("stroke", "lightsteelblue")
      .attr("stroke-width", 1)
      .attr("transform", `scale(0.8) translate(60, 220)`)
      .on("mouseover", d => {
        tooltipGroup.style("visibility", "visible");
      })
      .on("mousemove", d => {
        tooltipGroup.attr(
          "transform",
          `translate(${d3.event.offsetX + tooltipPadding},${d3.event.offsetY})`
        );
        if (tooltipCountryText && d.properties.info) {
          tooltipRect
            .attr("width", 200)
            .attr("height", 60)
            .attr("fill", "white");

          tooltipCountryText
            .text(d.properties.info.country)
            .style("fill", "red")
            .style("z-index", "100")
            .style("font-size", "10px")
            .attr("dx", "5")
            .attr("dy", "13");
          tooltipYearsText
            .text(
              `${d.properties.info.yearsHogWoman} years and ${d.properties.info.daysHogWoman} days`
            )
            .style("fill", "red")
            .style("z-index", "100")
            .style("font-size", "10px")
            .attr("dx", "5")
            .attr("dy", "33");
        }
      })
      .on("mouseout", () => tooltipGroup.style("visibility", "hidden"));

    const tooltipGroup = svg.append("g").attr("class", "tooltip");
    const tooltipRect = tooltipGroup.append("rect");
    const tooltipCountryText = tooltipGroup
      .append("text")
      .attr("class", "country-text");
    const tooltipYearsText = tooltipGroup
      .append("text")
      .attr("class", "years-text");
  }

  getColor = d => {
    const { info } = d.properties;
    if (!info) {
      return "grey";
    }
    const years = info.yearsHogWoman;
    if (years === undefined) return "white";
    if (years === 0) {
      return info.daysHogWoman > 0 ? "#ffc7b3" : "#efe5db";
    }
    if (years < 5) return "#ffc7b3";
    if (years < 10) return "#ffa280";
    if (years < 15) return "#ff7c4d";
    if (years >= 15) return "#ff571a";
  };
  render() {
    return (
      <MapWrapper>
        <svg id="map-svg" />
      </MapWrapper>
    );
  }
}

const MapWrapper = styled.div`
  height: 800px;
`;
