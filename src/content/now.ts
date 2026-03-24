import type { NowSection } from "../lib/types";

export const now = {
  lastUpdated: "2026-03-24",
  sections: [
    {
      heading: "music",
      items: [
        "My new album The Stranger came out March 24th (today, at the time of writing). It's nice, I like it.",
      ],
    },
    {
      heading: "work",
      items: [
        "I'm currently unemployed, though I'm in process with a couple places. There are cool opportunities in the world and I'll land one eventually, just not sure how long it'll take before I do so.",
      ],
    },
    {
      heading: "shows",
      items: [
        "G and I are marathoning Slow Horses and are just starting season 5. Highly recommended.",
      ],
    },
    {
      heading: "currently located:",
      items: ["Bath, England"],
    },
  ] satisfies NowSection[],
};
