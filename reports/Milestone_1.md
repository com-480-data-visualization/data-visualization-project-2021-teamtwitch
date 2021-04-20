## Milestone 1 (Friday 23rd April, 5pm)

**10% of the final grade**

We, as passionate chess (and video game) players, follow the chess (and video game) scene on twitch.tv and recognised a recent surge in interest there. We asked ourselves, how the corona pandemic plays into this and finally decided to put on our detective hat to find out within the scope of our Data Visualization project.

### Dataset
[Twitch.tv](https://www.twitch.tv/), a subsidiary of *Amazon.com Inc*, is a streaming service that is concentrated on video game live streaming, 
broadcasting of e-sport events, music and other creative content, and more recently "in real life" streams.
Each category represents either explicit video game titles or is more general like *Just Chatting* or *Music*. 
Since channels are also associated with languages, users are able select a certain category language in order to be presented with a list of fitting channels. 
Although Twitch.tv provides an official [API](https://dev.twitch.tv/docs/api/) which collects the number of current live viewers over the different channels, 
there is no official historical collection of these statistics. However, there are websites like [Sullygnome.com](https://sullygnome.com/) that sample such 
statistics every 15 minutes since august 2015 and make them publicly available. We use this sampled statistics for compiling a time series 
(each points representing one month) over different categories, each of which includes the following features:

- Watch Time: Total amount of time this category was watched.
- Stream Time: Total amount of time this category was streamed.
- Peak Viewers: Maximum number of viewers at a time, within one category.
- Peak Channels: Maximum number of channels at a time, within one category.
- Streamers: Total amount of channels that streamed at least once in this category.
- Average Viewers: Average total viewers within one category.
- Average Channels: Average total channels streaming within one category.
- Average Viewer Ratio: Average number of viewers per channels within one category. 

Note that this dataset is available over all channels and in respect to all streamed language.

### Problematic

As a website that serves millions of users on a daily basis and is able to collect some kind of information about these users (i.e. number of viewers per channel), it presents a rich environment for all kind of analyses. We want to focus on how the Corona Pandemic influences the interests of the Twitch.tv users. In this setting, we aim at incorporating the following questions into our visualisation:

1. The Corona pandemic changed our lives in a multitude of ways, one of them being that many individuals work from home. As a result, we ask whether the amount of time that individuals spent on recreational activities on the web, such as watching gaming live-streams, increased. And if it did, did it increase within the progression of the pandemic?

2. We are interested in whether the life-altering changes that came with the current pandemic have an influence on our interests. Specifically, we are interested whether certain channels have become unexpectedly more popular under the pandemic. One channel that we are very intrigued in is *Chess*. Twitch.tv has noticed a huge surge of interest in this channel over the year 2020. Many argue that this is due to release of the popular TV show [Queen's Gambit](https://gamerant.com/twitch-chess-category-spike-popularity/).
    

### Exploratory Data Analysis (EDA)

Our EDA contains some interactive plots, which are best experienced in the [Jupyter Notebook](https://github.com/Nina-Mainusch/com-480-project-twizards/blob/main/Milestone_1_EDA.ipynb). 

### Related Work

Although Twitch.tv already has become the focus of scientific research e.g. [here](https://ieeexplore.ieee.org/abstract/document/7377227}), to the best of our knowledge, analysis on this type of data has yet to be conducted. On the other hand, the consequences of the corona pandemic on behaviour related to consumption of video games and streaming services (such as *Youtube* or *Netflix*) have been addressed. Generally, one observed an increase in the use of such mediums e.g. [here](https://en.wikipedia.org/wiki/Impact_of_the_COVID-19_pandemic_on_the_video_game_industry) and [here](https://www.nbcnews.com/tech/social-media/youtube-thrives-window-those-isolated-coronavirus-n1173651).

We believe, the originality of our project stems from two facts:

- Even though the difference in the consumption of video games and streaming before and after the corona pandemic have been studied separately in more detail, it is our impression that the bridge that connects these two topics (namely live streaming service that focuses on video games) have been neglected. Especially our differentiation between different streaming categories sets us apart from previous analyses.

- The idea of relating consumption of a medium with time periods in which lockdowns have been issued, is to the best of our knowledge, quite original. Although the impact of the pandemic as a whole has been investigated, we did not find any study that focused on the difference between periods with and without active lockdowns.

