import React from "react";
import * as d3 from "d3";

const BarChartForComparison = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  const languages: { [key: string]: string } = { English: "217" };
  const dateLabels = [
    "2016 April",
    "2016 May",
    "2016 June",
    "2016 July",
    "2016 August",
    "2016 September",
  ];
  const columnLabels: { [key: string]: string } = {
    "View minutes": "viewminutes",
  };
  const data: {
    [key: string]: { [key: string]: { key: string; value: number }[] };
  } = {
    "217": {
      viewminutes: [
        { key: "2016 April", value: 30 },
        { key: "2016 May", value: 45 },
        { key: "2016 June", value: 60 },
        { key: "2016 July", value: 50 },
        { key: "2016 August", value: 20 },
        { key: "2016 September", value: 70 },
      ],
    },
  };
  const languageSelected = "English";
  const column = "View minutes";

  const dateSelected = ["2016 April", "2016 August"];
  const dataSelected = dateSelected
    .map((i) => dateLabels.indexOf(i))
    .map((i) => data[languages[languageSelected]][columnLabels[column]][i]);

  React.useEffect(() => {
    // Think of d3Container.current as the HTML node that d3 will attach to
    if (d3Container.current) {
      /* Begin of d3 implementation */
      const x = d3.scaleBand().range([0, width]).padding(0.1);
      x.domain(dataSelected.map((d) => d.key)).padding(0.5);

      const y = d3
        .scaleLinear()
        .domain([0, 1.2 * (d3.max(dataSelected, (d) => d.value) || 0)])
        .range([height, 0]);

      // Attach d3 to the node
      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      const barColor = ["#6b486b", "#a05d56"];
      svg
        .selectAll("rect")
        .data(dataSelected)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.key) || true)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (_, i) => barColor[i]);
      svg
        .selectAll(".text")
        .data(dataSelected)
        .enter()
        .append("text")
        .text((d) => d.value)
        .attr("text-anchor", "middle")
        .attr("x", (d) => (x(d.key) || 0) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.value) - 10);

      /* End of d3 implementation */
    }
  }, [d3Container.current, dataSelected]);

  // Arrange descriptions and other JS logic here
  // d3 element will be mounted on the svg node
  return (
    <div>
      <h2>Bar chart for comparison</h2>
      <svg
        className="d3-component"
        width={width}
        height={height + margin.top + margin.bottom}
        ref={d3Container}
      />
    </div>
  );
};

export default BarChartForComparison;
