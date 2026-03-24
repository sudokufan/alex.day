import type { NowSection } from "../lib/types";

export const now = {
  lastUpdated: "2026-03-20",
  sections: [
    {
      heading: "Working on",
      items: [
        "Building this personal site",
        "A long-form essay about attention and craft",
      ],
    },
    {
      heading: "Reading",
      items: [
        "Jayber Crow by Wendell Berry",
        "Four Thousand Weeks by Oliver Burkeman",
      ],
    },
    {
      heading: "Thinking about",
      items: [
        "What intentional technology use actually looks like day-to-day",
        "The difference between productivity and meaningful work",
      ],
    },
    {
      heading: "Located",
      items: ["Denver, CO"],
    },
  ] satisfies NowSection[],
};
