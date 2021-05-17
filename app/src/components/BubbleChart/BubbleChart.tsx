// @ts-nocheck

import React from "react";
import * as d3 from "d3";
import { sliderBottom, sliderTime } from "d3-simple-slider";
import {
  Pack,
  MakeHierarchy,
  MakeHierarchicalData,
  MakeAggPath,
  MakeDataPath,
  DrawLineChart
} from "./bubbleFunctions";



const styles = require("./bubblechart.scss");

const BubbleChart = (): JSX.Element => {

  const width = 700;
  const height = 500;
  const [currItem, setCurrItem] = React.useState<any>(null);

  React.useEffect(() => {

    // left/top padding
    const padding = 50;

    // font
    const fontSize = 12;
    const fontFamily = "sans-serif";

    // bubbles parameters
    const nrBubbles = 50;
    const bubblePadding = 10;
    const defaultBubbleOpacity = 0.75;
    const selectedBubbleOpacity = 1.0;
    const defaultStrokeWidth = 1;
    const selectedStrokeWidth = 3;
    const selectedBubbleRadiusIncreaseFactor = 10;
    const transitionDurationThick = 250;
    const bubbleDurationAppear = 400;
    const bubbleTextFontSize = "0";

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



    // drop language down menu params
    const measures = [
      "Viewed Minutes",
      "Streamed Minutes",
      "Peak Number of Channels",
      "Unique Channels",
      "Average Number of Channels",
      "Peak Number of Viewers",
      "Average Number of Viewers",
      "Viewer/Channel Ratio",
    ];
    const measureToAttribute = {
      "Viewed Minutes": "viewminutes",
      "Streamed Minutes": "streamedminutes",
      "Peak Number of Channels": "maxchannels",
      "Unique Channels": "uniquechannels",
      "Average Number of Channels": "avgchannels",
      "Peak Number of Viewers": "maxviewers",
      "Average Number of Viewers": "avgviewers",
      "Viewer/Channel Ratio": "avgratio",
    };

    // for keeping track of currently displayed measure
    let currentlyDisplayedMeasure = "viewminutes";

    // drop language down menu params
    const languages = ["All", "English", "French", "German", "Italian"];
    let currentlyDisplayedLanguage = "All";

    // tooltip params
    const tooltipOpacity = 1;

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

    // for saving, which file is currently selected
    var currentlyDisplayedData = MakeDataPath(
      currentlyDisplayedLanguage,
      currentlyDisplayedYear,
      months[currentlyDisplayedMonth].toLowerCase()
    );
    //d3.select(d3Container.current).html("");
    // create div for the tooltip
    var divTT = d3
      .select(`.${styles.bubbleChartWrapper}`)
      .append("div")
      .attr("id", styles.bubbleChartInfo)
      .html("Click on the Bubbles to see some Data :)");

    // get the node and attach svg to it, set it up
    const svg = d3
      .select("#bubbleChart") // select the current container
      .append("svg") // create svg container
      .attr("viewBox", [0, 0, width, height]) // set viewbox
      .attr("height", height)
      .attr("width", width)
      .attr("font-size", fontSize) // define font-size, etc.
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("overflow-y", "scroll");

    // add a defs to it, necessary for filling the circles with images
    var defs = svg.append("defs");

    const CreateBubbles = function (data) {
      // get hierachical data with bubble layout
      const root = MakeHierarchicalData(
        data,
        currentlyDisplayedMeasure,
        width,
        height,
        padding,
        bubblePadding
      );

      // for each element in the data, create a group and translate it to the
      // position given by the packing function (contained in each datapoint)
      const bubbleGroup = svg
        .selectAll("g")
        .html("")
        .data(root)
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

      // add patterns to fill the circles with images
      defs
        .html("") // remove all existing patterns
        .selectAll(".category-pattern")
        .data(root)
        .enter()
        .append("pattern")
        .attr("class", "category-pattern")
        .attr("id", (d) =>
          d.data.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")
        ) // id is equal to the name
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("heigh", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", (d) => d.data.logo);

      // create the actual bubbles
      bubbleGroup
        .append("circle")
        .transition()
        .duration(bubbleDurationAppear)
        .attr("r", (d) => d.r) // radius was calculated by the packing func
        .attr("fill-opacity", defaultBubbleOpacity)
        .attr("stroke", "black")
        .attr("stroke-width", defaultStrokeWidth)
        .attr(
          "fill",
          (d) =>
            `url(#${d.data.name
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("'", "")})`
        );

      // mouseover event for the bubbles
      bubbleGroup.select("circle").on("click", function (event, d) {
        bubbleGroup
          .selectAll("circle")
          .transition()
          .duration(transitionDurationThick)
          .attr("stroke-width", defaultStrokeWidth)
          .attr("r", (d) => d.r)
          .attr("fill-opacity", defaultBubbleOpacity);
        // highlight the selected circle
        d3.select(this)
          .transition()
          .duration(transitionDurationThick)
          .attr("stroke-width", selectedStrokeWidth) // increase stroke width
          .attr("r", (d) => d.r + selectedBubbleRadiusIncreaseFactor)
          .attr("fill-opacity", selectedBubbleOpacity);

        // make it tooltip appear
        divTT.transition().duration(200).style("opacity", tooltipOpacity);

        ``
        // generate content for tooltip
        let p1 = `<b>${d.data.name}</b>`;
        let p2 = "<b>Viewed Minutes:</b>" + "\t" + d.data.viewminutes;
        let p3 = "<b>Streamed Minutes:</b>" + "\t" + d.data.streamedminutes;
        let p4 = "<b>Peak Number of Channels:</b>" + "\t" + d.data.maxchannels;
        let p5 = "<b>Unique Channels:</b>" + "\t" + d.data.uniquechannels;
        let p6 =
          "<b>Average Number of Channels:</b>" + "\t" + d.data.avgchannels;
        let p7 = "<b>Peak Number of Viewers:</b>" + "\t" + d.data.maxviewers;
        let p8 = "<b>Viewer/Channel Ratio\n:</b>" + "\t" + d.data.avgratio;
        let p9 = "<b>Average Number of Viewers:</b>" + "\t" + d.data.avgviewers;
        let img = `<img src="${d.data.logo}" alt="${d.data.name}">`;
        let toolTipText = [img, p1, p2, p3, p4, p5, p6, p7, p8, p9].join(
          "<br/>"
        );
        // fil the tooltip
        divTT.html(`
          <img src="${d.data.logo}" alt="${d.data.name}"><br/>
          <b>${d.data.name}</b><br/>
          <table style="width:100%">
            <tr>
              <td>Viewed Minutes</td>
              <td>${d.data.viewminutes}</td>
            </tr>
            <tr>
              <td>Streamed Minutes</td>
              <td>${d.data.streamedminutes}</td>
            </tr>
            <tr>
              <td>Peak Number of Channels</td>
              <td>${d.data.maxchannels}</td>
            </tr>
            <tr>
              <td>Unique Channels</td>
              <td>${d.data.uniquechannels}</td>
            </tr>
            <tr>
              <td>Average Number of Channels</td>
              <td>${d.data.avgchannels}</td>
            </tr>
            <tr>
              <td>Peak Number of Viewers</td>
              <td>${d.data.maxviewers}</td>
            </tr>
            <tr>
              <td>Viewer/Channel Ratio</td>
              <td>${d.data.avgratio}</td>
            </tr>
            <tr>
              <td>Average Number of Viewers</td>
              <td>${d.data.avgviewers}</td>
            </tr>
        </table></br>
        Development over Time:</br>`
        );
        var aggPath = MakeAggPath(currentlyDisplayedLanguage, currentlyDisplayedMeasure);
        console.log(aggPath);
        d3.csv(currentlyDisplayedData).then(function (d) {
          DrawLineChart(
            divTT,
            200,
            200,
            10,
            40,
            40,
            0,
            "Viewed Minutes",
            100,
            100);
        });
      });
    };

    // for creating the slider
    const CreateSlider = function () {
      // define the slider
      var sliderSimple = sliderBottom()
        .domain([earliestDate, latestDate])
        .step(totalMonths)
        .ticks(sliderTicks)
        .tickValues(Array.from({length:6},(_,k)=>k+2015).map(y => new Date(y, 12, 15)))
        .tickFormat(d3.timeFormat("%Y"))
        .width(sliderWidth)
        .height(sliderHeight)
        .default(defaultDate)
        .on("onchange", function (d) {
          // change the shown text
          d3.select("p#bubble-slider-text").html(
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
              currentlyDisplayedLanguage,
              currentlyDisplayedYear,
              months[currentlyDisplayedMonth].toLowerCase()
            );
            // make a transition with the new data
            BubbleTransition();
          }

          // also, when sliding, empty the tooltip
          divTT.html("Click on a bubble to see some data :)");
        });

      // creating the svg for the slider
      var gSimple = d3
        .select("#bubble-slider")
        .append("svg")
        .attr("width", sliderWidth + sliderPaddingLeft * 2)
        .attr("height", sliderHeight + sliderPaddingTop)
        .append("g")
        .attr(
          "transform",
          `translate(${sliderPaddingLeft},${sliderPaddingTop})`
        );

      // link slider to svg
      gSimple.call(sliderSimple);
      // show default text
      d3.select("p#bubble-slider-text")
        .html(
          `<b>${months[defaultDate.getUTCMonth()]} <br/>
            ${defaultDate.getUTCFullYear()}</b>`
        )
        .style("font-size", sliderTextFontSize);
    };

    // for creating a drop down menu
    const CreateLanguageSelection = function (languageOptions) {
      // create drop down menu
      d3.select("#bubble-select-language")
        .selectAll("myOptions")
        .data(languageOptions)
        .enter()
        .append("option")
        .text((d) => d)
        .attr("value", (d) => d);

      // make it, so that when a new language is selected, then change data
      d3.select("#bubble-select-language").on("change", function (d) {
        // only fires, if value is changed; we do not need to check

        // recover chosen language
        currentlyDisplayedLanguage = d3.select(this).property("value");
        // generate path to select data
        currentlyDisplayedData = MakeDataPath(
          currentlyDisplayedLanguage,
          currentlyDisplayedYear,
          months[currentlyDisplayedMonth].toLowerCase()
        );
        // make a transition with the new data
        BubbleTransition();
      });
    };

    // for creating a drop down menu for the selected measure
    const CreateMeasureSelection = function (measureOptions) {
      // create drop down menu
      d3.select("#bubble-select-measure")
        .selectAll("myOptions")
        .data(measureOptions)
        .enter()
        .append("option")
        .text((d) => d)
        .attr("value", (d) => d);

      // make it, so that when a new measure is selected, then change data
      d3.select("#bubble-select-measure").on("change", function (d) {
        // only fires, if value is changed; we do not need to check

        // recover chosen language
        currentlyDisplayedMeasure =
          measureToAttribute[d3.select(this).property("value")];

        // make a transition with the new data
        BubbleTransition();
      });
    };

    //create language selection
    CreateLanguageSelection(languages);
    //create measure selection
    CreateMeasureSelection(measures);
    //create the slider
    CreateSlider();
    //create initial bubbles
    d3.csv(currentlyDisplayedData).then(function (d) {
      CreateBubbles(d.slice(0, nrBubbles));
    });

    // function for initiating a fluid transition by means of
    // different data / measure
    const BubbleTransition = function () {
      // load the data
      d3.csv(currentlyDisplayedData).then(function (d) {
        let tempData = d.slice(0, nrBubbles);
        //d3.shuffle(tempData); in or out?
        // create a bubble layout with the data
        let newData = MakeHierarchicalData(
          tempData,
          currentlyDisplayedMeasure,
          width,
          height,
          padding,
          bubblePadding
        );

        // change the patterns ids and urls
        defs.selectAll(".category-pattern")
          .data(newData)
            .attr("id", (d) => {
              return d.data.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
            })
          .select("image")
            .attr("xlink:href", (d) => d.data.logo);

        // change data and logo reference in the circles
        svg.selectAll("g")
          .data(newData)
          .transition()
            .duration(500)
            .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
          .select("circle")
            .attr("r", (d) => d.r)
            .attr(
              "fill",
              (d) =>
                `url(#${d.data.name
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replaceAll("'", "")})`
            );
      });
    }

  });

  // Arrange descriptions and other JS logic here
  // d3 element will be mounted on the svg node
  return (
    <div>
      <h1 >Explore the data</h2>
      <div className={styles.padding}>
        <div className={styles.slider} >
          <p id="bubble-slider-text" className={styles.sliderText}></p>
          <p id="bubble-slider"></p>
        </div>
        <div>
          <select id="bubble-select-language"></select>
          <select id="bubble-select-measure"></select>
        </div>
        <p id="bubbleChart" className={styles.bubbleChartWrapper}></p>
      </div>
    </div>
  );
};

export default BubbleChart;
