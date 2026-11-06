export type RoadmapIcon = "clipboard" | "book" | "car" | "award" | "license" | "shield";

export type RoadmapStep = {
  _key: string;
  title: string;
  description: string;
  icon?: RoadmapIcon | null;
};

export type AboutData = {
  title: string;
  highlight?: string | null;
  description?: string | null;
  roadmapTitle?: string | null;
  steps?: RoadmapStep[] | null;
};
