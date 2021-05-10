import React from "react";
import AreaChart from "src/components/AreaChart";
import ChessLineChart from "src/components/ChessLineChart";
import BubbleChart from "src/components/BubbleChart";

export default function App(): JSX.Element {
  return (
    <div>
      <BubbleChart />
      <hr />
      <AreaChart />
      <hr />
      <ChessLineChart />
    </div>
  );
}
