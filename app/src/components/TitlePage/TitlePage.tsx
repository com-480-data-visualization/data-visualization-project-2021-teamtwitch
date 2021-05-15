import * as React from "react";
import classNames from "classnames";

const styles = require("./style.scss");

const TitlePage = (): JSX.Element => (
  <div>
    <h1>test header</h1>
    <div className={styles.wrapper}>
      <p className={classNames(styles.paragraph, styles.test)}>1</p>
      <p className={styles.paragraph}>2</p>
    </div>
  </div>
);

export default TitlePage;
