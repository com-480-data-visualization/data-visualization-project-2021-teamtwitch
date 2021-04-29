import React from "react";
import * as d3 from "d3";

const BlockSampleChart = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const w = 500;
  const h = 200;

  React.useEffect(() => {
    if (d3Container.current) {
      const data = [12, 5, 6, 6, 9, 10];
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .style("margin-left", 100);

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (_, i) => i * 70)
        .attr("y", (d) => h - 10 * d)
        .attr("width", 65)
        .attr("height", (d) => d * 10)
        .attr("fill", "green");

      svg
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", (_, i) => i * 70)
        .attr("y", (d) => h - 10 * d - 3);
    }
  }, [d3Container.current]);

  return (
    <div>
      <h2>Sample d3.js chart</h2>
      <svg className="d3-component" width={w} height={h} ref={d3Container} />
    </div>
  );
};

export default BlockSampleChart;
