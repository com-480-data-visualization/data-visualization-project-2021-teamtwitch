import React from "react";
import AreaChart from "src/components/AreaChart";
import ChessLineChart from "src/components/ChessLineChart";
import BubbleChart from "src/components/BubbleChart";
import ScatterPlot from "src/components/ScatterPlot";
import ReactFullpage from "@fullpage/react-fullpage";
import TitlePage from "src/components/TitlePage";
import Page2 from "src/components/Page2";

export default function App(): JSX.Element {
  return (
    <ReactFullpage
      licenseKey="?"
      scrollingSpeed={1000}
      render={() => (
        <ReactFullpage.Wrapper>
          <div className="section">
            <TitlePage />
          </div>
          <div className="section">
            <Page2 />
          </div>
          <div className="section">
            <BubbleChart />
          </div>
          <div className="section">
            <ScatterPlot />
          </div>
          <div className="section">
            <AreaChart />
          </div>
          <div className="section">
            <ChessLineChart />
          </div>
        </ReactFullpage.Wrapper>
      )}
    />
  );
}
