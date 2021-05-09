import React from "react";
import * as d3 from "d3";
import { sliderBottom } from "d3-simple-slider";
import { languageMapping, dateLabels, columnLabels, getDate } from "./utils";

const styles = require("./barchart.scss");

interface RawDataRow {
  year: string;
  month: string;
  language: string;
}

interface GenericDataType {
  [key: string]: number;
}

interface DataEntry {
  date: Date;
  value: number;
}

const loadData = async (): Promise<{
  [key: string]: { [key: string]: DataEntry[] };
}> => {
  return fetch(
    "https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/662d2972130af64b87bc9c6325bfd86390e15498/data/agg.json"
  )
    .then((data) => data.json())
    .then((body: (RawDataRow & GenericDataType)[]) => {
      const data: {
        [key: string]: { [key: string]: DataEntry[] };
      } = {};
      const colKeys = columnLabels.map((s) => s.toLowerCase().replace(" ", ""));
      for (const code of Object.values(languageMapping)) {
        data[code] = {};
        for (const col of colKeys) {
          data[code][col] = [];
        }
      }
      for (const row of body) {
        for (const col of colKeys) {
          data[row.language][col].push({
            date: getDate(row.year, row.month),
            value: row[col],
          });
        }
      }
      return data;
    });
};
interface State {
  data: {
    [key: string]: { [key: string]: DataEntry[] };
  };
  language: string;
  column: string;
  dateSelected: number[];
}

class BarChartForComparison extends React.Component<null, State> {
  d3Container: React.MutableRefObject<null>;
  d3Container2: React.MutableRefObject<null>;
  sliderContainer: React.MutableRefObject<null>;
  constructor(props: null) {
    super(props);
    this.d3Container = React.createRef();
    this.d3Container2 = React.createRef();
    this.sliderContainer = React.createRef();
    this.state = {
      data: {},
      language: "000",
      column: "viewminutes",
      dateSelected: [0, dateLabels.length - 1],
    };
  }

  componentDidMount(): void {
    loadData().then((d) => this.setState({ data: d }));
  }

