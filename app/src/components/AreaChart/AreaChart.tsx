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

const dataUrl =
  "https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/dd2a1feb7db036217b2f045edd20ae7886015815/data/agg.json";

const loadData = async (
  url: string
): Promise<{
  [key: string]: { [key: string]: IDataEntry[] };
}> => {
  return fetch(url)
    .then((data) => data.json())
    .then((body: (IRawDataRow & IGenericData)[]) => {
      const data: {
        [key: string]: { [key: string]: IDataEntry[] };
      } = {};
      const colKeys = Object.values(columnLabels);
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
  rawData: {
    [key: string]: { [key: string]: IDataEntry[] };
  };
  language: string;
  column: string;
  dateSelected: number[];
}

class AreaChart extends React.Component<{}, IAreaChartState> {
  d3Container: React.MutableRefObject<null>;
  circles: { id: string; fill: string }[] = [
    {
      id: "areaCircleAll",
      fill: "#147f90",
    },
  ];
  tooltipIds: string[] = ["areaTooltipAll"];
  infoBoxIds: string[] = ["areaInfoboxAll"];
  constructor(props: {}) {
    super(props);
    this.d3Container = React.createRef();
    this.state = {
      rawData: {},
      language: "000",
      column: "View minutes",
      dateSelected: [0, dateLabels.length - 1],
    };
  }

  componentDidMount(): void {
    Promise.all([loadData(dataUrl)]).then((d) =>
      this.setState({ rawData: d[0] })
    );
  }

  render(): JSX.Element {
    const marginV = 30;
    const marginH = 60;
    const width =
      (window.screen.availWidth > 1560 ? 1000 : 750) - marginV - marginH;
    const height =
      (window.screen.availHeight > 900 ? 580 : 480) - marginV - marginH;

    if (
      this.d3Container.current &&
      Object.keys(this.state.rawData).length > 0
    ) {
      const rawDataSelected = this.state.rawData[this.state.language][
        columnLabels[this.state.column]
      ];
      const dataSelected = [rawDataSelected];
      const xExtent = d3.extent(rawDataSelected, (d) => d.date) as [Date, Date];
      const x = d3
        .scaleTime()
        .range([marginH, width + marginH])
        .domain(xExtent);

      const y = d3
        .scaleLinear()
        .domain([0, 1.1 * (d3.max(rawDataSelected, (d) => d.value) || 0)])
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
        .attr("width", width + marginH * 2)
        .attr("height", height + marginV * 2);

      const svg = wrapper
        .append("g")
        .attr("transform", `translate(${0},${marginV})`);

      const xAxis = d3.axisBottom(x);
      const xAxisTranslate = height;

      svg
        .append("g")
        .attr("transform", `translate(0, ${xAxisTranslate})`)
        .call(xAxis);

      const yAxis = d3.axisLeft(y).tickFormat(d3.format("~s"));

      svg.append("g").attr("transform", `translate(${marginH}, 0)`).call(yAxis);
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "#777")
        .text(this.state.column);

      const gradIdTopAll = "areaGradTopAll";
      const strokeWidth = 1.5;
      svg
        .append("path")
        .datum(rawDataSelected)
        .style("fill", `url(#${gradIdTopAll})`)
        .attr("stroke", `url(#${gradIdTopAll})`)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", strokeWidth)
        // @ts-ignore weird type hints
        .attr("d", area);

      // Interactivity
      for (let i = 0; i < dataSelected.length; i++) {
        svg
          .append("circle")
          .classed(styles.hoverPoint, true)
          .attr("id", this.circles[i].id)
          .style("fill", this.circles[i].fill);
        svg
          .append("text")
          .classed(styles.tooltip, true)
          .attr("id", this.tooltipIds[i]);
        const entry1 = dataSelected[i][this.state.dateSelected[0]];
        this.updateInfoText(this.infoBoxIds[i], entry1, ".year1");
        const entry2 = dataSelected[i][this.state.dateSelected[1]];
        this.updateInfoText(this.infoBoxIds[i], entry2, ".year2");
        this.updateDiffText(this.infoBoxIds[i], entry1, entry2);
      }

      svg
        .append("rect")
        .attr("fill", "transparent")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

      // Left line
      this.createVerticleLine(svg, x, y, width, height, marginH, dataSelected);

      // Right line
      this.createVerticleLine(
        svg,
        x,
        y,
        width,
        height,
        marginH,
        dataSelected,
        true
      );

      const leftLabel = dateLabels[this.state.dateSelected[0]].split(" ");
      const leftDate = d3.timeMonth.floor(
        getDate(leftLabel[0], leftLabel[1].toLowerCase())
      );
      const displayX1Line = Math.min(x(leftDate), width + marginH);
      const x1Percentage = `${((displayX1Line - marginH) / width) * 100}%`;

      const rightLabel = dateLabels[this.state.dateSelected[1]].split(" ");
      const rightDate = d3.timeMonth.floor(
        getDate(rightLabel[0], rightLabel[1].toLowerCase())
      );
      const displayX2Line = Math.min(x(rightDate), width + marginH);
      const x2Percentage = `${((displayX2Line - marginH) / width) * 100}%`;

      const defs = svg.append("defs");
      this.createGradient(
        defs,
        gradIdTopAll,
        "lightblue",
        x1Percentage,
        x2Percentage
      );

      svg.on("mousemove", (event) => {
        event.preventDefault();
        const xCoord = d3.pointer(event)[0];
        this.handleMouseMove(xCoord, svg, x, y, width, marginH, [
          rawDataSelected,
        ]);
      });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1>Popularity of Twitch.Tv over time</h1>
          <div className={styles.description}>
            <p>
              Given that nowadays Twitch.Tv is a very well-established streaming
              platform, we were interested in how it developed over time. Especially, we
              wanted to investigate how the pandemic and the fact that we started
              to spend more and more time indoors affected the amount of content
              viewed on Twitch.Tv.
            </p>
            <p>
              Here we present a vizualization that displays the statistics
              aggregated over games streamed on Twitch.Tv for different languages
              from 2016 to 2021. To give you some starting ideas, consider the
              following:
            </p>
            <ul>
              <li>
                Observe the growth of Twitch.Tv from 2016 to 2020. What changes
                in view minutes can you see? How does this differ for different
                languages?{" "}
                <u
                  className={styles.clickable}
                  onClick={() =>
                    this.setState({
                      dateSelected: [0, dateLabels.length - 16],
                    })
                  }
                >
                  Click here to find out!
                </u>
              </li>
              <li>
                Try to compare this to the growth that Twitch.Tv experienced
                during the COVID pandemic. Do people actually start spending
                more time on Twitch? How does this growth differ between
                languages, especially considering that Twitch.Tv has its
                viewership mainly based in the western hemisphere!{" "}
                <u
                  className={styles.clickable}
                  onClick={() =>
                    this.setState({
                      dateSelected: [
                        dateLabels.length - 15,
                        dateLabels.length - 1,
                      ],
                    })
                  }
                >
                  Click here to find out!
                </u>
              </li>
              <li>
                Is there any seasonal or annual change? To give you a starting
                point, consider the months of December. If you find an
                interesting pattern, what do you think is the reason for it?
              </li>
            </ul>
            <p>Generally, drag the verticle bars yourself and explore a bit!</p>
          </div>
        </div>
        <div>
          <div className={styles.selectors}>
            <LanguageSelector
              languageMapping={languageMapping}
              setLanguage={(d) => this.setState({ language: d })}
              language={this.state.language}
            />
            <ColumnSelector
              columnLabels={Object.keys(columnLabels)}
              column={this.state.column}
              setColumn={(c) => this.setState({ column: c })}
            />
          </div>
          <div>
            <div>
              <div className={styles.infobox}>
                <div className={`year1 ${styles.box}`}>
                  <div className={styles.date} />
                </div>
                <div className={styles.diff}></div>
                <div className={`year2 ${styles.box}`}>
                  <div className={styles.date} />
                </div>
              </div>
              <div className={styles.infobox} id={this.infoBoxIds[0]}>
                <div className={`year1 ${styles.box}`}>
                  <div className={styles.value} />
                </div>
                <div className={styles.diff}></div>
                <div className={`year2 ${styles.box}`}>
                  <div className={styles.value} />
                </div>
              </div>
            </div>
            <svg
              className="d3-component"
              width={width}
              height={height + marginV * 2}
              ref={this.d3Container}
            />
          </div>
        </div>
      </div>
    );
  }

  createGradient(
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    id: string,
    colorCode: string,
    startOffset: string,
    endOffset: string
  ): void {
    const gradient = defs.append("linearGradient").attr("id", id);
    // Left non-selected area
    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", startOffset)
      .attr("stop-color", colorCode)
      .attr("stop-opacity", 0.3);

    // Left bound of selected area
    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", startOffset)
      .attr("stop-color", colorCode);

    // Right bound of selected area
    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", endOffset)
      .attr("stop-color", colorCode)
      .attr("stop-opacity", 1);

    // Right non-selected area
    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", endOffset)
      .attr("stop-color", colorCode)
      .attr("stop-opacity", 0.3);
  }

  handleMouseMove(
    xCoord: number,
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>,
    width: number,
    marginH: number,
    dataSelected: IDataEntry[][],
    drag = false
  ): void {
    const mouseDate = x.invert(xCoord);
    const mouseDateSnap = d3.timeMonth.floor(mouseDate);
    const displayX = Math.min(x(mouseDateSnap), width + marginH);
    if (displayX < marginH - width / dateLabels.length) {
      return;
    }

    const bisectDate = d3.bisector((d: { date: Date; value: number }) => d.date)
      .right;
    const xIndex = Math.min(
      bisectDate(dataSelected[0], mouseDateSnap, 0),
      dataSelected[0].length - 1
    );

    for (let i = 0; i < dataSelected.length; i++) {
      const yValue = dataSelected[i][xIndex].value;

      // Circle pointer
      svg
        .selectAll(`#${this.circles[i].id}`)
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
      const isLessThanHalf = xIndex > dataSelected[i].length / 2;
      const hoverTextX = isLessThanHalf ? "-0.75em" : "0.75em";
      const hoverTextAnchor = isLessThanHalf ? "end" : "start";
      svg
        .selectAll(`#${this.tooltipIds[i]}`)
        .attr("x", displayX)
        .attr("y", y(yValue))
        .style("text-anchor", hoverTextAnchor)
        .html(
          `<tspan x=${displayX} dx='${hoverTextX}' dy='-1.2em'>${dataSelected[
            i
          ][xIndex].date.toLocaleString("default", {
            year: "numeric",
            month: "short",
          })}</tspan><tspan x=${displayX} dx='${hoverTextX}' dy='1.2em'>${d3.format(
            ".5s"
          )(yValue)}</tspan>`
        );
    }
  }

  updateDiffText(
    id: string,
    leftValue: IDataEntry,
    rightValue: IDataEntry
  ): void {
    const diffValue = d3.format("+.2f")(
      ((rightValue.value - leftValue.value) * 100) / leftValue.value
    );
    if (rightValue.value > leftValue.value) {
      d3.select(`#${id}`)
        .select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#00b512");
    } else if (rightValue.value < leftValue.value) {
      d3.select(`#${id}`)
        .select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#c90000");
    } else {
      d3.select(`#${id}`)
        .select(`.${styles.diff}`)
        .text(`${diffValue}%`)
        .style("color", "#000000");
    }
  }

  updateInfoText(id: string, value: IDataEntry, className: string): void {
    d3.select(className)
      .select(`.${styles.date}`)
      .text(
        `${value.date.toLocaleString("default", {
          year: "numeric",
          month: "short",
        })}`
      );
    d3.select(`#${id}`)
      .select(className)
      .select(`.${styles.value}`)
      .text(`${d3.format(".5s")(value.value)}`);
  }

  createVerticleLine(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>,
    width: number,
    height: number,
    marginH: number,
    dataSelected: IDataEntry[][],
    isRight = false
  ): void {
    const ts = dateLabels[
      isRight ? this.state.dateSelected[1] : this.state.dateSelected[0]
    ].split(" ");
    const d1 = d3.timeMonth.floor(getDate(ts[0], ts[1].toLowerCase()));
    const displayXLine = Math.min(x(d1), width + marginH);
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
          const displayX = Math.min(x(mouseDateSnap), width + marginH);
          if (displayX < marginH - width / dateLabels.length) {
            return;
          }

          const bisectDate = d3.bisector(
            (d: { date: Date; value: number }) => d.date
          ).right;
          const xIndex = Math.min(
            bisectDate(dataSelected[0], mouseDateSnap, 0),
            dataSelected[0].length - 1
          );
          if (
            (isRight && xIndex - siblingXIdx < 1) ||
            (!isRight && siblingXIdx - xIndex < 1)
          ) {
            return;
          }

          for (let i = 0; i < dataSelected.length; i++) {
            const entry = dataSelected[i][xIndex];
            const percentage = ((displayX - marginH) / width) * 100;
            let infoboxClass = ".year1";
            let lineClass = ".start";
            let leftValue = entry;
            let rightValue = dataSelected[i][this.state.dateSelected[1]];
            if (isRight) {
              infoboxClass = ".year2";
              lineClass = ".end";
              leftValue = dataSelected[i][this.state.dateSelected[0]];
              rightValue = entry;
            }

            // Update gradient
            d3.selectAll(lineClass).attr("offset", `${percentage}%`);
            // Update infobox
            this.updateInfoText(this.infoBoxIds[i], entry, infoboxClass);
            this.updateDiffText(this.infoBoxIds[i], leftValue, rightValue);
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
            marginH,
            dataSelected,
            true
          );
        })
        .on("end", (event) => {
          event.sourceEvent.preventDefault();
          const currDates = this.state.dateSelected;
          const siblingXIdx = isRight ? currDates[0] : currDates[1];
          const xCoord = event.x;
          const mouseDate = x.invert(xCoord);
          const mouseDateSnap = d3.timeMonth.floor(mouseDate);
          const displayX = Math.min(x(mouseDateSnap), width + marginH);
          if (displayX < marginH - width / dateLabels.length) {
            return;
          }

          const bisectDate = d3.bisector(
            (d: { date: Date; value: number }) => d.date
          ).right;
          let xIndex = Math.min(
            bisectDate(dataSelected[0], mouseDateSnap, 0),
            dataSelected[0].length - 1
          );

          if (isRight && xIndex - siblingXIdx < 1) {
            xIndex = siblingXIdx + 1;
          } else if (!isRight && siblingXIdx - xIndex < 1) {
            xIndex = siblingXIdx - 1;
          }

          // Set state only at end of drag to prevent re-rendering
          // during the drag
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
        <option key={k} value={k}>
          {k}
        </option>
      ))}
    </select>
  </div>
);

export default AreaChart;
