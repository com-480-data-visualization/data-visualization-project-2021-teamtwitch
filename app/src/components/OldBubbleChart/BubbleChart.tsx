import React from "react";
import * as d3 from "d3";
import { sliderBottom } from 'd3-simple-slider';

const BubbleChart = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const w = 1000;
  const h = 1000;

  React.useEffect(() => {
    // Think of d3Container.current as the HTML node that d3 will attach to
    if (d3Container.current) {
      /* Begin of d3 implementation */
      const year1 = [{"title": "League of Legends", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "Minecraft", "measure":100, "property":"This is an awesome Game!"},
                    {"title": "Just Chatting", "measure":310, "property":"This is an awesome Game!"},
                    {"title": "Music", "measure":60, "property":"This is an awesome Game!"},
                    {"title": "Chess", "measure":177, "property":"This is an awesome Game!"},
                    {"title": "Counter Strike", "measure":132, "property":"This is an awesome Game!"},
                    {"title": "DOTA", "measure":140, "property":"This is an awesome Game!"},
                    {"title": "Misc", "measure":44, "property":"This is an awesome Game!"},
                    {"title": "League of Legends", "measure":100, "property":"This is an awesome Game!"},
                    {"title": "Minecraft", "measure":40, "property":"This is an awesome Game!"},
                    {"title": "Just Chatting", "measure":200, "property":"This is an awesome Game!"},
                    {"title": "Music", "measure":15, "property":"This is an awesome Game!"},
                    {"title": "Chess", "measure":80, "property":"This is an awesome Game!"},
                    ];

      const year2 = [{"title": "1", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "2", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "3", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "4", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "6", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "5 Strike", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "7", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "8", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "0 of Legends", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "9", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "ß12 Chatting", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "23", "measure":400, "property":"This is an awesome Game!"},
                    {"title": "124", "measure":400, "property":"This is an awesome Game!"},
                    ];
      const data = {"year1": year1, "year2": year2};

      const width = 1000;
      const height = 1000;
      const padding = 50;
      const transitionDurationThick = 300;
      const standardStrokeWidth = 2;
      const selectedStrokeWidth = 4;
      const minMeasureForText = 50;

      const defaultYear = 2017;
      const defaultMonth = 10;
      const defaultDay = 1;
      const defaultDate = new Date(defaultYear, defaultMonth, defaultDay);
      let currentlyDisplayedYear = defaultYear;

      // for generating a random color
      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }


      // takes our flat data, and creates a hierachical structured dataset
      // necessary for the bubble chart
      const makeHierarchy = function (data){
        return d3.hierarchy({children:data})
        .sum(d => d.measure)
      };

      // given the height and the size and a padding, it creates a layout
      // for the bubble chart. the higher the padding, the further away
      // the circles
      const pack = function (size, pack_padding){
        return d3.pack()
        .size(size)
        .padding(30)
      };


      // get the node and attach svg to it, set it up
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

      const makeHierarchicalData = function(data){
        //d3.shuffle(data);
        let hierarchalData = makeHierarchy(data);
        let packLayout = pack([width-padding, height-padding]);
        // then enter the hierachical data into the layout
        return packLayout(hierarchalData);
      }


      const createBubbles = function(data){
      // shuffle the data, then create a hierachical structure and get
      // a layout (shuffle so it different every time)
      const root =  makeHierarchicalData(data);

      // for each bubble, create a group element, at the positoin (x,y),
      // given by the layout
      svg.html("");

      const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

      // create the actual bubbles
      leaf.append("circle")
          .attr("r", d => d.r)
          .attr("fill-opacity", 0.5)
          .attr("stroke", "black")
          .attr("stroke-width", standardStrokeWidth)
          .attr("fill", d => getRandomColor())
          .on("mouseover", function(d){
            d3.select(this)
              .transition()
              .duration(transitionDurationThick)
              .attr('stroke-width', selectedStrokeWidth)
              .attr("r", d => d.r + 70/d.r)
              .attr("fill-opacity", 1.0);
          })
          .on("mouseout", function(d){
            d3.select(this)
              .transition()
              .duration(transitionDurationThick)
              .attr('stroke-width', standardStrokeWidth)
              .attr("r", d => d.r)
              .attr("fill-opacity", 0.5);;
          })
          .append("title")
            .text((d) => {
              let title_str = "Category:".bold() + "\t" + d.data.title;
              let measure_str = "Measure:".bold() + "\t" + d.data.measure;
              let property_str = "Property:".bold() + "\t" + d.data.property;
              return [title_str, measure_str, property_str].join("\n");
            });

      leaf.append("text")
      .style("font-size", "20px")
      .selectAll("tspan")
      .data(d => (d.data.measure >= minMeasureForText)
        ? d.data.title.split(/(?=[A-Z][a-z])|\s+/g)
        : "")
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d)
      };

      const createSlider = function(){

        const totalMonths = 12*6
        var sliderSimple = sliderBottom()
          .min(new Date(2015, 1, 1))
          .max(new Date(2021, 12, 31))
          .step(totalMonths)
          .tickFormat(d3.timeFormat('%M:%Y'))
          .width(500)
          .height(50)
          .ticks(6)
          .default(new Date(2017, 10))
          .on('onchange', val => {
            // change the shown text
            d3.select('p#bubble-slider-text').text(`${val.getUTCMonth() +1}:${val.getUTCFullYear()}`);
            // depending on year (and month) display data
            console.log(val.getUTCFullYear());

            if (val.getUTCFullYear() != currentlyDisplayedYear){
              currentlyDisplayedYear = val.getUTCFullYear();
              if (val.getUTCFullYear() <= 2018){
                var dataIndx = 1;
              } else {
                var dataIndx = 2;
              }
              console.log("data.year" + dataIndx);
              const temp_data = makeHierarchicalData(eval("data.year" + dataIndx)).leaves();
              var group = svg.selectAll("g")
                        .data(temp_data);
              group.exit().remove();//
              group.enter().append("circle")
                        .attr("r",0);//create any new circles needed

              console.log(temp_data);
              const temp = group.transition()
                .duration(500)
                .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
              temp.select("circle")
                  .attr("r", d => return d.r)
                  .select("title")
                    .text((d) => {
                      let title_str = "Category:".bold() + "\t" + d.data.title;
                      let measure_str = "Measure:".bold() + "\t" + d.data.measure;
                      let property_str = "Property:".bold() + "\t" + d.data.property;
                      return [title_str, measure_str, property_str].join("\n");
                    })

              temp.select("text")
                  .attr("x", 0)
                  .attr("y", 0)
                  .text(d => d.data.title);
            }
          });


        var gSimple = d3
          .select('#bubble-slider')
          .append('svg')
          .attr('width', 700)
          .attr('height', 200)
          .append('g')
          .attr('transform', 'translate(50,50)');

        gSimple.call(sliderSimple);
        d3.select('p#bubble-slider-text').text(sliderSimple.value());
      }
      createSlider();
      createBubbles(data.year1);


      /* End of d3 implementation */
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
      <svg className="d3-component" width={w} height={h} ref={d3Container} />
    </div>
  );
};

export default BubbleChart;
