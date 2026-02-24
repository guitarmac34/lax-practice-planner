export type DrillCategory =
  | "offense"
  | "defense"
  | "shooting"
  | "passing"
  | "ground-balls"
  | "goalie"
  | "conditioning"
  | "warmup"
  | "other";

export const DRILL_CATEGORIES: { value: DrillCategory; label: string }[] = [
  { value: "warmup", label: "Warm-Up" },
  { value: "offense", label: "Offense" },
  { value: "defense", label: "Defense" },
  { value: "shooting", label: "Shooting" },
  { value: "passing", label: "Passing" },
  { value: "ground-balls", label: "Ground Balls" },
  { value: "goalie", label: "Goalie" },
  { value: "conditioning", label: "Conditioning" },
  { value: "other", label: "Other" },
];

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  coachingPoints: string[];
  youtubeUrl: string;
  category: DrillCategory;
}

export interface PlannedDrill {
  id: string;
  drillId: string;
  duration: number;
}

export interface Station {
  id: string;
  name: string;
  assignedCoachIds: string[];
  drills: PlannedDrill[];
}

export interface PracticePlan {
  id: string;
  name: string;
  date: string;
  notes: string;
  stations: Station[];
}

export type PlayerPosition = "goalie" | "middie" | "attack" | "defense";

export const PLAYER_POSITIONS: { value: PlayerPosition; label: string }[] = [
  { value: "goalie", label: "Goalie" },
  { value: "middie", label: "Middie" },
  { value: "attack", label: "Attack" },
  { value: "defense", label: "Defense" },
];

export interface Player {
  id: string;
  name: string;
  positions: PlayerPosition[];
  rank: number;
}

export interface ShareablePlan {
  plan: PracticePlan;
  drills: Drill[];
  coaches: Coach[];
}
