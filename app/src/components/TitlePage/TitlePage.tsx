import * as React from "react";
//import classNames from "classnames";

const styles = require("./style.scss");

const TitlePage = (): JSX.Element => (
  <div>
    <h1 className={styles.head1}>Twitch.Tv</h1>
    <div>
      <p className={styles.paragraph}>
        an interactive data visualization project
      </p>
      <img
        src="https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/gh-pages/images/twitch-logo.jpg"
        width="200"
        height="200"
        className={styles.image}
      />
    </div>
  </div>
);

export default TitlePage;

//<p className={classNames(styles.paragraph, styles.test)}> </p>
