import * as React from "react";
import classNames from "classnames";

const styles = require("./style.scss");

const Page2 = (): JSX.Element => (
  <div>

    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1>What is Twitch.Tv?</h1>
        <p>
          {" "}
          TwitchTv, a subsidiary of <i>Amazon.com Inc</i>, is a streaming service
          that is concentrated on <b>video game live streaming</b>, broadcasting
          of e-sport events, music and other creative content, and more recently
          "in real life" streams. Each category represents either explicit video
          game titles or is more general like <b>Just Chatting</b> or Music. Since
          channels are also associated with languages, users are able select a
          certain category language in order to be presented with a list of
          fitting channels. If you look right, there is a typical page that you
          can expect when you go on{" "}
          <a href="https://www.twitch.tv/" target="_blank" rel="noreferrer">
            Twitch.Tv
          </a>
          :
        </p>
      </div>
      <img
        src="https://raw.githubusercontent.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/gh-pages/images/page2.png"
        width="800"
        height="400"
        className={styles.right}
      />
    </div>
  </div>
);

export default Page2;
