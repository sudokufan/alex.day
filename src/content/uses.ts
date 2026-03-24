import type { UsesCategory } from "../lib/types";

export const usesCategories: UsesCategory[] = [
  {
    category: "Hardware",
    items: [
      {
        name: "MacBook Air",
        description: "Whatever the smallest portable Mac is, that's what I get",
      },
      {
        name: "Leuchtturm1917 A5",
        description:
          "The A5 dotted hardback has been my Bullet Journal since 2018",
      },
      {
        name: "dead•trees Pulp Edition",
        description: "My pocket notebook of choice",
      },
      {
        name: "Studio Neat Mark Two",
        description:
          "This pen is only out of my pocket when it's in my hand or someone else's",
      },
      {
        name: "Keychron K2 (brown switches)",
        description:
          "For my standing desk, so it sounds like a Dharma station when I type",
      },
    ],
  },
  {
    category: "Software",
    items: [
      {
        name: "VS Code",
        description: "With a minimal setup — just a few extensions",
      },
      { name: "One Dark Pro", description: "The best VS Code theme" },
      { name: "Safari", description: "I like out-of-the-box browsers" },
      {
        name: "Claude",
        description: "An insanely good collaborator for digital work",
      },
    ],
  },
  // {
  //   category: "Desk",
  //   items: [
  //     {
  //       name: "A simple wooden desk",
  //       description: "Nothing fancy — just enough surface",
  //     },
  //     { name: "Bose QC45", description: "For when I need to disappear" },
  //     { name: "A mug of coffee", description: "The most important tool" },
  //   ],
  // },
  {
    category: "Audio",
    items: [
      {
        name: "iPod Classic",
        description:
          "Modded from eBay so it has a huge battery and an SSD storage upgrade",
      },
      {
        name: "AirPods Pro",
        description: "Noise cancellation is next-level",
      },
    ],
  },
];
