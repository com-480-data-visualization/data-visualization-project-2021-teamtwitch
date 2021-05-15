import React from "react";
import AreaChart from "src/components/AreaChart";
import ChessLineChart from "src/components/ChessLineChart";
import BubbleChart from "src/components/BubbleChart";
import ReactFullpage from "@fullpage/react-fullpage";

export default function App(): JSX.Element {
  return (
    <ReactFullpage
      licenseKey="?"
      scrollingSpeed={1000}
      render={() => (
        <ReactFullpage.Wrapper>
          <div className="section">
            <BubbleChart />
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
