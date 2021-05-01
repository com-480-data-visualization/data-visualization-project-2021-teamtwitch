import React from "react";

const styles = require("./block1.scss");

const Block1 = (): JSX.Element => (
  <div>
    <h2 className={styles.header}>This is a block.</h2>
    <div>This block has some content.</div>
    <div>Line 1</div>
    <div className={styles.specialLine}>Line 2</div>
    <div>Line 3</div>
    <div>And some items:</div>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);

export default Block1;
