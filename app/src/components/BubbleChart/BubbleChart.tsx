import React from "react";
import * as d3 from "d3";
import { sliderBottom, sliderTime } from 'd3-simple-slider';
import { GetRandomColor,
        Pack,
        MakeHierarchy,
        MakeHierarchicalData
      } from './bubbleFunctions.js';

import data from "./bubbleTest/2016-may.json";
const data1 = data.slice(0, 100);
const data2 = data.slice(100, 200);
const data3 = data.slice(200, 300);
const data4 = data.slice(300, 400);
const data5 = data.slice(400, 500);
const data6 = data.slice(500, 600);

/* --> kills server
import data from "./bubbleTest/2016-june.json";
const data2 = data.slice(0, 100);
import data from "./bubbleTest/2016-july.json";
const data3 = data.slice(0, 100);
import data from "./bubbleTest/2016-february.json";
const data4 = data.slice(0, 100);
import data from "./bubbleTest/2016-april.json";
const data5 = data.slice(0, 100);
import data from "./bubbleTest/2016-march.json";
const data6 = data.slice(0, 100);
*/

const BubbleChart = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const width = 1000;
  const height = 500;

  React.useEffect(() => {
    if (d3Container.current) {
      /*TODOs
      1. Clip Long Text, that are shown when the circle is hovered over
      2. Add way of selecting the measure
      3. Fix Slider --> Mostly NIce, however 2016 doesnt show. If i change minimum
        to a date in 2015, i can select dec 2015 which i also dont want
          ö---> maybe no ticks? text shows anyways? not as nice as only ticks though...
      4. ToolTip doesnt show bold.
      5. Add image to tooltip.
      6. Make modular (introduce variables)
      7. Way to load json files... doesnt work?! I think because react
        7.2 --> Make it data is loaded dynamically
      8. I think months are missing in ALL
      9. Think about bubble colors
      10. Mouseover radius of bubbles; what should be like?
      */

      // left/top padding
      const padding = 50;

      // font
      const fontSize = 12;
      const fontFamily = "sans-serif";

      // bubbles parameters
      const bubblePadding = 10;
      const defaultBubbleOpacity = 0.4;
      const selectedBubbleOpacity = 0.8;
      const defaultStrokeWidth = 2;
      const selectedStrokeWidth = 4;
      const transitionDurationThick = 300;
      const bubbleDurationAppear = 250;
      const bubbleTextFontSize = "1em";

      // slider params
      const sliderWidth = width;
      const sliderHeight = 100;
      const sliderPaddingLeft = 50;
      const sliderPaddingTop = 20;
      const sliderTicks = 6;
      const defaultDate = new Date(2016, 1)
      const totalMonths = 64
      let currentlyDisplayedYear = defaultDate.getUTCFullYear();

      // for translating numbers to months
      const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November",
                    "December"];


      // get the node and attach svg to it, set it up
      const svg = d3
        .select(d3Container.current) // select the current container
        .append("svg") // create svg container
        .attr("viewBox", [0, 0, width, height]) // set viewbox
        .attr("font-size", fontSize) // define font-size, etc.
        .attr("font-family", fontFamily)
        .attr("text-anchor", "middle");

      const CreateBubbles = function(data){
        // get hierachical data with bubble layout
        const root =  MakeHierarchicalData(data, width, height, padding, bubblePadding);

        // for each element in the data, create a group and translate it to the
        // position given by the packing function (contained in each datapoint)
        const bubbleGroup = svg
        .selectAll("g")
        .html("")
        .data(root)
        .join("g")
          .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        // create the actual bubbles
        bubbleGroup.append("circle")
          .transition()
          .duration(bubbleDurationAppear)
          .attr("r", d => d.r) // radius was calculated by the packing func
          .attr("fill-opacity", defaultBubbleOpacity)
          .attr("stroke", "black")
          .attr("stroke-width", defaultStrokeWidth)
          .attr("fill", d => GetRandomColor()) // TODO maybe constrain to nice colors?;

        // mouseover event for the bubbles
        bubbleGroup.select("circle").on("mouseover", function(d){
            d3.select(this)
              .transition()
              .duration(transitionDurationThick)
              .attr('stroke-width', selectedStrokeWidth) // increase stroke width
              .attr("r", d => d.r + 70/d.r) // TODO better idea?
              .attr("fill-opacity", selectedBubbleOpacity);
          });

        // mouseout event for the bubbles
        bubbleGroup.select("circle").on("mouseout", function(d){
          d3.select(this)
            .transition()
            .duration(transitionDurationThick)
            .attr('stroke-width', defaultStrokeWidth)
            .attr("r", d => d.r)
            .attr("fill-opacity", defaultBubbleOpacity);
        });

        // tooltip menu for bubbles
        bubbleGroup.select("circle").append("title")
          .text((d) => {
            //let p1 = "Category:" + "\t" + d.data.name;
            let p1 = "";
            let p2 = "<b>Viewed Minutes</b>:" + "\t" + d.data.viewminutes;
            let p3 = "Streamed Minutes:"+ "\t" + d.data.streamedminutes;
            let p4 = "Peak Number of Channels:" + "\t" + d.data.maxchannels;
            let p5 = "Unique Channels:" + "\t" + d.data.uniquechannels;
            let p6 = "Average Number of Channels:"+ "\t" + d.data.avgchannels;
            let p7 = "Peak Number of Viewers:"+ "\t" + d.data.maxviewers;
            let p8 = "Average Number of Viewers:"+ "\t" + d.data.avgviewers;
            let p9 = "Viewer/Channel Ratio:"+ "\t" + d.data.avgratio;
            return [p1, p2, p3, p4, p5, p6, p7, p8, p9].join("\n");
            return title_str
          });

        // add text within the bubbles
        bubbleGroup.append("text")
          .style("font-size", bubbleTextFontSize) // set font-size
          .text(d => d.data.name)
            .attr("x", d => 0)
            .attr("y", d => 0)

      };

      // for creating the slider
      const CreateSlider = function(){

        // define the slider
        var sliderSimple = sliderBottom()
          .min(new Date(2015, 12, 15))
          .max(new Date(2021, 3))
          .step(totalMonths)
          .tickFormat(d3.timeFormat('%Y'))
          .width(sliderWidth)
          .height(sliderHeight)
          .ticks(sliderTicks)
          .default(defaultDate)
          .on('onchange', function(d){
            // change the shown text
            d3.select('p#bubble-slider-text')
            .text(`<b>${months[d.getUTCMonth()]} <br/>
              ${d.getUTCFullYear()}</b>`);

            // depending on the selected value, display the corresponding data
            if (d.getUTCFullYear() != currentlyDisplayedYear){
              currentlyDisplayedYear = d.getUTCFullYear();

              CreateBubbles(eval("data" + (7 - (2022 - d.getUTCFullYear())));
            }
            /*
            if (d.getUTCFullYear() != currentlyDisplayedYear){
              currentlyDisplayedYear = d.getUTCFullYear();
              if (d.getUTCFullYear() <= 2018){
                var dataIndx = 1;
              } else {
                var dataIndx = 2;
              }
              CreateBubbles(eval("data" + dataIndx));
            }
            */
        });

        // creating the svg for the slider
        var gSimple = d3
          .select('#bubble-slider')
          .append('svg')
          .attr('width', sliderWidth+sliderPaddingLeft*2)
          .attr('height', sliderHeight+sliderPaddingTop)
          .append('g')
          .attr('transform', `translate(${sliderPaddingLeft},${sliderPaddingTop})`);

        // link slider to svg
        gSimple.call(sliderSimple);
        // show default text
        d3.select('p#bubble-slider-text')
          .text(`<b>${months[defaultDate.getUTCMonth()]} <br/>
            ${defaultDate.getUTCFullYear()}</b>`)
          .style("font-size", bubbleTextFontSize);
      }

      //create the slider
      CreateSlider();
      //create default bubbles
      CreateBubbles(data1);
    }
  }, [d3Container.current]);

  // Arrange descriptions and other JS logic here
  // d3 element will be mounted on the svg node
  return (
    <div>
      <h2>Bubble Chart</h2>
      <div>
        <div><p id="bubble-slider-text"></p></div>
        <div><div id="bubble-slider"></div></div>
      </div>
      <svg className="d3-component" width={width} height={height} ref={d3Container} />
    </div>
  );
};

export default BubbleChart;
