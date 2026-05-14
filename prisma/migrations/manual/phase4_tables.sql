-- GameRating table
CREATE TABLE IF NOT EXISTS "GameRating" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "game_id" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "review" TEXT,
  "helpful_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "GameRating_user_id_game_id_key" ON "GameRating"("user_id", "game_id");
CREATE INDEX IF NOT EXISTS "GameRating_game_id_idx" ON "GameRating"("game_id");
CREATE INDEX IF NOT EXISTS "GameRating_score_idx" ON "GameRating"("score");

-- Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" INTEGER NOT NULL DEFAULT 0,
  "action_url" TEXT,
  "data" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Notification_user_id_idx" ON "Notification"("user_id");
CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");
CREATE INDEX IF NOT EXISTS "Notification_created_at_idx" ON "Notification"("created_at");

-- Achievement table
CREATE TABLE IF NOT EXISTS "Achievement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon_url" TEXT,
  "points" INTEGER NOT NULL DEFAULT 10,
  "category" TEXT,
  "condition" TEXT NOT NULL,
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL
);

-- UserAchievement table
CREATE TABLE IF NOT EXISTS "UserAchievement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "achievement_id" TEXT NOT NULL,
  "unlocked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "progress" TEXT,
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserAchievement_user_id_achievement_id_key" ON "UserAchievement"("user_id", "achievement_id");
CREATE INDEX IF NOT EXISTS "UserAchievement_user_id_idx" ON "UserAchievement"("user_id");

-- CommentVote table
CREATE TABLE IF NOT EXISTS "CommentVote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "comment_id" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "CommentVote_user_id_comment_id_key" ON "CommentVote"("user_id", "comment_id");
CREATE INDEX IF NOT EXISTS "CommentVote_comment_id_idx" ON "CommentVote"("comment_id");

-- Add vote_score to Comment
ALTER TABLE "Comment" ADD COLUMN "vote_score" INTEGER NOT NULL DEFAULT 0;
