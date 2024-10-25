CREATE TABLE IF NOT EXISTS user_stats (
  user_id INTEGER PRIMARY KEY,
  progress INTEGER NOT NULL DEFAULT 0,
  memorized JSONB NOT NULL DEFAULT '{}',
  history JSONB NOT NULL DEFAULT '[]'
);

