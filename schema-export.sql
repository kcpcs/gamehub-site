-- === TABLES ===
CREATE TABLE AIActivityLog (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    activity_type TEXT,
    target_type TEXT,
    target_id TEXT,
    content TEXT,
    success INTEGER DEFAULT 1,
    error_message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE
  );
CREATE TABLE AIBehaviorConfig (
    id TEXT PRIMARY KEY,
    player_id TEXT UNIQUE,
    wake_up_time TEXT DEFAULT '08:00',
    sleep_time TEXT DEFAULT '23:00',
    activity_interval_min INTEGER DEFAULT 300,
    activity_interval_max INTEGER DEFAULT 1800,
    post_probability REAL DEFAULT 0.1,
    comment_probability REAL DEFAULT 0.3,
    reply_probability REAL DEFAULT 0.5,
    typing_speed_min INTEGER DEFAULT 30,
    typing_speed_max INTEGER DEFAULT 60,
    thinking_time_min INTEGER DEFAULT 2,
    thinking_time_max INTEGER DEFAULT 10,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE
  );
CREATE TABLE "AIPlayer" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT UNIQUE,
        "email" TEXT UNIQUE,
        "avatar" TEXT,
        "age" INTEGER,
        "occupation" TEXT,
        "personality" TEXT DEFAULT '{}',
        "interests" TEXT DEFAULT '[]',
        "activity_level" REAL DEFAULT 0.5,
        "status" TEXT DEFAULT 'inactive',
        "created_at" TEXT DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP,
        "last_activity_at" TEXT,
        "total_posts" INTEGER DEFAULT 0,
        "total_comments" INTEGER DEFAULT 0
      );
CREATE TABLE AIStats (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    date TEXT,
    posts_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    active_minutes INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE,
    UNIQUE(player_id, date)
  );
