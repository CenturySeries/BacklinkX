-- BacklinkX数据库表结构
-- 用于 Cloudflare D1

-- 资产表
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  email TEXT,
  description TEXT,
  anchor_texts TEXT NOT NULL DEFAULT '[]', -- JSON 数组字符串
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assets_updated_at ON assets(updated_at DESC);

-- 外链资源表
CREATE TABLE IF NOT EXISTS prospects (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_title TEXT,
  domain_normalized TEXT NOT NULL UNIQUE,
  anchor_text TEXT,
  dr REAL,
  link_attr TEXT, -- DOFOLLOW/NOFOLLOW/UNKNOWN
  notes TEXT,
  method TEXT, -- 外链方式
  is_paid INTEGER, -- NULL: 未知, 0: 否, 1: 是
  page_follow_count INTEGER,
  page_nofollow_count INTEGER,
  page_link_audit_at INTEGER,
  status TEXT, -- NULL: 待处理, SUITABLE: 可用, UNSUITABLE: 不合适
  target_asset_id TEXT, -- 绑定的目标资产ID, NULL表示通用池
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_dr ON prospects(dr DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_domain ON prospects(domain_normalized);
CREATE INDEX IF NOT EXISTS idx_prospects_target_asset ON prospects(target_asset_id);

-- 资产发布记录表
CREATE TABLE IF NOT EXISTS asset_posts (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  domain_normalized TEXT NOT NULL,
  last_status TEXT NOT NULL, -- SUBMITTED/FAILED
  posted_at INTEGER,
  failed_at INTEGER,
  last_note TEXT,
  discovered_at INTEGER, -- 外链被发现的时间
  updated_at INTEGER NOT NULL,
  UNIQUE(asset_id, domain_normalized)
);

CREATE INDEX IF NOT EXISTS idx_asset_posts_asset ON asset_posts(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_posts_domain ON asset_posts(domain_normalized);
CREATE INDEX IF NOT EXISTS idx_asset_posts_status ON asset_posts(last_status);

-- 资产 DR 历史记录表（按天）
CREATE TABLE IF NOT EXISTS asset_dr_history (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  day_start_ts INTEGER NOT NULL, -- 当天0点时间戳（本地）
  dr INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'ahrefs',
  imported_at INTEGER NOT NULL,
  UNIQUE(asset_id, date, source)
);

CREATE INDEX IF NOT EXISTS idx_asset_dr_history_asset_date
  ON asset_dr_history(asset_id, date);
