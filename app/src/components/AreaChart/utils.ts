export const languageMapping: { [key: string]: string } = {
  "All languages": "000",
  Chinese: "241",
  Dutch: "235",
  English: "217",
  Finnish: "229",
  French: "214",
  German: "220",
  Italian: "230",
  Japanese: "226",
  Korean: "231",
  Spanish: "228",
};

export const dateLabels = [
  "2016 January",
  "2016 February",
  "2016 March",
  "2016 April",
  "2016 May",
  "2016 June",
  "2016 July",
  "2016 August",
  "2016 September",
  "2016 October",
  "2016 November",
  "2016 December",
  "2017 January",
  "2017 February",
  "2017 March",
  "2017 April",
  "2017 May",
  "2017 June",
  "2017 July",
  "2017 August",
  "2017 September",
  "2017 October",
  "2017 November",
  "2017 December",
  "2018 January",
  "2018 February",
  "2018 March",
  "2018 April",
  "2018 May",
  "2018 June",
  "2018 July",
  "2018 August",
  "2018 September",
  "2018 October",
  "2018 November",
  "2018 December",
  "2019 January",
  "2019 February",
  "2019 March",
  "2019 April",
  "2019 May",
  "2019 June",
  "2019 July",
  "2019 August",
  "2019 September",
  "2019 October",
  "2019 November",
  "2019 December",
  "2020 January",
  "2020 February",
  "2020 March",
  "2020 April",
  "2020 May",
  "2020 June",
  "2020 July",
  "2020 August",
  "2020 September",
  "2020 October",
  "2020 November",
  "2020 December",
  "2021 January",
  "2021 February",
  "2021 March",
];

export const columnLabels: Record<string, string> = {
  "View minutes": "viewminutes",
  "Streamed minutes": "streamedminutes",
  "Number of unique channels": "uniquechannels",
};

const months: { [key: string]: string } = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

export const getDate = (year: string, month: string): Date =>
  new Date(`${year}-${months[month]}-01`);
