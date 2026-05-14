-- Add ai_generated and ai_player_id to Comment
ALTER TABLE "Comment" ADD COLUMN "ai_generated" INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE "Comment" ADD COLUMN "ai_player_id" TEXT;

-- Add ai_generated and ai_player_id to Article
ALTER TABLE "Article" ADD COLUMN "ai_generated" INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE "Article" ADD COLUMN "ai_player_id" TEXT;

-- Add new fields to AIPlayer
ALTER TABLE "AIPlayer" ADD COLUMN "avatar_url" TEXT;
ALTER TABLE "AIPlayer" ADD COLUMN "bio" TEXT;
ALTER TABLE "AIPlayer" ADD COLUMN "region" TEXT;
ALTER TABLE "AIPlayer" ADD COLUMN "joined_at_simulated" DATETIME;
ALTER TABLE "AIPlayer" ADD COLUMN "follower_ids" TEXT DEFAULT '[]' NOT NULL;

-- Create AIContentReviewQueue table
CREATE TABLE "AIContentReviewQueue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ai_player_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "generated_content" TEXT NOT NULL,
    "confidence_score" REAL NOT NULL,
    "quality_check_result" TEXT DEFAULT '{}' NOT NULL,
    "status" TEXT DEFAULT 'pending' NOT NULL,
    "reviewed_by" TEXT,
    "reviewed_at" DATETIME,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("ai_player_id") REFERENCES "AIPlayer"("id") ON DELETE CASCADE
);

-- Create indexes for AIContentReviewQueue
CREATE INDEX "AIContentReviewQueue_ai_player_id_idx" ON "AIContentReviewQueue"("ai_player_id");
CREATE INDEX "AIContentReviewQueue_status_idx" ON "AIContentReviewQueue"("status");
CREATE INDEX "AIContentReviewQueue_created_at_idx" ON "AIContentReviewQueue"("created_at");
