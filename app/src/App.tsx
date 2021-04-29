import React from "react";
import Block1 from "src/components/Block1";
import Block2 from "src/components/Block2";
import BlockSampleChart from "src/components/BlockSampleChart";

export default function App(): JSX.Element {
  return (
    <div>
      <Block1 />
      <hr />
      <Block2 />
      <hr />
      <BlockSampleChart />
    </div>
  );
}