CREATE TABLE AdminRole (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          can_manage_users INTEGER DEFAULT 0,
          can_manage_games INTEGER DEFAULT 0,
          can_manage_articles INTEGER DEFAULT 0,
          can_manage_codes INTEGER DEFAULT 0,
          can_manage_tierlists INTEGER DEFAULT 0,
          can_manage_comments INTEGER DEFAULT 0,
          can_view_analytics INTEGER DEFAULT 0,
          can_manage_settings INTEGER DEFAULT 0,
          can_manage_roles INTEGER DEFAULT 0,
          can_manage_ai_players INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
CREATE TABLE AdminUser (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'editor' NOT NULL,
  last_login_at TEXT,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partner" TEXT NOT NULL,
    "article_id" TEXT,
    "game_id" TEXT,
    "user_id" TEXT,
    "ip_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "article_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "source_type" TEXT NOT NULL DEFAULT 'ai',
    "source_urls" JSONB NOT NULL DEFAULT [],
    "game_id" TEXT,
    "author_id" TEXT,
    "cover_url" TEXT NOT NULL,
    "cover_alt" TEXT NOT NULL,
    "cover_credit" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "read_time" INTEGER NOT NULL DEFAULT 5,
    "seo_title" TEXT NOT NULL,
    "seo_description" TEXT NOT NULL,
    "seo_keywords" JSONB NOT NULL DEFAULT [],
    "canonical" TEXT,
    "affiliate_links" JSONB NOT NULL DEFAULT [],
    "quality_score" REAL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Article_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE AuditLog (
            id TEXT PRIMARY KEY,
            admin_id TEXT,
            action TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT,
            details TEXT DEFAULT '{}',
            ip_address TEXT,
            user_agent TEXT,
            success INTEGER DEFAULT 1,
            error_message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_slug" TEXT NOT NULL,
    "author_username" TEXT NOT NULL,
    "author_avatar" TEXT,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "parent_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Comment_article_slug_fkey" FOREIGN KEY ("article_slug") REFERENCES "Article" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "igdb_id" INTEGER,
    "steam_appid" INTEGER,
    "cover_url" TEXT NOT NULL,
    "screenshots" JSONB NOT NULL DEFAULT [],
    "platforms" JSONB NOT NULL DEFAULT [],
    "genres" JSONB NOT NULL DEFAULT [],
    "tags" JSONB NOT NULL DEFAULT [],
    "developer" TEXT,
    "publisher" TEXT,
    "release_date" DATETIME,
    "score_opencritic" REAL,
    "score_steam_pct" REAL,
    "score_community" REAL,
    "score_review_count" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "guide_count" INTEGER NOT NULL DEFAULT 0,
    "code_count" INTEGER NOT NULL DEFAULT 0,
    "has_tier_list" BOOLEAN NOT NULL DEFAULT false,
    "last_patch_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
CREATE TABLE "GameCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "reward_desc" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unverified',
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "expires_at" DATETIME,
    "verified_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_by_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameCode_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameCode_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT,
    "game_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Like_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Like_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "PointTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PointTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE Subscriber (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      games TEXT,
      token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE "TierEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tier_list_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "avg_score" REAL NOT NULL DEFAULT 3,
    "description" TEXT,
    CONSTRAINT "TierEntry_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "TierList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "game_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "patch_version" TEXT NOT NULL,
    "is_community" BOOLEAN NOT NULL DEFAULT true,
    "total_votes" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TierList_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "TierVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tier_list_id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TierVote_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TierVote_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "TierEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TierVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "password_hash" TEXT,
    "membership" TEXT NOT NULL DEFAULT 'free',
    "creator_level" TEXT NOT NULL DEFAULT 'reader',
    "points" INTEGER NOT NULL DEFAULT 0,
    "earned_cents" INTEGER NOT NULL DEFAULT 0,
    "pending_cents" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "article_count" INTEGER NOT NULL DEFAULT 0,
    "preferred_games" JSONB NOT NULL DEFAULT [],
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- === INDEXES ===
CREATE INDEX "AffiliateClick_created_at_idx" ON "AffiliateClick"("created_at");
CREATE INDEX "AffiliateClick_partner_idx" ON "AffiliateClick"("partner");
CREATE INDEX "Article_article_type_idx" ON "Article"("article_type");
CREATE INDEX "Article_game_id_idx" ON "Article"("game_id");
CREATE INDEX "Article_published_at_idx" ON "Article"("published_at");
CREATE INDEX "Article_slug_idx" ON "Article"("slug");
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE INDEX "Comment_article_slug_idx" ON "Comment"("article_slug");
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");
CREATE INDEX "Favorite_game_id_idx" ON "Favorite"("game_id");
CREATE UNIQUE INDEX "Favorite_user_id_game_id_key" ON "Favorite"("user_id", "game_id");
CREATE INDEX "Favorite_user_id_idx" ON "Favorite"("user_id");
CREATE UNIQUE INDEX "GameCode_code_game_id_key" ON "GameCode"("code", "game_id");
CREATE INDEX "GameCode_game_id_status_idx" ON "GameCode"("game_id", "status");
CREATE INDEX "Game_igdb_id_idx" ON "Game"("igdb_id");
CREATE UNIQUE INDEX "Game_igdb_id_key" ON "Game"("igdb_id");
CREATE INDEX "Game_slug_idx" ON "Game"("slug");
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX "Game_steam_appid_key" ON "Game"("steam_appid");
CREATE INDEX "Like_article_id_idx" ON "Like"("article_id");
CREATE INDEX "Like_game_id_idx" ON "Like"("game_id");
CREATE UNIQUE INDEX "Like_user_id_article_id_key" ON "Like"("user_id", "article_id");
CREATE UNIQUE INDEX "Like_user_id_game_id_key" ON "Like"("user_id", "game_id");
CREATE INDEX "Like_user_id_idx" ON "Like"("user_id");
CREATE INDEX "PointTransaction_user_id_idx" ON "PointTransaction"("user_id");
CREATE INDEX "TierEntry_tier_list_id_idx" ON "TierEntry"("tier_list_id");
CREATE UNIQUE INDEX "TierList_game_id_category_key" ON "TierList"("game_id", "category");
CREATE UNIQUE INDEX "TierVote_entry_id_user_id_key" ON "TierVote"("entry_id", "user_id");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX idx_AIActivityLog_activity_type ON AIActivityLog(activity_type);
CREATE INDEX idx_AIActivityLog_created_at ON AIActivityLog(created_at);
CREATE INDEX idx_AIActivityLog_player_id ON AIActivityLog(player_id);
CREATE INDEX idx_AIBehaviorConfig_player_id ON AIBehaviorConfig(player_id);
CREATE INDEX idx_AIPlayer_created_at ON AIPlayer(created_at);
CREATE INDEX idx_AIPlayer_status ON AIPlayer(status);
CREATE INDEX idx_AIStats_date ON AIStats(date);
CREATE INDEX idx_AIStats_player_id ON AIStats(player_id);
CREATE INDEX idx_admin_user_email ON AdminUser(email);
CREATE INDEX idx_admin_user_role ON AdminUser(role);
CREATE INDEX idx_audit_log_action ON AuditLog(action);
CREATE INDEX idx_audit_log_admin_id ON AuditLog(admin_id);
CREATE INDEX idx_audit_log_created_at ON AuditLog(created_at);
CREATE INDEX idx_subscriber_status ON Subscriber(status);
CREATE INDEX idx_subscriber_token ON Subscriber(token);

-- Schema export complete
