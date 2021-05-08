import React from "react";
import * as d3 from "d3";

const ChessLineChart = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const w = 1000;
  const h = 600;

  React.useEffect(() => {
    // Think of d3Container.current as the HTML node that d3 will attach to
    if (d3Container.current) {
      /* Begin of d3 implementation */
      // Create dates for the events
      const lockdowns = new Date("2020-03-09");
      const queens_gambit = new Date("2020-10-23");
      const gm_twitch = new Date("2017-07-04");
      // Define variables for infoboxes
      var x_ =  15
      var x_text = 30
      var y_ = 70
      var fill_ = "white"
      // Define the rectangles for each event
      const rect1_obj = {
                        "y":85,
                        "x_text":5,
                        "width":90,
                        "height":40,
                        "expanded_width":160,
                        "expanded_height":180;
                        "stroke":"black",
                        "fill":"white",
                        "date":gm_twitch,
                        "text":"",
                        "image_url":"https://pbs.twimg.com/profile_images/1370552383151828995/k0xtMmPB_400x400.jpg"
                        };
      const rect2_obj = {
                        "y":85,
                        "x_text":5,

                        "height":40,
                        "width":90,
                        "expanded_width":140,
                        "expanded_height":180;
                        "stroke":"black",
                        "fill":"white",
                        "date":lockdowns,
                        "text":"",
                        "image_url":"https://www.gannett-cdn.com/presto/2020/03/15/USAT/e6e30693-9224-4c89-b003-6cc4b4348528-insta-noemoji-heart.png?width=660&height=660&fit=crop&format=pjpg&auto=webp"
                        };

      const rect3_obj = {
                        "y":85,
                        "x_text":5,
                        "height":40,
                        "width":90,
                        "expanded_width":160,
                        "expanded_height":180;
                        "stroke":"black",
                        "fill":"white",
                        "date":queens_gambit,
                        "text":"",
                        "image_url":"https://upload.wikimedia.org/wikipedia/en/1/12/The_Queen%27s_Gambit_%28miniseries%29.png"
                        };
      // Get the data
      d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/chess.csv").then(function(data) {

        // format the data
        data.forEach(function(d) {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.viewminutes = +d.viewminutes;
        });



      // set the dimensions and margins of the graph
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 30, bottom: 30, left: 150},
          width = 1000 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;
        // parse the date / time
        //var parseTime = d3.timeParse("%d-%b-%y");
      var formatTime = d3.timeFormat("%e %B %Y");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.viewminutes); });

      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("width", "110px")
          .style("height", "65px")
          .style("text-align", "center")
          .style("font", "16px sams-serif")
          .style("background", "firebrick")
          .style("border", "0px")
          .style("border-radius", "8px")
          .style("pointer-events", "none")
          .style("padding", "2px");

      var box = d3.select("body").append("box")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("width", "200px")
          .style("height", "100px")
          .style("text-align", "center")
          .style("font", "16px sams-serif")
          .style("background", "white")
          .style("border", "0px")
          .style("border-radius", "8px")
          .style("pointer-events", "none")
          .style("padding", "2px");

      var box0 = d3.select("body").append("box")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("width", "50px")
          .style("height", "50px")
          .style("text-align", "center")
          .style("font", "14px sams-serif")
          .style("background", "white")
          .style("border", "0px")
          .style("border-radius", "8px")
          .style("pointer-events", "none")
          .style("padding", "2px");

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(d3Container.current).append("svg")
            .attr("width", width + margin.left + margin.right )
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        const defs = svg.append("defs");

        defs
         .append("pattern")
         .attr("height", "100%")
         .attr("width", "100%")
         .attr("patternContentUnits", "objectBoundingBox")
         .attr("id", "img1")
         .append("image")
         .attr("heigh", 1)
         .attr("width", 1)
         .attr("preserveAspectRatio", "none")
         .attr("xlink:href", rect1_obj.image_url);

         defs
          .append("pattern")
          .attr("height", "100%")
          .attr("width", "100%")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("id", "img2")
          .append("image")
          .attr("heigh", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", rect2_obj.image_url);

          defs
           .append("pattern")
           .attr("height", "100%")
           .attr("width", "100%")
           .attr("patternContentUnits", "objectBoundingBox")
           .attr("id", "img3")
           .append("image")
           .attr("heigh", 1)
           .attr("width", 1)
           .attr("preserveAspectRatio", "none")
           .attr("xlink:href", rect3_obj.image_url);
          // scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.viewminutes; })]);

          // add the valueline path
          svg.append("path")
             .data([data])
             .attr("fill", "none")
             .attr("stroke", "firebrick")
             .attr("class", "line")
             .attr("stroke-width", 2)
             .attr("d", valueline);

          // add the dots with tooltips
          svg.selectAll("dot")
             .data(data)
           .enter().append("circle")
             .attr("r", 15)
             .attr("cx", function(d) { return x(d.date); })
             .attr("cy", function(d) { return y(d.viewminutes); })
             .attr("fill", "firebrick")
             .style("opacity", 0)
             .on("mouseover", function(event,d) {
               div.transition()
                 .duration(200)
                 .style("opacity", .9);
               div.html(formatTime(d.date) + "<br/>" + d.viewminutes)
                 .style("left", (event.pageX) + "px")
                 .style("top", (event.pageY) + "px");
               })
             .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
               });

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

          // Add vertical line for GM joins twitch
          svg.append("line")
          .attr("x1", x(gm_twitch))
          .attr("y1", 100)
          .attr("x2", x(gm_twitch))
          .attr("y2", height - margin.top - margin.bottom + 40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

          // Add vertical line for lockdown starts
          svg.append("line")
          .attr("x1", x(lockdowns))
          .attr("y1", 100)
          .attr("x2", x(lockdowns))
          .attr("y2", height - margin.top - margin.bottom+40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

          // Add vertical line for Queen's Gambit release
          svg.append("line")
          .attr("x1", x(queens_gambit))
          .attr("y1", 100)
          .attr("x2", x(queens_gambit))
          .attr("y2", height - margin.top - margin.bottom + 40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

          // Add box for GM
          var rect_gm = svg.append('rect')
            .attr("id", "rect_gm")
            .attr('x', x(rect1_obj.date)-rect1_obj.width/2)
            .attr('y', rect1_obj.y - rect1_obj.height/2)
            .attr('width', rect1_obj.width)
            .attr('select_state', "not_selected")
            .attr('height', rect1_obj.height)
            .attr('stroke', rect1_obj.stroke)
            .attr('fill', rect1_obj.fill)
            .on("click", function (event, d) {
              if (rect_gm.attr("select_state") === "not_selected"){
                rect_gm
                  .on("mouseover", function(event,d) {
                    box.transition()
                      .duration(200)
                      .style("opacity", .9);
                    box.html(formatTime(gm_twitch)+":" + "<br/>" + "Grandmaster Hikaru Nakamura"+", 5-times US chess champion joins Twitch.Tv")
                      .style("left", (x(rect1_obj.date) + rect1_obj.expanded_width/3) + "px")
                      .style("top", (rect1_obj.y + rect1_obj.expanded_height/1.15) + "px");
                    })
                  .on("mouseout", function(d) {
                    box.transition()
                      .duration(500)
                      .style("opacity", 0);
                    })
                  .transition()
                  .duration("10")
                  .attr("fill", "url(#img1)")
                  .attr("select_state", "selected")
                  .transition()
                  .duration("400")
                  .attr("x", x(rect1_obj.date) - rect1_obj.expanded_width/2)
                  .attr("y", rect1_obj.y - rect1_obj.expanded_height/8)
                  .attr("width", rect1_obj.expanded_width)
                  .attr("height", rect1_obj.expanded_height);
              } else {
                rect_gm
                .on("mouseover", function(event,d) {
                  box.transition()
                    .duration(200)
                    .style("opacity", .9);
                  box.html(formatTime(gm_twitch)+":" + "<br/>" + "Grandmaster Hikaru Nakamura"+", 5-times US chess champion joins Twitch.Tv")
                    .style("left", (x(rect1_obj.date) + rect1_obj.expanded_width/3) + "px")
                    .style("top", (rect1_obj.y + rect1_obj.expanded_height/1.5) + "px");
                  })
                .on("mouseout", function(d) {
                  box.transition()
                    .duration(500)
                    .style("opacity", 0);
                  })
                  .transition()
                  .duration("400")
                  .attr("x", x(rect1_obj.date) - rect1_obj.width/2)
                  .attr("y", rect1_obj.y - rect1_obj.height/2)
                  .attr("width", rect1_obj.width)
                  .attr("height", rect1_obj.height)
                  .attr("select_state", "not_selected")
                  .transition()
                  .duration("10")
                  .attr('stroke', rect1_obj.stroke)
                  .attr('fill', rect1_obj.fill);
              }
            });

          // Add text for GM
          svg.append('text')
            .attr('x', x(gm_twitch)-x_text-10)
            .attr('y', y_+20)
            //.attr('stroke', 'black')
            .text("Click me!")
            .style("opacity", 0.4);

          // Add box for lockdowns
          var y_lockdown = 450;

          var rect_ld = svg.append('rect')
            .attr('x', x(rect2_obj.date)-rect2_obj.width/2)
            .attr('y', rect2_obj.y - rect2_obj.height/2)
            .attr('width', rect2_obj.width)
            .attr('height', rect2_obj.height)
            .attr('stroke', rect2_obj.stroke)
            .attr('fill', rect2_obj.fill)
            .attr('select_state', "not_selected")
            .on("click", function (event, d) {
              if (rect_ld.attr("select_state") === "not_selected"){
                rect_ld
                .on("mouseover", function(event,d) {
                  box.transition()
                    .duration(200)
                    .style("opacity", .9);
                  box.html(formatTime(lockdowns)+":" + "<br/>" + "The lockdowns in Europe start.")
                    .style("left", (x(rect2_obj.date) - rect2_obj.expanded_width/18) + "px")
                    .style("top", (rect2_obj.y + rect2_obj.expanded_height) + "px");
                  })
                .on("mouseout", function(d) {
                  box.transition()
                    .duration(500)
                    .style("opacity", 0);
                  })
                  .transition()
                  .duration("10")
                  .attr("fill", "url(#img2)")
                  .attr("select_state", "selected")
                  .transition()
                  .duration("400")
                  .attr("x", x(rect2_obj.date) - rect2_obj.expanded_width/1.1)
                  .attr("y", rect2_obj.y - rect2_obj.expanded_height/8)
                  .attr("width", rect2_obj.expanded_width)
                  .attr("height", rect2_obj.expanded_height);
              } else {
                rect_ld
                .on("mouseover", function(event,d) {
                  box.transition()
                    .duration(200)
                    .style("opacity", .9);
                  box.html(formatTime(lockdowns)+":" + "<br/>" + "The lockdowns in Europe start.")
                    .style("left", (x(rect2_obj.date) + rect2_obj.expanded_width/3) + "px")
                    .style("top", (rect2_obj.y + rect2_obj.expanded_height/1.5) + "px");
                  })
                .on("mouseout", function(d) {
                  box.transition()
                    .duration(500)
                    .style("opacity", 0);
                  })
                  .transition()
                  .duration("400")
                  .attr("x", x(rect2_obj.date) - rect2_obj.width/2)
                  .attr("y", rect2_obj.y - rect2_obj.height/2)
                  .attr("width", rect2_obj.width)
                  .attr("height", rect2_obj.height)
                  .attr("select_state", "not_selected")
                  .transition()
                  .duration("10")
                  .attr('stroke', rect2_obj.stroke)
                  .attr('fill', rect2_obj.fill);
              }
            });

          // Add text for lockdowns
          svg.append('text')
            .attr('x', x(lockdowns)-x_text-10)
            .attr('y', y_+ 20)
            .text("Click me!")
            .style("opacity", 0.4);

          var y_gambit = 540;
          // Add box for queen's gambit
          var rect_qg = svg.append('rect')
            .attr("id", "rect_qg")
            .attr('x', x(rect3_obj.date)-rect3_obj.width/2)
            .attr('y', rect3_obj.y - rect3_obj.height/2)
            .attr('width', rect3_obj.width)
            .attr('height', rect3_obj.height)
            .attr('stroke', rect3_obj.stroke)
            .attr('fill', rect3_obj.fill)
            .attr('select_state', "not_selected")
            .on("click", function (event, d) {
              if (rect_qg.attr("select_state") === "not_selected"){
                rect_qg
                .on("mouseover", function(event,d) {
                  box.transition()
                    .duration(200)
                    .style("opacity", .9);
                    box.html(formatTime(queens_gambit)+":" + "<br/>" + "The TV show Queen's Gambit is released on Netflix.")
                    .style("left", (x(rect3_obj.date) + rect3_obj.expanded_width/2.5) + "px")
                    .style("top", (rect3_obj.y + rect3_obj.expanded_height/1.1) + "px");
                  })
                .on("mouseout", function(d) {
                  box.transition()
                    .duration(500)
                    .style("opacity", 0);
                  })
                  .transition()
                  .duration("10")
                  .attr("fill", "url(#img3)")
                  .attr("select_state", "selected")
                  .transition()
                  .duration("400")
                  .attr("x", x(rect3_obj.date) - rect3_obj.expanded_width/2)
                  .attr("y", rect3_obj.y - rect3_obj.expanded_height/8)
                  .attr("width", rect3_obj.expanded_width)
                  .attr("height", rect3_obj.expanded_height);
              } else {

                rect_qg
                .on("mouseover", function(event,d) {
                  box.transition()
                    .duration(200)
                    .style("opacity", .9);
                    box.html(formatTime(queens_gambit)+":" + "<br/>" + "The TV show Queen's Gambit is released on Netflix.")
                    .style("left", (x(rect3_obj.date) + rect3_obj.expanded_width/3) + "px")
                    .style("top", (rect3_obj.y + rect3_obj.expanded_height/1.5) + "px");
                  })
                  .on("mouseout", function(d) {
                    box.transition()
                      .duration(500)
                      .style("opacity", 0);
                    })
                  .transition()
                  .duration("400")
                  .attr("x", x(rect3_obj.date) - rect3_obj.width/2)
                  .attr("y", rect3_obj.y - rect2_obj.height/2)
                  .attr("width", rect3_obj.width)
                  .attr("height", rect3_obj.height)
                  .attr("select_state", "not_selected")
                  .transition()
                  .duration("10")
                  .attr('stroke', rect3_obj.stroke)
                  .attr('fill', rect3_obj.fill);
              }
            });

          // Add text for queen's gambit
          svg.append('text')
            .attr('x', x(queens_gambit)-x_text-10)
            .attr('y', y_+ 20)
            .style("font-size", 16)
            .style("opacity", 0.4)
            .text("Click me!");
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
