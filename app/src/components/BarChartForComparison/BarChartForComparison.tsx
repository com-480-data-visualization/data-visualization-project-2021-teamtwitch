import React from "react";
import * as d3 from "d3";
import { sliderBottom } from "d3-simple-slider";
import { languageMapping, dateLabels, columnLabels } from "./utils";

const styles = require("./barchart.scss");

const data: {
  [key: string]: { [key: string]: { key: string; value: number }[] };
} = {};
Object.values(languageMapping).map((v) => {
  data[v] = {
    viewminutes: dateLabels.map((d) => ({
      key: d,
      value: Math.round(Math.random() * 30 + 30),
    })),
    streamedminutes: dateLabels.map((d) => ({
      key: d,
      value: Math.round(Math.random() * 200 + 60),
    })),
    uniquechannels: dateLabels.map((d) => ({
      key: d,
      value: Math.round(Math.random() * 10 + 10),
    })),
  };
});

const BarChartForComparison = (): JSX.Element => {
  const d3Container = React.useRef(null);
  const sliderContainer = React.useRef(null);
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  const [language, setLanguage] = React.useState("217");
  const [column, setColumn] = React.useState("viewminutes");

  const [dateSelected, setDateSelected] = React.useState([
    0,
    dateLabels.length - 1,
  ]);
  const dataSelected = dateSelected.map((i) => data[language][column][i]);

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
        <LanguageSelector
          languageMapping={languageMapping}
          setLanguage={setLanguage}
          language={language}
        />
        <ColumnSelector
          columnLabels={columnLabels}
          column={column}
          setColumn={setColumn}
        />
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

const LanguageSelector = (props: {
  languageMapping: { [key: string]: string };
  language: string;
  setLanguage: (v: string) => void;
}) => (
  <select
    onChange={(e) =>
      props.language !== e.target.value && props.setLanguage(e.target.value)
    }
  >
    {Object.keys(props.languageMapping).map((k) => (
      <option key={k} value={props.languageMapping[k]}>
        {k}
      </option>
    ))}
  </select>
);

const ColumnSelector = (props: {
  columnLabels: string[];
  column: string;
  setColumn: (c: string) => void;
}) => (
  <div className={styles.columnSelector}>
    {props.columnLabels.map((label) => (
      <div key={label}>
        {label.toLowerCase().replace(" ", "") === props.column ? (
          <input
            type="radio"
            id={label}
            name="column"
            value={label.toLowerCase().replace(" ", "")}
            onChange={(curr) =>
              props.column !== curr.target.value &&
              props.setColumn(curr.target.value)
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
              props.column !== curr.target.value &&
              props.setColumn(curr.target.value)
            }
          />
        )}

        <label htmlFor={label}>{label}</label>
      </div>
    ))}
  </div>
);

export default BarChartForComparison;
