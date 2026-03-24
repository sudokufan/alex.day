export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
  tags?: string[];
}

export interface RushmoreItem {
  name: string;
  detail?: string;
}

export interface MountRushmore {
  category: string;
  items: [RushmoreItem, RushmoreItem, RushmoreItem, RushmoreItem];
}

export interface UsesItem {
  name: string;
  description?: string;
  url?: string;
}

export interface UsesCategory {
  category: string;
  items: UsesItem[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface StatCategory {
  category: string;
  stats: Stat[];
}

export interface NowSection {
  heading: string;
  items: string[];
}

export interface Project {
  title: string;
  date: string;
  description: string;
}
