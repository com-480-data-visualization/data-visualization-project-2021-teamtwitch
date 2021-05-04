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
      /* Begin of d3 implementation */
      var lockdowns = new Date("2020-03-09");
      var queens_gambit = new Date("2020-10-23");
      var gm_twitch = new Date("2017-07-04");

      // set the dimensions and margins of the graph
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 150 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
      // parse the date / time
      //var parseTime = d3.timeParse("%d-%b-%y");
      var formatTime = d3.timeFormat("%e %B %Y");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // define the line
      var valueline = d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.viewminutes);
        });

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
        .style("background", "firebrick")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("padding", "2px");

      var box = d3
        .select("body")
        .append("box")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("width", "200px")
        .style("height", "45px")
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
      var svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Get the data
      d3.csv(
        "https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/master/data/chess.csv"
      ).then(function (data) {
        // format the data
        data.forEach(function (d) {
          d.date = d3.timeParse("%Y-%m-%d")(d.date);
          d.viewminutes = +d.viewminutes;
        });

        // scale the range of the data
        x.domain(
          d3.extent(data, function (d) {
            return d.date;
          })
        );
        y.domain([
          0,
          d3.max(data, function (d) {
            return d.viewminutes;
          }),
        ]);

        // add the valueline path.
        svg
          .append("path")
          .data([data])
          .attr("fill", "none")
          .attr("stroke", "firebrick")
          .attr("class", "line")
          .attr("stroke-width", 2)
          .attr("d", valueline);

        // add the dots with tooltips
        svg
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", 10)
          .attr("cx", function (d) {
            return x(d.date);
          })
          .attr("cy", function (d) {
            return y(d.viewminutes);
          })
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

        // add the X Axis
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // text label for the x axis
        svg
          .append("text")
          .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
          )
          .style("text-anchor", "middle")
          .text("Date");

        // add the Y Axis
        svg.append("g").call(d3.axisLeft(y));
        // text label for the y axis
        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 30 - margin.left)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Viewminutes");

        // Add vertical line for GM joins twitch
        svg
          .append("line")
          .attr("x1", x(gm_twitch)) //<<== change your code here
          .attr("y1", 100)
          .attr("x2", x(gm_twitch)) //<<== and here
          .attr("y2", height - margin.top - margin.bottom + 40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

        // Add vertical line for lockdown starts
        svg
          .append("line")
          .attr("x1", x(lockdowns)) //<<== change your code here
          .attr("y1", 100)
          .attr("x2", x(lockdowns)) //<<== and here
          .attr("y2", height - margin.top - margin.bottom + 40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

        // Add vertical line for Queen's Gambit release
        svg
          .append("line")
          .attr("x1", x(queens_gambit)) //<<== change your code here
          .attr("y1", 100)
          .attr("x2", x(queens_gambit)) //<<== and here
          .attr("y2", height - margin.top - margin.bottom + 40)
          .style("stroke-width", 1.5)
          .style("stroke", "black")
          .style("fill", "none");

        // Add box for GM
        var x_ = 15;
        var x_text = 5;
        var y_ = 70;
        var fill_ = "white";
        svg
          .append("rect")
          .attr("id", "Tooltip")
          .attr("x", x(gm_twitch) - x_)
          .attr("y", y_)
          .attr("width", 30)
          .attr("height", 30)
          .attr("stroke", "black")
          .attr("fill", fill_);

        // Add text for GM
        svg
          .append("text")
          .attr("x", x(gm_twitch) - x_text)
          .attr("y", y_ + 20)
          .attr("stroke", "black")
          .style("font-size", 19)
          .text("1")
          .on("mouseover", function (event, d) {
            box.transition().duration(200).style("opacity", 0.9);
            box
              .html(
                formatTime(gm_twitch) +
                  ":" +
                  "<br/>" +
                  "Grandmaster Hikaru Nakamura" +
                  ", 5-times US chess champion joins Twitch.Tv"
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d) {
            box.transition().duration(500).style("opacity", 0);
          });

        // Add box for lockdowns
        var y_lockdown = 450;
        svg
          .append("rect")
          .attr("x", x(lockdowns) - x_)
          .attr("y", y_)
          .attr("width", 30)
          .attr("height", 30)
          .attr("stroke", "black")
          .attr("fill", fill_);

        // Add text for lockdowns
        svg
          .append("text")
          .attr("x", x(lockdowns) - x_text)
          .attr("y", y_ + 20)
          .attr("stroke", "black")
          .style("font-size", 19)
          .text("2")
          .on("mouseover", function (event, d) {
            box.transition().duration(200).style("opacity", 0.9);
            box
              .html(
                formatTime(lockdowns) +
                  ":" +
                  "<br/>" +
                  "The lockdowns in Europe start."
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d) {
            box.transition().duration(500).style("opacity", 0);
          });

        var y_gambit = 540;
        // Add box for queen's gambit
        svg
          .append("rect")
          .attr("x", x(queens_gambit) - x_)
          .attr("y", y_)
          .attr("width", 30)
          .attr("height", 30)
          .attr("stroke", "black")
          .attr("fill", fill_);

        // Add text for queen's gambit
        svg
          .append("text")
          .attr("x", x(queens_gambit) - x_text)
          .attr("y", y_ + 20)
          .attr("stroke", "black")
          .style("font-size", 19)
          .text("3")
          .on("mouseover", function (event, d) {
            box.transition().duration(200).style("opacity", 0.9);
            box
              .html(
                formatTime(queens_gambit) +
                  ":" +
                  "<br/>" +
                  "The TV show Queen's Gambit is released on Netflix."
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function (d) {
            box.transition().duration(500).style("opacity", 0);
          });
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
