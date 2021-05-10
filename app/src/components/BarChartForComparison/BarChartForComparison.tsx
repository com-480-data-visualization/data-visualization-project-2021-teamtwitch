import React from "react";
import * as d3 from "d3";
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

class BarChartForComparison extends React.Component<{}, State> {
  d3Container: React.MutableRefObject<null>;
  constructor(props: {}) {
    super(props);
    this.d3Container = React.createRef();
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
      const area = d3
        .area()
        // @ts-ignore weird type hints
        .x((d) => x(d.date))
        // @ts-ignore weird type hints
        .y1((d) => y(d.value))
        .y0(y(0));
      const wrapper = d3
        .select(this.d3Container.current)
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

      const svg = wrapper
        .append("g")
        .attr("transform", `translate(${0},${margin})`);

      const xAxis = d3.axisBottom(x);
      const xAxisTranslate = height;

      svg
        .append("g")
        .attr("transform", `translate(0, ${xAxisTranslate})`)
        .call(xAxis);

      const yAxis = d3.axisLeft(y).tickFormat(d3.format("~s"));

      svg.append("g").attr("transform", `translate(${margin}, 0)`).call(yAxis);

      const strokeWidth = 1.5;
      svg
        .append("path")
        .datum(dataSelected)
        .style("fill", "url(#svgGradient)")
        .attr("stroke", "url(#svgGradient)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", strokeWidth)
        // @ts-ignore weird type hints
        .attr("d", area);
      /*
        .append("path")
        // @ts-ignore weird type hints
        .attr("d", area(dataSelected))
        .attr("stroke", "#147F90")
        .attr("stroke-width", "2px")
        .attr("fill", "#A6E8F2")
        */

      // Interactivity
      svg.append("circle").classed("hoverPoint", true);
      svg.append("text").classed("hoverText", true);

      const entry1 = dataSelected[this.state.dateSelected[0]];
      const entry2 = dataSelected[this.state.dateSelected[1]];
      const y1 = d3.select(".year1");
      y1.select(`.${styles.date}`).text(
        `${entry1.date.toLocaleString("default", {
          year: "numeric",
          month: "short",
        })}`
      );
      y1.select(`.${styles.value}`).text(`${d3.format(".5s")(entry1.value)}`);
      this.updateDiffText(entry1, entry2);
      const y2 = d3.select(".year2");
      y2.select(`.${styles.date}`).text(
        `${entry2.date.toLocaleString("default", {
          year: "numeric",
          month: "short",
        })}`
      );
      y2.select(`.${styles.value}`).text(`${d3.format(".5s")(entry2.value)}`);

      svg
        .append("rect")
        .attr("fill", "transparent")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2);

      // Left line
      this.createVerticleLine(svg, x, width, height, margin, dataSelected);

      // Right line
      this.createVerticleLine(
        svg,
        x,
        width,
        height,
        margin,
        dataSelected,
        true
      );

      const defs = svg.append("defs");
      const gradient = defs.append("linearGradient").attr("id", "svgGradient");

      const leftLabel = dateLabels[this.state.dateSelected[0]].split(" ");
      const leftDate = d3.timeMonth.floor(
        getDate(leftLabel[0], leftLabel[1].toLowerCase())
      );
      const displayX1Line = Math.min(x(leftDate), width + margin);
      const x1Percentage = `${((displayX1Line - margin) / width) * 100}%`;

      const rightLabel = dateLabels[this.state.dateSelected[1]].split(" ");
      const rightDate = d3.timeMonth.floor(
        getDate(rightLabel[0], rightLabel[1].toLowerCase())
      );
      const displayX2Line = Math.min(x(rightDate), width + margin);
      const x2Percentage = `${((displayX2Line - margin) / width) * 100}%`;
      gradient
        .append("stop")
        .attr("class", "start")
        .attr("offset", x1Percentage)
        .attr("stop-color", "lightblue")
        .attr("stop-opacity", 0.3);
      gradient
        .append("stop")
        .attr("class", "start")
        .attr("offset", x1Percentage)
        .attr("stop-color", "lightblue");
      gradient
        .append("stop")
        .attr("class", "end")
        .attr("offset", x2Percentage)
        .attr("stop-color", "lightblue")
        .attr("stop-opacity", 1);
      gradient
        .append("stop")
        .attr("class", "end")
        .attr("offset", x2Percentage)
        .attr("stop-color", "lightblue")
        .attr("stop-opacity", 0.3);

      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        const xCoord = event.pageX;

        const mouseDate = x.invert(xCoord);
        const mouseDateSnap = d3.timeMonth.floor(mouseDate);
        const displayX = Math.min(x(mouseDateSnap), width + margin);
        if (displayX < margin - width / dateLabels.length) {
          return;
        }

        const bisectDate = d3.bisector(
          (d: { date: Date; value: number }) => d.date
        ).right;
        const xIndex = Math.min(
          bisectDate(dataSelected, mouseDateSnap, 0),
          dataSelected.length - 1
        );
        const mousePopulation = dataSelected[xIndex].value;

        // Point indicator
        svg
          .selectAll(".hoverPoint")
          .attr("cx", displayX)
          .attr("cy", y(mousePopulation))
          .attr("r", "7")
          .attr("fill", "#147F90");

