import * as React from "react";
import classNames from "classnames";

const styles = require("./style.scss");

const Page2 = (): JSX.Element => (
  <div>
    <h1>What is Twitch.Tv?</h1>
    <p className={styles.p1}>A typical page that you can expect when you go on <a href="https://www.twitch.tv/" target="_blank">Twitch.Tv</a></p>
    <div className={styles.wrapper}>
      <img src="page2.png" width="1000" height="400" className={styles.center}/>
    </div>
  </div>
);

export default Page2;

      //<img src="page2.png"/>
