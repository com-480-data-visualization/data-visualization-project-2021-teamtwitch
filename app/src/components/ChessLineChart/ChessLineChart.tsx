// @ts-nocheck
import React from "react";
import * as d3 from "d3";

const ChessLineChart = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const w = 1000;
  const h = 600;

  React.useEffect(() => {
    // Think of d3Container.current as the HTML node that d3 will attach to
    if (d3Container.current) {
      // set days for special events
      // set days for special events
      const lockdowns = new Date("2020-03-09");
      const queens_gambit = new Date("2020-10-23");
      const gm_twitch = new Date("2017-07-04");


      const totalPathAnimationTime = 12000;
      const blinkTimer = 1100;
      const line_duration = totalPathAnimationTime/5;
      const textBoxWidth = 300;
      const textBoxHeight = 200;
      const boxTime = 400;
      // specify time format
      var formatTime = d3.timeFormat("%e %B %Y");

      // attributes of each event
      const event1 = {
        "y":85,
        "x_text":5,
        "width":50,
        "height":50,
        "expanded_width":135,
        "expanded_height":145,
        "stroke":"black",
        "fill":"white",
        "date":gm_twitch,
        "text": `<b>${formatTime(gm_twitch)}</b> <br/> Grandmaster Hikaru Nakamura, 5-times US chess champion, joins Twitch.Tv.`,
        "image_url":"https://pbs.twimg.com/profile_images/1370552383151828995/k0xtMmPB_400x400.jpg",
        "box_image_url":"https://static.thenounproject.com/png/71303-200.png",
        "line_delay":totalPathAnimationTime/8.5,
        "text_delay":totalPathAnimationTime/4.15 // because text delay is for some reason different from the rest, we need extra value for it
      };
      const event2 = {
        "y":85,
        "x_text":5,
        "height":50,
        "width":50,
        "expanded_width":135,
        "expanded_height":145,
        "stroke":"black",
        "fill":"white",
        "date":lockdowns,
        "text":`<b>${formatTime(lockdowns)} </b> <br/> The lockdowns in Europe start.`,
        "image_url":"https://www.gannett-cdn.com/presto/2020/03/15/USAT/e6e30693-9224-4c89-b003-6cc4b4348528-insta-noemoji-heart.png?width=660&height=660&fit=crop&format=pjpg&auto=webp",
        "box_image_url":"https://static.thenounproject.com/png/71309-200.png",
        "line_delay":totalPathAnimationTime/2.35,
        "text_delay":totalPathAnimationTime/1.75
      };

      const event3 = {
        "y":85,
        "x_text":5,
        "height":50,
        "width":50,
        "expanded_width":135,
        "expanded_height":145,
        "stroke":"black",
        "fill":"white",
        "date":queens_gambit,
        "text":`<b>${formatTime(queens_gambit)}</b> <br/> The TV show Queen's Gambit is released on Netflix and was a huge hit.`,
        "image_url":"https://upload.wikimedia.org/wikipedia/en/1/12/The_Queen%27s_Gambit_%28miniseries%29.png",
        "box_image_url":"https://static.thenounproject.com/png/71305-200.png",
        "line_delay":totalPathAnimationTime/1.6,
        "text_delay":totalPathAnimationTime/1.3
      };

      // instantiate hoverbox for dots
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

      // set the dimensions and margins of the graph
      var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 150},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        var svg = d3.select(d3Container.current).append("svg")
            .attr("width", width + margin.left + margin.right )
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");




      // for drawing the path of the linechart
      const drawLineChart = function (data, x, y) {

        // define the lines
        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.viewminutes); });

        // add the valueline path
        var path = svg.append("path")
           .data([data])
           .attr("fill", "none")
           .attr("stroke", "firebrick")
           .attr("class", "line")
           .attr("stroke-width", 2)
           .attr("d", valueline);

        var totalLength = path.node().getTotalLength();


        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
            .duration(totalPathAnimationTime)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

         // add the dots with tooltips
         svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 15)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.viewminutes); })
            .attr("fill", "firebrick")
            .style("opacity", 0)
            .on("mouseover", function (event, d) {
              div.transition().duration(200).style("opacity", 0.9);
              div
                .html(formatTime(d.date) + "<br/>" + d.viewminutes)
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
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // text label for the x-axis
        svg.append("text")
             .attr("transform",
                   "translate(" + (width/2) + " ," +
                                  (height + margin.top + 20) + ")")
             .style("text-anchor", "middle")
             .text("Date");

        // add the y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // text label for the y-axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Viewminutes");
      }

      // Get the data
      d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/chess.csv").then(function(data) {

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // format the data
        data.forEach(function(d) {
            d.channel = d.channel;
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.viewminutes = +d.viewminutes;
        });

        // set domain
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.viewminutes; })]);

        // draw the line chart; supply the x and y axis
        drawLineChart(data, x, y);
        // add the axes
        setAxes(x, y);






        // ====================================================================
        /* HORIZONTAL LINES WITH BOXES */

        // this will be the text box in the middle
        const textBox = svg.append("foreignObject")
          .attr("id", "textbox")
          .attr("x", width/2 - 107)
          .attr("y", height/2 - 140)
          .attr("width", textBoxWidth)
          .attr("height", textBoxHeight)
          .append("xhtml:body")
          .attr("opacity", 1)
          .attr("id", "textBox")
          .style("font", "'Helvetica Neue'")
          .style("font-size", "14px")
          .style("text-align", "center")
          .html("");

        const defs = svg.append("defs");
        // add all necessary patterns for the images
        [event1, event2, event3].forEach(function (event, index){
          defs
            .append("pattern")
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("id", `img${index+1}`)
            .append("image")
            .attr("heigh", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", event.image_url);
          defs
            .append("pattern")
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("id", `box_img${index+1}`)
            .append("image")
            .attr("heigh", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", event.box_image_url);
        });

        // create group and rectangle/text/line for all events
        var group1 = svg.append("g")
          .attr("id", "group1")
          .attr("transform", `translate(${x(event1.date)} ${event1.y})`);

        var group2 = svg.append("g")
          .attr("id", "group2")
          .attr("transform", `translate(${x(event2.date)} ${event2.y})`);

        var group3 = svg.append("g")
          .attr("id", "group3")
          .attr("transform", `translate(${x(event3.date)} ${event3.y})`);

        // function for actually building the rectangles
        const buildRectangle = function(indx, group, event_obj) {
          // create objects
          var rect = group.append("rect")
            .attr("id", `rect${indx}`);
          var text = group.append("foreignObject")
            .attr("id", `text${indx}`);
          var line = group.append("line")
            .attr("id", `line${indx}`);

          // create the vertical line
          line
          .attr("x1", 0)
          .attr("y1", height - margin.top - margin.bottom - 45)
          .attr("x2", 0)
          .attr("y2", height - margin.top - margin.bottom - 45)
          .transition()
            .delay(event_obj["line_delay"])
          .transition()
            .duration(line_duration)
            .attr("x2", 0)
            .attr("y2", 0 + event_obj.height/2)
            .style("stroke-width", 1.5)
            .style("stroke", "black")
            .style("fill", "none");

          // makes the text flicker
          const blink = function () {
              text
                .transition()
                .duration(blinkTimer)
                .attr("opacity", 0)
                .transition()
                .duration(blinkTimer)
                .attr("opacity", 1)
                .on("end", blink);
          }
          // create the text shown in the box
          text
            .attr('x', -event_obj.width/2)
            .attr('y', -3*event_obj.height/2)
            .attr("width", event_obj.width)
            .attr("height", event_obj.height)
            .attr("opacity", 0)
            .append("xhtml:body")
            .style("font", "'Helvetica Neue'")
            .style("font-size", "14px")
            .style("text-align", "center")
            .html("Click <br/> Me!")
            .transition()
              .delay(event_obj["text_delay"])
              .attr("opacity", 1)
              .on("end", blink);


          //blink();

          // fill it with corresponding attributes
          rect
            .attr("id", `rect${indx}`)
            .attr('x', -event_obj.width/2)
            .attr('y', -event_obj.height/2)
            .attr('width', event_obj.width)
            .attr('height', event_obj.height)
            .attr('standard_width', event_obj.width)
            .attr('standard_height', event_obj.height)
            .attr('stroke', event_obj.stroke)
            .attr('fill', `url(#box_img${indx})`)
            .attr('standard_fill', `url(#box_img${indx})`)
            .attr("opacity", 0)
            .attr('select_state', "not_selected")
            .on("click", function (event, d) {

              // unselect any other rectangle, that might be currently
              // selected
              d3.selectAll("rect").each(function(r,i){
                // get the rectange objet
                let other_rect = d3.select(this);
                // check that it is not this one and that it is selected
                if ((other_rect.attr("id") != `rect${indx}`) && (other_rect.attr("select_state") == "selected")){
                  other_rect
                    .transition()
                    .duration(boxTime)
                    .attr('select_state', "not_selected")
                    .attr('x', -other_rect.attr("standard_width")/2)
                    .attr('y', -other_rect.attr("standard_height")/2)
                    .attr("width", other_rect.attr("standard_width"))
                    .attr("height", other_rect.attr("standard_height"))
                    .transition()
                    .duration("1") //so it happens at the end
                    .attr("fill", other_rect.attr("standard_fill"));

                  console.log(`line${indx}`);
                  // make the line also longer again, since img is gone
                  d3.select(`#line${other_rect.attr("id").substring(other_rect.attr("id").length - 1)}`)
                  .transition()
                    .duration(boxTime)
                    .attr("y2", + event_obj.height/2);
                }
              });


              // make the text on top
              text
                .transition()
                .duration(boxTime)
                .attr("opacity", 0);

              // change the text of the textbox in the middle and make it appear
              // TODO POOR IMPLEMENTATION
              textBox
                .html("")
                .attr("id", "textbox")
                .attr("x", width/2 - 107)
                .attr("y", height/2 - 140)
                .attr("width", textBoxWidth)
                .attr("height", textBoxHeight)
                .append("xhtml:body")
                .attr("opacity", 1)
                .attr("id", "textBox")
                .style("font", "'Helvetica Neue'")
                .style("font-size", "14px")
                .style("text-align", "center")
                .html(event_obj.text);

              // retract the horizontal line as much as needed together
              // with the image
              line
              .transition()
                .duration(boxTime)
                .attr("y2", + event_obj.expanded_height/2);


              // expand the box and fill it with the right image
              d3.select(this)
                .attr("select_state", "selected")
                .transition()
                .duration("10")
                .attr("fill", `url(#img${indx})`)
                .transition()
                .duration(boxTime)
                .attr("x", -event_obj.expanded_width/2)
                .attr("y", -event_obj.expanded_height/2)
                .attr("width", event_obj.expanded_width)
                .attr("height", event_obj.expanded_height);
            });

            // delay the rectangle
            rect
              .transition()
                .delay(event_obj["line_delay"] + line_duration)
                .attr("opacity", 1)
                .on("end", blink);
        }

        // actually build all three boxes
        buildRectangle(1, group1, event1);
        buildRectangle(2, group2, event2);
        buildRectangle(3, group3, event3);

      });
    }
  }, [d3Container.current]);


  // Arrange descriptions and other JS logic here
  // d3 element will be mounted on the svg node
  return (
    <div>
      <h2>Chess Timeseries plot</h2>
      <svg className="d3-component" width={w} height={h} ref={d3Container} />
    </div>
  );
};

export default ChessLineChart;
