import React from "react";
import BarChartForComparison from "src/components/BarChartForComparison";
import BubbleChart from "src/components/BubbleChart";

export default function App(): JSX.Element {
  return (
    <div>
      <BubbleChart />
      <hr />
      <BarChartForComparison />
    </div>
  );
}
