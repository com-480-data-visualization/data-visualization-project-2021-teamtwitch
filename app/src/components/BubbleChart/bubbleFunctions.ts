// @ts-nocheck
import * as d3 from "d3";

/*
// for generating a random color
export function GetRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
  */

// takes our flat data, and creates a hierachical structured dataset
// necessary for the bubble chart
export const MakeHierarchy = function (data, measure) {
  return d3.hierarchy({ children: data }).sum((d) => d[measure]);
};

// given the height and the size and a padding, it creates a layout
// for the bubble chart. the higher the padding, the further away
// the circles
export const Pack = function (size, pack_padding) {
  return d3.pack().size(size).padding(pack_padding);
};

// given data and other params, transform the data to a hierachical structure
// with all necessary information for bubble chart
export const MakeHierarchicalData = function (
  data,
  measure,
  width,
  height,
  padding,
  pack_padding
) {
  //d3.shuffle(data);
  let hierarchalData = MakeHierarchy(data, measure);
  let packLayout = Pack([width - padding, height - padding], pack_padding);
  // then enter the hierachical data into the layout
  return packLayout(hierarchalData).leaves();
};

// since it is very long, we will use a function for creating the path names
// for files
export const MakeDataPath = function (language, year, month) {
  return `https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/${language}/${language}-${year}${month}.csv`;
};

export const MakeAggPath = function (language, measure) {
  return `https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/aggregated_data/${language}/${language}_${measure}_agg.csv`;
};

// for the linecharts inside the div
export const DrawLineChart = function(
  div,
  width,
  height,
  margin_top,
  margin_bottom,
  margin_left,
  margin_right,
  feature,
  max,
  min){

  // calculate height of actual lintplot
  var line_width = width - margin_left - margin_right;
  var line_height = height - margin_top - margin_bottom;
  // TODO delete
  var n = 21;

  // define scales
  var xScale = d3.scaleLinear()
      .domain([0, n]) // input
      .range([0, line_width]); // output
  var yScale = d3.scaleLinear()
      .domain([0, 1]) // input
      .range([0, line_height]); // output

  // define line generator
  var line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.y); })
      .curve(d3.curveMonotoneX);

  // also add linechart to it
  var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });

  var div_svg = div.append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin_left + "," + margin_top + ")");

  // call x and y axis
  div_svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + line_height + ")")
  .call(d3.axisBottom(xScale));

  div_svg.append("text")
    .attr("transform",
          "translate(" + (line_width/2) + " ," +
                         (line_height + margin_bottom/2 + 10) + ")")
    .style("text-anchor", "middle")
    .text("Date");

  div_svg.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(yScale));

  div_svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_left - 5)
    .attr("x",0 - (line_height / 2) - 10)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(feature);

  // append dots
  div_svg.append("path")
    .datum(dataset)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.y) })
    );
}
