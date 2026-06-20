-- Enable vector extension for future ML embeddings and pgvector support
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Concours table
CREATE TABLE IF NOT EXISTS concours (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    month VARCHAR(50),
    deadline VARCHAR(50),
    fee INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Programs table
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    faculty VARCHAR(255),
    durations INTEGER DEFAULT 3,
    requires_concour BOOLEAN DEFAULT FALSE,
    concours_id VARCHAR(50) REFERENCES concours(id) ON DELETE SET NULL,
    portal_url TEXT,
    required_al_subjects TEXT,
    tags TEXT[] DEFAULT '{}',
    careers TEXT[] DEFAULT '{}',
    descriptions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_programs_faculty ON programs(faculty);
CREATE INDEX IF NOT EXISTS idx_programs_university ON programs(university);
CREATE INDEX IF NOT EXISTS idx_programs_tags ON programs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_certifications_tags ON certifications USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);

-- Enable pg_trgm extension for fast text matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GCE Results table
CREATE TABLE IF NOT EXISTS gce_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_year INTEGER NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    center_number VARCHAR(50),
    center_name VARCHAR(255),
    candidate_name VARCHAR(255) NOT NULL,
    passed_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for fast fuzzy name search
CREATE INDEX IF NOT EXISTS idx_gce_results_candidate_name_trgm ON gce_results USING GIN (candidate_name gin_trgm_ops);
