# DB Schema - Co się dzieje w Polsce?

## Tables

### acts

- id: SERIAL PRIMARY KEY NOT NULL
- title: VARCHAR(1000) NOT NULL
- act_number: VARCHAR(255) NULL
- item_type: VARCHAR(255) NULL
- announcement_date: DATE NULL
- change_date: DATE NULL
- promulgation: DATE NULL
- item_status: VARCHAR(255) NULL
- comments: TEXT NULL
- keywords: TEXT[] DEFAULT '{}'
- refs: TEXT[] DEFAULT '{}'
- texts: TEXT[] DEFAULT '{}'
- file: VARCHAR(2000) NULL
- content: TEXT NULL
- simple_title: VARCHAR(500) NULL
- impact_section: TEXT NULL
- confidence_score: DECIMAL(3,2) NULL CHECK (0.00 <= confidence_score <= 9.99)
- votes: JSONB NULL
- category: VARCHAR(255) NULL REFERENCES category(category)
- idempotency_key: VARCHAR(255) UNIQUE NULL
- needs_reprocess: BOOLEAN DEFAULT FALSE NOT NULL
- created_at: TIMESTAMPTZ DEFAULT NOW() NOT NULL
- updated_at: TIMESTAMPTZ DEFAULT NOW() NOT NULL
- ingested_at: TIMESTAMPTZ NULL

### category

- category: VARCHAR(255) PRIMARY KEY NOT NULL
- keywords: TEXT[] DEFAULT '{}' NOT NULL

## Relations

- acts.category → category.category (many-to-one)

## Indexes

- acts_pkey: acts.id
- category_pkey: category.category
- idx_acts_created_at: acts.created_at
- idx_acts_category: acts.category
- idx_acts_needs_reprocess: acts.needs_reprocess
- idx_acts_confidence_score: acts.confidence_score
- idx_acts_idempotency_key: acts.idempotency_key (UNIQUE)
- idx_acts_updated_at: acts.updated_at

## Notes

- 3NF normalized
- Trigger for updated_at auto-update
- No RLS in MVP (Clerk handles auth)