        // Tooltip
        const isLessThanHalf = xIndex > dataSelected.length / 2;
        const hoverTextX = isLessThanHalf ? "-0.75em" : "0.75em";
        const hoverTextAnchor = isLessThanHalf ? "end" : "start";

        svg
          .selectAll(".hoverText")
          .attr("x", displayX)
          .attr("y", y(mousePopulation))
          .attr("dx", hoverTextX)
          .attr("dy", "-1.25em")
          .style("text-anchor", hoverTextAnchor)
          .text(d3.format(".5s")(mousePopulation));
      };

      svg.on("mousemove", handleMouseMove);
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
            <div className={styles.infobox}>
              <div className={`year1 ${styles.box}`}>
                <div className={styles.date} />
                <div className={styles.value} />
              </div>
              <div className={styles.diff}></div>
              <div className={`year2 ${styles.box}`}>
                <div className={styles.date} />
                <div className={styles.value} />
              </div>
            </div>
            <svg
              className="d3-component"
              width={width}
              height={height + margin * 2}
              ref={this.d3Container}
            />
          </div>
        </div>
      </div>
    );
  }

  updateDiffText(leftValue: DataEntry, rightValue: DataEntry): void {
    const diffValue = d3.format("+.2f")(
      ((rightValue.value - leftValue.value) * 100) / leftValue.value
    );
    if (rightValue.value > leftValue.value) {
      d3.select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#00b512");
    } else if (rightValue.value < leftValue.value) {
      d3.select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#c90000");
    } else {
      d3.select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#000000");
    }
  }

  createVerticleLine(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never>,
    width: number,
    height: number,
    margin: number,
    dataSelected: DataEntry[],
    isRight = false
  ): void {
    const ts = dateLabels[
      isRight ? this.state.dateSelected[1] : this.state.dateSelected[0]
    ].split(" ");
    const d1 = d3.timeMonth.floor(getDate(ts[0], ts[1].toLowerCase()));
    const displayXLine = Math.min(x(d1), width + margin);
    const line: d3.Selection<
      SVGLineElement,
      unknown,
      null,
      undefined
    > = svg
      .append("line")
      .classed(styles.verticleLine, true)
      .attr("x1", displayXLine)
      .attr("y1", 0)
      .attr("x2", displayXLine)
      .attr("y2", height);

    line.call(
      // @ts-ignore weird type hints
      d3
        .drag()
        .on("drag", (event, d) => {
          event.sourceEvent.preventDefault();
          const siblingXIdx = isRight
            ? this.state.dateSelected[0]
            : this.state.dateSelected[1];
          const xCoord = event.x;
          const mouseDate = x.invert(xCoord);
          const mouseDateSnap = d3.timeMonth.floor(mouseDate);
          const displayX = Math.min(x(mouseDateSnap), width + margin);
          if (displayX < margin - width / dateLabels.length) {
            return;
          }

          const bisectDate = d3.bisector(
            (d: { date: Date; value: number }) => d.date
          ).right;
          const xIndex = Math.min(
            bisectDate(dataSelected, mouseDateSnap, 0),
            dataSelected.length - 1
          );
          if (
            (isRight && xIndex - siblingXIdx <= 1) ||
            (!isRight && siblingXIdx - xIndex <= 1)
          ) {
            return;
          }
          line
            .filter((p) => p === d)
            .attr("x1", displayX)
            .attr("x2", displayX);

          const percentage = ((displayX - margin) / width) * 100;
          const entry = dataSelected[xIndex];
          let infoboxClass = ".year1";
          let lineClass = ".start";
          let leftValue = entry;
          let rightValue = dataSelected[this.state.dateSelected[1]];
          if (isRight) {
            infoboxClass = ".year2";
            lineClass = ".end";
            leftValue = dataSelected[this.state.dateSelected[0]];
            rightValue = entry;
          }

          d3.selectAll(lineClass).attr("offset", `${percentage}%`);
          const infobox = d3.select(infoboxClass);
          infobox
            .select(`.${styles.date}`)
            .text(
              `${entry.date.toLocaleString("default", {
                year: "numeric",
                month: "short",
              })}`
            );
          infobox
            .select(`.${styles.value}`)
            .text(`${d3.format(".5s")(entry.value)}`);
          this.updateDiffText(leftValue, rightValue);
        })
        .on("end", (event) => {
          event.sourceEvent.preventDefault();
          const siblingXIdx = isRight
            ? this.state.dateSelected[0]
            : this.state.dateSelected[1];
          const xCoord = event.x;
          const mouseDate = x.invert(xCoord);
          const mouseDateSnap = d3.timeMonth.floor(mouseDate);
          const displayX = Math.min(x(mouseDateSnap), width + margin);
          if (displayX < margin - width / dateLabels.length) {
            return;
          }

          const bisectDate = d3.bisector(
            (d: { date: Date; value: number }) => d.date
          ).right;
          const xIndex = Math.min(
            bisectDate(dataSelected, mouseDateSnap, 0),
            dataSelected.length - 1
          );

          if (
            (isRight && xIndex - siblingXIdx <= 1) ||
            (!isRight && siblingXIdx - xIndex <= 1)
          ) {
            return;
          }

          this.setState({
            dateSelected: [
              Math.min(siblingXIdx, xIndex),
              Math.max(siblingXIdx, xIndex),
            ],
          });
        })
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