  render(): JSX.Element {
    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    if (this.d3Container.current) {
      const dataSelected = this.state.data[this.state.language][
        this.state.column
      ];
      const xExtent = d3.extent(dataSelected, (d) => d.date) as [Date, Date];
      const x = d3
        .scaleTime()
        .range([margin, width + margin])
        .domain(xExtent);

      const y = d3
        .scaleLinear()
        .domain([0, 1.1 * (d3.max(dataSelected, (d) => d.value) || 0)])
        .range([height, 0]);

      d3.select(this.d3Container.current).html("");
      const wrapper = d3
        .select(this.d3Container.current)
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

      const svg = wrapper
        .append("g")
        .attr("transform", `translate(${margin},${margin})`);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
      svg.append("g").call(d3.axisLeft(y));

      // Bars
      const barColor = ["#6b486b", "#a05d56"];
      const bars = svg.selectAll("rect").data(dataSelected);
      bars
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.date))
        .attr("y", (d) => y(d.value))
        .attr("width", 10)
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (_, i) => barColor[i]);
      /*
      const barLabels = svg.selectAll(".text").data(dataSelected);
      barLabels
        .enter()
        .append("text")
        .text((d) => d.value)
        .attr("text-anchor", "middle")
        .attr("x", (d) => (x(d.key) || 0) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.value) - 10);
      */

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
        .default(this.state.dateSelected)
        .handle(d3.symbol().type(d3.symbolCircle).size(200)())
        .fill("#2196f3")
        .on("onchange", (d: number[]) =>
          this.setState({ dateSelected: d.slice() })
        );

      d3.select(this.sliderContainer.current).html("");
      const gRange = d3
        .select(this.sliderContainer.current)
        .attr("width", width + margin * 2)
        .attr("height", 100)
        .append("g")
        .attr("transform", `translate(${margin},30)`);
      gRange.call(sliderRange);

      /* test */
      d3.select(this.d3Container2.current).html("");
      const area = d3
        .area()
        .x((d) => {
          const row = (d as unknown) as DataEntry;
          return x(row.date);
        })
        .y1((d) => {
          const row = (d as unknown) as DataEntry;
          return y(row.date);
        })
        .y0(y(0));
      const wrapper2 = d3
        .select(this.d3Container2.current)
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

      const svg2 = wrapper2
        .append("g")
        .attr("transform", `translate(${0},${margin})`);

      const xAxis = d3.axisBottom(x);
      const xAxisTranslate = height;

      svg2
        .append("g")
        .attr("transform", `translate(0, ${xAxisTranslate})`)
        .call(xAxis);

      const yAxis = d3.axisLeft(y).tickFormat(d3.format("~s"));

      svg2.append("g").attr("transform", `translate(${margin}, 0)`).call(yAxis);

      svg2
        .append("path")
        // @ts-ignore weird type hints
        .attr("d", area(dataSelected))
        .attr("stroke", "#147F90")
        .attr("stroke-width", "2px")
        .attr("fill", "#A6E8F2");

      // Interactivity

      svg2.append("line").classed("hoverLine", true);
      svg2.append("circle").classed("hoverPoint", true);
      svg2.append("text").classed("hoverText", true);

      svg2
        .append("rect")
        .attr("fill", "transparent")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

      const mouseMove = (event: MouseEvent) => {
        event.preventDefault();
        const xCoord = event.pageX;

        const mouseDate = x.invert(xCoord);
        const mouseDateSnap = d3.timeMonth.floor(mouseDate);
        const displayX = Math.min(x(mouseDateSnap), width + margin);
        if (displayX < margin - width / dateLabels.length) {
          return;
        }

        const bisectDate = d3.bisector((d: DataEntry) => d.date).right;
        const xIndex = bisectDate(dataSelected, mouseDateSnap, 0);
        const mousePopulation = dataSelected[xIndex].value;

        svg2
          .selectAll(".hoverLine")
          .attr("x1", displayX)
          .attr("y1", 0)
          .attr("x2", displayX)
          .attr("y2", height)
          .attr("stroke", "#147F90")
          .attr("fill", "#A6E8F2");

        svg2
          .selectAll(".hoverPoint")
          .attr("cx", displayX)
          .attr("cy", y(mousePopulation))
          .attr("r", "7")
          .attr("fill", "#147F90");

        const isLessThanHalf = xIndex > dataSelected.length / 2;
        const hoverTextX = isLessThanHalf ? "-0.75em" : "0.75em";
        const hoverTextAnchor = isLessThanHalf ? "end" : "start";

        svg2
          .selectAll(".hoverText")
          .attr("x", displayX)
          .attr("y", y(mousePopulation))
          .attr("dx", hoverTextX)
          .attr("dy", "-1.25em")
          .style("text-anchor", hoverTextAnchor)
          .text(d3.format(".5s")(mousePopulation));
      };

      svg2.on("mousemove", mouseMove);
    }

    return (
      <div>
        <h2>Bar chart for comparison</h2>
        <div>
          <LanguageSelector
            languageMapping={languageMapping}
            setLanguage={(d) => this.setState({ language: d })}
            language={this.state.language}
          />
          <ColumnSelector
            columnLabels={columnLabels}
            column={this.state.column}
            setColumn={(c) => this.setState({ column: c })}
          />
          <div>
            <svg
              className="d3-component"
              width={width}
              height={height + margin * 2}
              ref={this.d3Container}
            />
            <div>
              <svg
                className="d3-component"
                width={width + margin * 2}
                height={height + margin * 2}
                ref={this.sliderContainer}
              />
            </div>
          </div>
        </div>
        <svg
          className="d3-component"
          width={width}
          height={height + margin * 2}
          ref={this.d3Container2}
        />
      </div>
    );
  }
}

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
