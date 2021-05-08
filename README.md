# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Devrim Celik | 322741 |
| Nina Mainusch | 323160 |
| Huan-Cheng Chang | 293760 |

[Milestone 1](#milestone-1-friday-23rd-april-5pm) • [Milestone 2](#milestone-2-7th-may-5pm) • [Milestone 3](#milestone-3-4th-june-5pm)

## Milestone 1 (Friday 23rd April, 5pm)

**10% of the final grade**

We, as passionate chess (and video game) players, follow the chess (and video game) scene on TwitchTv <sup>[1]</sup> and recognized a recent surge in interest there. We asked ourselves how the corona pandemic plays into this and finally decided to put on our detective hat to find out within the scope of our Data Visualization project.

### Dataset
TwitchTv, a subsidiary of *Amazon.com Inc*, is a streaming service that is concentrated on video game live streaming,
broadcasting of e-sport events, music and other creative content, and more recently "in real life" streams.
Each category represents either explicit video game titles or is more general like *Just Chatting* or *Music*.
Since channels are also associated with languages, users are able select a certain category language in order to be presented with a list of fitting channels.
Although TwitchTv provides an official API<sup>[2]</sup> which collects the number of current live viewers over the different channels,
there is no official historical collection of these statistics. However, there are websites like Sullygnome<sup>[3]</sup> that sample such
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

We want to focus on how the Corona Pandemic influences the interests of the TwitchTv users. In this setting, we aim at incorporating the following questions into our visualisation:

1. Firstly, we want to get a picture of the general trends of certain categories over the last few years. For example, we want to find out which categories were constantly popular and which ones were rather short-lived.

2. The Corona pandemic changed our lives in a multitude of ways, one of them being that many individuals work from home. As a result, we ask whether the amount of time that individuals spent on recreational activities on the web, such as watching gaming live-streams, increased. And if it did, did it increase within the progression of the pandemic?

3. We are interested in whether the life-altering changes that came with the current pandemic have an influence on our interests. Specifically, we are interested whether certain channels have become unexpectedly more popular under the pandemic. One channel that we are very intrigued in is *Chess*. TwitchTv has noticed a huge surge of interest in this channel over the year 2020. Many argue that this is due to release of the popular TV show Queen's Gambit<sup>[4]</sup>. We want to investigate the big picture: Did the pandemic have an influence in the surge of this category? What other factors played a role?

##### What are we trying to show?
We want paint a picture of what TwitchTv is and what kind of trends were observable before the pandemic. Afterwards, we will contrast these findings with trends after the pandemic.  
Lastly, we want to introduce the chess phenomenon on TwitchTv and find out how it came to be.

### Exploratory Data Analysis (EDA)

Our EDA contains some interactive plots, which makes the file size of the Jupyter notebook quite big. To best experience our plots, you can either download our folder and run the notebook yourself, or checkout this report page<sup>[5]</sup>, where we provide all the plots in a pre-executed, static manner.

### Related Work

Although TwitchTv already has become the focus of scientific research<sup>[6]</sup>, to the best of our knowledge, analysis on this type of data has yet to be conducted. On the other hand, the consequences of the corona pandemic on behaviour related to consumption of video games and streaming services (such as *Youtube* or *Netflix*) have been addressed. Generally, one observed an increase in the use of such mediums<sup>[7]</sup><sup>[8]</sup>.

We believe, the originality of our project stems from two facts:

- Even though the difference in the consumption of video games and streaming before and after the corona pandemic have been studied separately in more detail, it is our impression that the bridge that connects these two topics (namely live streaming service that focuses on video games) have been neglected. Especially our differentiation between different streaming categories sets us apart from previous analyses.

- The idea of relating consumption of a medium with time periods in which lockdowns have been issued, is to the best of our knowledge, quite original. Although the impact of the pandemic as a whole has been investigated, we did not find any study that focused on the difference between periods with and without active lockdowns.

### References
* [1] https://www.TwitchTv/
* [2] https://dev.TwitchTv/docs/api/
* [3] https://sullygnome.com/
* [4] https://gamerant.com/twitch-chess-category-spike-popularity/
* [5] http://htmlpreview.github.io/?https://github.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/blob/master/Milestone_1/Milestone_1_EDA_executed.html
* [6] https://ieeexplore.ieee.org/abstract/document/7377227}
* [7] https://en.wikipedia.org/wiki/Impact_of_the_COVID-19_pandemic_on_the_video_game_industry
* [8] https://www.nbcnews.com/tech/social-media/youtube-thrives-window-those-isolated-coronavirus-n1173651

## Milestone 2 (7th May, 5pm)

**10% of the final grade**

Please find our report [here](https://github.com/com-480-data-visualization/data-visualization-project-2021-teamtwitch/blob/master/Milestone_2/DV_M2.pdf) and our website [here](https://com-480-data-visualization.github.io/data-visualization-project-2021-teamtwitch/site/).


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
