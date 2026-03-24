import type { UsesCategory } from "../lib/types";

export const usesCategories: UsesCategory[] = [
  {
    category: "Hardware",
    items: [
      { name: 'MacBook Pro 14"', description: "M3 Pro — daily driver for everything" },
      { name: "Leuchtturm1917 A5", description: "Dotted, hardcover — for daily notes and thinking" },
      { name: "Lamy Safari", description: "Fine nib, matte black — the pen I keep coming back to" },
    ],
  },
  {
    category: "Software",
    items: [
      { name: "VS Code", description: "With a minimal setup — just a few extensions" },
      { name: "Arc", description: "Browser — the best of the bunch right now" },
      { name: "iA Writer", description: "For long-form writing when I want focus" },
      { name: "Things 3", description: "Task management that stays out of the way" },
    ],
  },
  {
    category: "Desk",
    items: [
      { name: "A simple wooden desk", description: "Nothing fancy — just enough surface" },
      { name: "Bose QC45", description: "For when I need to disappear" },
      { name: "A mug of coffee", description: "The most important tool" },
    ],
  },
  {
    category: "Audio",
    items: [
      { name: "Audio-Technica LP60X", description: "Entry-level turntable that sounds great" },
      { name: "Edifier R1280T", description: "Bookshelf speakers — warm, honest sound" },
    ],
  },
];
