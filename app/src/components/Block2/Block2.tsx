import React from "react";

const styles = require("./block2.scss");

const text =
  "Fusce a arcu turpis. Proin purus nisi, blandit at lobortis eu, porta non augue. Donec pharetra, ligula a mattis molestie, ex elit sollicitudin libero, sed tempus arcu arcu eu arcu. Sed et libero ultrices, porttitor ligula et, malesuada metus. Quisque quam ex, pretium pretium consectetur vitae, viverra eu justo. Ut ornare eros turpis, sit amet elementum erat dapibus at.";

const Block2 = (): JSX.Element => {
  const numbers = [1, 2, 3, 4, 5, 6];
  return (
    <div>
      <h2>Another block here.</h2>
      <div>This block also has some content.</div>
      <div className={styles.text}>{text}</div>
      {numbers.map((i) => (
        <div
          className={styles.line}
          key={`line-${i}`}
        >{`Generated from item ${i}`}</div>
      ))}
      <div className={styles.footer}>That&apos;s it.</div>
    </div>
  );
};

export default Block2;
