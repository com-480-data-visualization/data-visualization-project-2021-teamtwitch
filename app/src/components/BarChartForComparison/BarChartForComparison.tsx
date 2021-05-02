import React from "react";
import * as d3 from "d3";
import { sliderBottom } from "d3-simple-slider";

const styles = require("./barchart.scss");

const BarChartForComparison = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const sliderContainer = React.useRef(null);
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
  const columnLabels = ["View minutes", "Streamed minutes", "Unique channels"];
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
      streamedminutes: [
        { key: "2016 April", value: 200 },
        { key: "2016 May", value: 160 },
        { key: "2016 June", value: 190 },
        { key: "2016 July", value: 300 },
        { key: "2016 August", value: 350 },
        { key: "2016 September", value: 320 },
      ],
      uniquechannels: [
        { key: "2016 April", value: 10 },
        { key: "2016 May", value: 13 },
        { key: "2016 June", value: 14 },
        { key: "2016 July", value: 10 },
        { key: "2016 August", value: 18 },
        { key: "2016 September", value: 19 },
      ],
    },
  };
  const languageSelected = "English";
  const [column, setColumn] = React.useState("viewminutes");

  const [dateSelected, setDateSelected] = React.useState([
    0,
    dateLabels.length - 1,
  ]);
  const dataSelected = dateSelected.map(
    (i) => data[languages[languageSelected]][column][i]
  );

  React.useEffect(() => {
    if (d3Container.current) {
      const x = d3.scaleBand().range([0, width]).padding(0.1);
      x.domain(dataSelected.map((d) => d.key)).padding(0.5);

      const y = d3
        .scaleLinear()
        .domain([0, 1.2 * (d3.max(dataSelected, (d) => d.value) || 0)])
        .range([height, 0]);

      d3.select(d3Container.current).html("");
      const wrapper = d3
        .select(d3Container.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const svg = wrapper
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      const barColor = ["#6b486b", "#a05d56"];
      const bars = svg.selectAll("rect").data(dataSelected);
      bars
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.key) || true)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (_, i) => barColor[i]);
      const barLabels = svg.selectAll(".text").data(dataSelected);
      barLabels
        .enter()
        .append("text")
        .text((d) => d.value)
        .attr("text-anchor", "middle")
        .attr("x", (d) => (x(d.key) || 0) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.value) - 10);

      // Slider
      const labelsWithIdx = dateLabels.map((v, i) => ({ key: i, value: v }));
      const sliderScale = d3.scaleLinear().range([0, dateLabels.length]);
      sliderScale.domain([
        d3.min(labelsWithIdx, (d) => d.key) || 0,
        d3.max(labelsWithIdx, (d) => d.key) || 0,
      ]);

      const sliderRange = sliderBottom(sliderScale)
        // @ts-ignore type definition is not updated
        .width(width)
        .min(0)
        .max(dateLabels.length - 1)
        .step(1)
        .tickFormat((i: number) => dateLabels[i])
        .ticks(dateLabels.length)
        .default(dateSelected)
        .handle(d3.symbol().type(d3.symbolCircle).size(200)())
        .fill("#2196f3")
        .on("onchange", (d: number[]) => setDateSelected(d.slice()));

      d3.select(sliderContainer.current).html("");
      const gRange = d3
        .select(sliderContainer.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", 100)
        .append("g")
        .attr("transform", `translate(${margin.left},30)`);
      gRange.call(sliderRange);
    }
  }, [d3Container.current, sliderContainer.current, dataSelected]);

  return (
    <div>
      <h2>Bar chart for comparison</h2>
      <div>
        <div className={styles.columnSelector}>
          {columnLabels.map((label) => (
            <div key={label}>
              {label.toLowerCase().replace(" ", "") === column ? (
                <input
                  type="radio"
                  id={label}
                  name="column"
                  value={label.toLowerCase().replace(" ", "")}
                  onChange={(curr) =>
                    column !== curr.target.value && setColumn(curr.target.value)
                  }
                  checked
                />
              ) : (
                <input
                  type="radio"
                  id={label}
                  name="column"
                  value={label.toLowerCase().replace(" ", "")}
                  onChange={(curr) =>
                    column !== curr.target.value && setColumn(curr.target.value)
                  }
                />
              )}

              <label htmlFor={label}>{label}</label>
            </div>
          ))}
        </div>
        <div>
          <svg
            className="d3-component"
            width={width}
            height={height + margin.top + margin.bottom}
            ref={d3Container}
          />
          <div>
            <svg
              className="d3-component"
              width={width + margin.left + margin.right}
              height={height + margin.top + margin.bottom}
              ref={sliderContainer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartForComparison;
