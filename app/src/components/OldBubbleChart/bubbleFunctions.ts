// @ts-nocheck
import * as d3 from "d3";

// for generating a random color
export function GetRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// takes our flat data, and creates a hierachical structured dataset
// necessary for the bubble chart
export const MakeHierarchy = function (data) {
  return d3.hierarchy({ children: data }).sum((d) => d.avgviewers);
};

// given the height and the size and a padding, it creates a layout
// for the bubble chart. the higher the padding, the further away
// the circles
export const Pack = function (size, pack_padding) {
  return d3.pack().size(size).padding(pack_padding);
};

export const MakeHierarchicalData = function (
  data,
  width,
  height,
  padding,
  pack_padding
) {
  //d3.shuffle(data);
  let hierarchalData = MakeHierarchy(data);
  let packLayout = Pack([width - padding, height - padding], pack_padding);
  // then enter the hierachical data into the layout
  return packLayout(hierarchalData).leaves();
};