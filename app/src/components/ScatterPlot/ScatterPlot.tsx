// @ts-nocheck
import React from "react";
import * as d3 from "d3";
import { sliderBottom, sliderLeft } from "d3-simple-slider";

const ScatterPlot = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const w = 1000;
  const h = 700;


  React.useEffect(() => {
    // Think of d3Container.current as the HTML node that d3 will attach to
    if (d3Container.current) {

      // for translating numbers to months
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // instantiate hoverbox
      var div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("width", "80px")
        .style("height", "45px")
        .style("text-align", "center")
        .style("font", "12px sams-serif")
        .style("background", "white")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("padding", "2px");

      // specify time format
      var formatTime = d3.timeFormat("%e %B %Y");

      const numberDatapoints = 100;

      // set the dimensions and margins of the graph
      var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 150},
      width = 1000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

      // slider params
      const earliestDate = new Date(2016, 1, 1);
      const latestDate = new Date(2021, 3, 1);
      const sliderTextFontSize = "1em";
      const sliderWidth = width / 3;
      const sliderHeight = 100;
      const sliderPaddingLeft = 50;
      const sliderPaddingTop = 20;
      const sliderTicks = 6;
      const defaultDate = new Date(2016, 1);
      const totalMonths = 64;
      let currentlyDisplayedYear = defaultDate.getUTCFullYear();
      let currentlyDisplayedMonth = defaultDate.getUTCMonth();

      //
      const MakeDataPath = function (year, month) {
        return `https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/All/All-${year}${month}.csv`;
      };
      // for saving, which file is currently selected
      var currentlyDisplayedData = MakeDataPath(
        currentlyDisplayedYear,
        months[currentlyDisplayedMonth].toLowerCase()
      );

      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      var svg = d3.select(d3Container.current).append("svg")
          .attr("width", width + margin.left + margin.right )
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      var sliderSvg = d3
        .select("#scatter-slider")
        .append("svg")
        .attr("width", 500)
        .attr("height", 100)
        .append("g")
        .attr("transform",
              "translate(" + width/4 + "," + margin.top + ")");
      // add vertical slider element
      var sliderStepSvg = d3
        .select("#scatter-step-slider")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 100)
        .append("g")
        .attr("transform",
              "translate(" + width*3/4 + "," + margin.top + ")");

      //
      let currentN = 5;
      const CreateStepSlider = function() {
        // step slider for n
        var sliderStep = sliderBottom()
          .domain([0,20])
          .step(2)
          .ticks(10)
          .height(sliderHeight)
          .width(sliderWidth)
          .default(0)
          .on('onchange', function (d) {
            d3.select('p#scatter-step-slider').text(d3.format('.2%')(d));
            if (
              d != currentN
            ) {
              // save new month and year
              currentN = d;
              // color corresponding points?
              currentlyDisplayedData = MakeDataPath(
                currentlyDisplayedYear,
                months[currentlyDisplayedMonth].toLowerCase()
              );
              // color top n points
              colorDots(currentlyDisplayedData);
            }
          });
          sliderStepSvg.call(sliderStep);
          d3.select('p#value-step').text(d3.format('.2%')(sliderStep.value()));
      }

      const colorDots = function(newDataPath){
        d3.csv(newDataPath).then(function(newData) {
          const transferDuration = 1000;
          preprocessing(newData);
          newData = newData.slice(0, numberDatapoints);
          // reset the circles before colouring the new ones
          svg.selectAll("circle")
           .data(newData)
           .transition()
           .duration(transferDuration)
           .attr("r", 5)
           .attr("fill", "firebrick")
          // get the top n in unique channels
          var topData = newData.sort(function(a) {
              return d3.descending(+a.avgchannels);
          }).slice(0, currentN);
          console.log(topData);

          svg.selectAll("circle")
           .data(topData)
           .transition()
           .duration(transferDuration)
           .attr("r", 10)
           .attr("fill", "dodgerblue")
           })
      }

      // for creating the slider
      const CreateSlider = function () {
        var sliderSimple = sliderBottom()
          .domain([earliestDate,latestDate])
          .step(totalMonths)
          .ticks(sliderTicks)
          .tickValues(Array.from({length:6},(_,k)=>k+2015).map(y => new Date(y, 12, 15)))
          .tickFormat(d3.timeFormat("%Y"))
          .width(sliderWidth)
          .height(sliderHeight)
          .default(defaultDate)
          .on("onchange", function (d) {
            // change the shown text
            d3.select("p#scatter-slider-text").html(
              `<b>${months[d.getUTCMonth()]} <br/> ${d.getUTCFullYear()}</b>`
            );
            // depending on the selected value, display the corresponding data

            if (
              d.getUTCFullYear() != currentlyDisplayedYear ||
              d.getUTCMonth() != currentlyDisplayedMonth
            ) {
              // save new month and year
              currentlyDisplayedYear = d.getUTCFullYear();
              currentlyDisplayedMonth = d.getUTCMonth();
              // load corresponding data
              currentlyDisplayedData = MakeDataPath(
                currentlyDisplayedYear,
                months[currentlyDisplayedMonth].toLowerCase()
              );

              // make a transition with the new data
              changeDots(currentlyDisplayedData);
            }
            })
          // add slider to the corresponding div
          sliderSvg.call(sliderSimple);
          // show default text
          d3.select("p#scatter-slider-text")
            .html(
              `<b>${months[defaultDate.getUTCMonth()]} <br/>
                ${defaultDate.getUTCFullYear()}</b>`
            )
            .style("font-size", sliderTextFontSize);
        };



      // for drawing the path of the linechart
      const drawDots = function (data, x, y) {
         // add the dots with tooltips
         svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            //.filter(function(d) { return d.date =="2016-01-01" })
            .attr("r", 5)
            .attr("cx", d => x(d.streamedminutes))
            .attr("cy", d => y(d.viewminutes))
            .attr("fill", "firebrick")
            .on("mouseover", function (event, d) {
            div.transition().duration(200).style("opacity", 0.9);
            div
              .html(d.name)
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d) {
            div.transition().duration(500).style("opacity", 0);
          });
      }

      // for correctly setting the axes
      const setAxes = function (x, y){
        // add the x axis
        svg.append("g")
            .attr("id", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // text label for the x-axis
        svg.append("text")
             .attr("transform",
                   "translate(" + (width/2) + " ," +
                                  (height + margin.top + 20) + ")")
             .style("text-anchor", "middle")
             .text("Streamed Minutes");

        // add the y-axis
        svg.append("g")
            .attr("id", "yAxis")
            .call(d3.axisLeft(y));

        // text label for the y-axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Viewed Minutes");
      }

      const preprocessing = function(data){
        // format the data
        data.forEach(function(d) {;
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.viewminutes = +d.viewminutes;
            d.streamedminutes = +d.streamedminutes;
        });
      }

      // set the ranges
      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      const changeDots = function(newDataPath){
        d3.csv(newDataPath).then(function(newData) {
          const transferDuration = 5000;
          preprocessing(newData);
          newData = newData.slice(0, numberDatapoints);
          // set domain
          x.domain([0, d3.max(newData, d => d.streamedminutes)]);
          y.domain([0, d3.max(newData, d => d.viewminutes)]);

          //change axes
          d3.select("#xAxis")
            .transition()
            .duration(transferDuration)
            .call(d3.axisBottom(x));
          d3.select("#yAxis")
            .transition()
            .duration(transferDuration)
            .call(d3.axisLeft(y));

          svg.selectAll("circle")
           .data(newData)
           .transition()
           .duration(transferDuration)
             .attr("r", 5)
             .attr("cx", d => x(d.streamedminutes))
             .attr("cy", d => y(d.viewminutes));
        })
      }
    // instantiate the slider
    CreateSlider();
    CreateStepSlider();
    // instantiate the first plot
    d3.csv(currentlyDisplayedData).then(function(data) {
      data = data.slice(0, numberDatapoints);
      // format date and cast to numbers
      preprocessing(data);
      // set domain
      x.domain([0, d3.max(data, d => d.streamedminutes)]);
      y.domain([0, d3.max(data, d => d.viewminutes)]);
      // draw the scatter chart; supply the x and y axis
      drawDots(data, x, y);
      // add the axes
      setAxes(x, y);


    });
    }
  }, [d3Container.current]);


  // Arrange descriptions and other JS logic here
  // d3 element will be mounted on the svg node
  return (
    <div>
      <h2>ScatterPlot plot</h2>
      <div>
        <p id="scatter-slider-text"></p>
        <div id="scatter-slider"></div>
        <div id="scatter-step-slider"></div>
      </div>
      <svg className="d3-component" width={w} height={h} ref={d3Container} />
    </div>
  );
};

export default ScatterPlot;
