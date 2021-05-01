// for generating a random color
export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const year1 = [{"title": "League of Legends", "measure":400, "property":"This is an awesome Game!"},
              {"title": "Minecraft", "measure":100, "property":"This is an awesome Game!"},
              {"title": "Just Chatting", "measure":310, "property":"This is an awesome Game!"},
              {"title": "Music", "measure":60, "property":"This is an awesome Game!"},
              {"title": "Chess", "measure":177, "property":"This is an awesome Game!"},
              {"title": "Counter Strike", "measure":132, "property":"This is an awesome Game!"},
              {"title": "DOTA", "measure":140, "property":"This is an awesome Game!"},
              {"title": "Misc", "measure":44, "property":"This is an awesome Game!"},
              {"title": "League of Legends", "measure":100, "property":"This is an awesome Game!"},
              {"title": "Minecraft", "measure":40, "property":"This is an awesome Game!"},
              {"title": "Just Chatting", "measure":200, "property":"This is an awesome Game!"},
              {"title": "Music", "measure":15, "property":"This is an awesome Game!"},
              {"title": "Chess", "measure":80, "property":"This is an awesome Game!"},
              ];

const year2 = [{"title": "League of Legends", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Minecraft", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Just Chatting", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Music", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Chess", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Counter Strike", "measure":500, "property":"This is an awesome Game!"},
              {"title": "DOTA", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Misc", "measure":500, "property":"This is an awesome Game!"},
              {"title": "League of Legends", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Minecraft", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Just Chatting", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Music", "measure":500, "property":"This is an awesome Game!"},
              {"title": "Chess", "measure":500, "property":"This is an awesome Game!"},
              ];
export const data = {"year1": year1, "year2": year2};
