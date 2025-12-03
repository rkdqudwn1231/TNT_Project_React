import { ColorDescriptions } from "./ColorDescriptions";

export const tonePalettes = {
  Spring: [],
  Summer: [],
  Autumn: [],
  Winter: []
};

Object.keys(ColorDescriptions).forEach(hex => {
  const item = ColorDescriptions[hex];

  // tone 값에서 대표 계절만 가져옴 (앞 단어)
  const mainSeason = item.tone.split("/")[0].trim();

  if (tonePalettes[mainSeason]) {
    tonePalettes[mainSeason].push(hex);
  }
});
