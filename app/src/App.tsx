import React from "react";
import BarChartForComparison from "src/components/BarChartForComparison";
import ChessLineChart from "src/components/ChessLineChart";
import BubbleChart from "src/components/BubbleChart";

export default function App(): JSX.Element {
  return (
    <div>
      <BubbleChart />
      <hr />
      <BarChartForComparison />
      <hr />
      <ChessLineChart />
    </div>
  );
}
