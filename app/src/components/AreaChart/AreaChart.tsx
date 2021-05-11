import React from "react";
import * as d3 from "d3";
import { languageMapping, dateLabels, columnLabels, getDate } from "./utils";

const styles = require("./areachart.scss");

interface IRawDataRow {
  year: string;
  month: string;
  language: string;
}

interface IGenericData {
  [key: string]: number;
}

interface IDataEntry {
  date: Date;
  value: number;
}

const loadData = async (): Promise<{
  [key: string]: { [key: string]: IDataEntry[] };
}> => {
  return fetch(
    "https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/662d2972130af64b87bc9c6325bfd86390e15498/data/agg.json"
  )
    .then((data) => data.json())
    .then((body: (IRawDataRow & IGenericData)[]) => {
      const data: {
        [key: string]: { [key: string]: IDataEntry[] };
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
interface IAreaChartState {
  data: {
    [key: string]: { [key: string]: IDataEntry[] };
  };
  language: string;
  column: string;
  dateSelected: number[];
}

class AreaChart extends React.Component<{}, IAreaChartState> {
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
    const width = 800 - 2 * margin;
    const height = 480 - 2 * margin;

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

      // Interactivity
      svg.append("circle").classed(styles.hoverPoint, true);
      svg.append("text").classed(styles.tooltip, true);

      const entry1 = dataSelected[this.state.dateSelected[0]];
      this.updateInfoText(entry1, ".year1");
      const entry2 = dataSelected[this.state.dateSelected[1]];
      this.updateInfoText(entry2, ".year2");
      this.updateDiffText(entry1, entry2);

      svg
        .append("rect")
        .attr("fill", "transparent")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

      // Left line
      this.createVerticleLine(svg, x, y, width, height, margin, dataSelected);

      // Right line
      this.createVerticleLine(
        svg,
        x,
        y,
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

      svg.on("mousemove", (event) => {
        event.preventDefault();
        const xCoord = d3.pointer(event)[0];
        this.handleMouseMove(xCoord, svg, x, y, width, margin, dataSelected);
      });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.description}>
          <h2>How does the populartiy of Twitch change over time?</h2>
          <p>
            Twitch is now a well-known streaming platform, but how popular was
            it? Before the pademic? Or even long ago? Is it popular across
            countries? Or people in some regions simply favour this platform
            more?
          </p>
          <p>
            There are some interesting things here that are worth investigating:
          </p>
          <ul>
            <li>
              In which languages does Twitch get more popular in recent years?
            </li>
            <li>
              Is there any seasonal or annual change in max viewers of channels?
            </li>
            <li>
              Is there any interesting change between languages when COVID hit
              the world?
            </li>
          </ul>
          <p>
            Here we present the two types of statistics of games that have been
            streamed on Twitch in different languages from 2016 to 2021:
          </p>
          <ul>
            <li>Average data of all games</li>
            <li>Average data of top-10 popular games</li>
          </ul>
          <p>Drag the verticle bars and check this out!</p>
        </div>
        <div>
          <div className={styles.selectors}>
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
          </div>
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

  handleMouseMove(
    xCoord: number,
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>,
    width: number,
    margin: number,
    dataSelected: IDataEntry[],
    drag = false
  ): void {
    const mouseDate = x.invert(xCoord);
    const mouseDateSnap = d3.timeMonth.floor(mouseDate);
    const displayX = Math.min(x(mouseDateSnap), width + margin);
    if (displayX < margin - width / dateLabels.length) {
      return;
    }

    const bisectDate = d3.bisector((d: { date: Date; value: number }) => d.date)
      .right;
    const xIndex = Math.min(
      bisectDate(dataSelected, mouseDateSnap, 0),
      dataSelected.length - 1
    );
    const yValue = dataSelected[xIndex].value;

    // Circle pointer
    svg
      .selectAll(`.${styles.hoverPoint}`)
      .attr("cx", displayX)
      .attr("cy", y(yValue))
      .attr("r", "7")
      // Follow the colour gradient
      .classed(
        styles.outside,
        // Should not update colour when the bar is being dragged
        !drag &&
          (xIndex < this.state.dateSelected[0] ||
            xIndex > this.state.dateSelected[1])
      );

    // Tooltip
    const isLessThanHalf = xIndex > dataSelected.length / 2;
    const hoverTextX = isLessThanHalf ? "-0.75em" : "0.75em";
    const hoverTextAnchor = isLessThanHalf ? "end" : "start";

    svg
      .selectAll(`.${styles.tooltip}`)
      .attr("x", displayX)
      .attr("y", y(yValue))
      .style("text-anchor", hoverTextAnchor)
      .html(
        `<tspan x=${displayX} dx='${hoverTextX}' dy='1.2em'>${dataSelected[
          xIndex
        ].date.toLocaleString("default", {
          year: "numeric",
          month: "short",
        })}</tspan><tspan x=${displayX} dx='${hoverTextX}' dy='1.2em'>${d3.format(
          ".5s"
        )(yValue)}</tspan>`
      );
  }

  updateDiffText(leftValue: IDataEntry, rightValue: IDataEntry): void {
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

  updateInfoText(value: IDataEntry, className: string): void {
    const infobox = d3.select(className);
    infobox.select(`.${styles.date}`).text(
      `${value.date.toLocaleString("default", {
        year: "numeric",
        month: "short",
      })}`
    );
    infobox.select(`.${styles.value}`).text(`${d3.format(".5s")(value.value)}`);
  }

  createVerticleLine(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>,
    width: number,
    height: number,
    margin: number,
    dataSelected: IDataEntry[],
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
            (isRight && xIndex - siblingXIdx < 1) ||
            (!isRight && siblingXIdx - xIndex < 1)
          ) {
            return;
          }

          const entry = dataSelected[xIndex];
          const percentage = ((displayX - margin) / width) * 100;
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

          // Update line
          line
            .filter((p) => p === d)
            .attr("x1", displayX)
            .attr("x2", displayX);
          // Update circle and tooltip
          this.handleMouseMove(
            xCoord,
            svg,
            x,
            y,
            width,
            margin,
            dataSelected,
            true
          );
          // Update gradient
          d3.selectAll(lineClass).attr("offset", `${percentage}%`);
          // Update infobox
          this.updateInfoText(entry, infoboxClass);
          this.updateDiffText(leftValue, rightValue);
        })
        .on("end", (event) => {
          event.sourceEvent.preventDefault();
          const currDates = this.state.dateSelected;
          const siblingXIdx = isRight ? currDates[0] : currDates[1];
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
          let xIndex = Math.min(
            bisectDate(dataSelected, mouseDateSnap, 0),
            dataSelected.length - 1
          );

          if (isRight && xIndex - siblingXIdx < 1) {
            xIndex = siblingXIdx + 1;
          } else if (!isRight && siblingXIdx - xIndex < 1) {
            xIndex = siblingXIdx - 1;
          }

          const newState = [
            Math.min(siblingXIdx, xIndex),
            Math.max(siblingXIdx, xIndex),
          ];
          if (currDates[0] !== newState[0] || currDates[1] !== newState[1]) {
            this.setState({
              dateSelected: newState,
            });
          }
        })
    );
  }
}

const LanguageSelector = (props: {
  languageMapping: { [key: string]: string };
  language: string;
  setLanguage: (v: string) => void;
}) => (
  <div className={styles.selector}>
    <div className={styles.title}>Language of channels</div>
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
  </div>
);

const ColumnSelector = (props: {
  columnLabels: string[];
  column: string;
  setColumn: (c: string) => void;
}) => (
  <div className={styles.selector}>
    <div className={styles.title}>Type of stats</div>
    <select
      onChange={(e) =>
        props.column !== e.target.value && props.setColumn(e.target.value)
      }
    >
      {props.columnLabels.map((k) => (
        <option key={k} value={k.toLowerCase().replace(" ", "")}>
          {k}
        </option>
      ))}
    </select>
  </div>
);

export default AreaChart;
