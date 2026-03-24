import type { StatCategory } from "../lib/types";

export const statCategories: StatCategory[] = [
  {
    category: "Reading",
    stats: [
      { label: "Books read in 2026", value: "12" },
      { label: "Favorite genre", value: "Literary fiction" },
      { label: "Current streak", value: "30+ pages/day" },
    ],
  },
  {
    category: "Running",
    stats: [
      { label: "Miles this year", value: "342" },
      { label: "Longest run", value: "26.2 mi" },
      { label: "Favorite route", value: "The creek trail" },
    ],
  },
  {
    category: "Music",
    stats: [
      { label: "Vinyl records owned", value: "87" },
      { label: "Concerts this year", value: "4" },
      { label: "Most-played artist", value: "Bon Iver" },
    ],
  },
  {
    category: "Writing",
    stats: [
      { label: "Notebooks filled", value: "23" },
      { label: "Essays published", value: "3" },
      { label: "Journal streak", value: "47 days" },
    ],
  },
  {
    category: "Life",
    stats: [
      { label: "Cups of coffee today", value: "3" },
      { label: "States visited", value: "38" },
      { label: "Current age", value: "29" },
    ],
  },
];
