-- Neon PostgreSQL Schema for Lax Practice Planner

CREATE TABLE coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT ''
);

CREATE TABLE drills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  coaching_points JSONB NOT NULL DEFAULT '[]',
  youtube_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other'
);

CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  positions JSONB NOT NULL DEFAULT '[]',
  rank INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE practice_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  stations JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE content_pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  last_updated TEXT NOT NULL DEFAULT ''
);

CREATE TABLE schedule_events (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  event_type TEXT NOT NULL DEFAULT 'other',
  opponent TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
);
