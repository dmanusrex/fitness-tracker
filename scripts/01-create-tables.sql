-- Create database tables for fitness tracking app

-- Categories table (Swimming, Running, Competition, etc.)
CREATE TABLE IF NOT EXISTS FitCategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    unit VARCHAR(20) DEFAULT 'meters',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (assuming external auth system provides user data)
CREATE TABLE IF NOT EXISTS FitUsers (
    id SERIAL PRIMARY KEY,
    external_user_id VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    home_team_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS FitTeams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    invite_code VARCHAR(20) UNIQUE,
    is_home_team BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES FitUsers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team memberships
CREATE TABLE IF NOT EXISTS FitTeamMemberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES FitUsers(id),
    team_id INTEGER REFERENCES FitTeams(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, team_id)
);

-- Personal goals
CREATE TABLE IF NOT EXISTS FitPersonalGoals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES FitUsers(id),
    category_id INTEGER REFERENCES FitCategories(id),
    goal_type VARCHAR(20) CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
    target_distance INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program milestones
CREATE TABLE IF NOT EXISTS FitProgramMilestones (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES FitCategories(id),
    name VARCHAR(200) NOT NULL,
    target_distance INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity entries
CREATE TABLE IF NOT EXISTS FitActivityEntries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES FitUsers(id),
    category_id INTEGER REFERENCES FitCategories(id),
    distance INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team challenges
CREATE TABLE IF NOT EXISTS FitTeamChallenges (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES FitTeams(id),
    category_id INTEGER REFERENCES FitCategories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    target_distance INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES FitUsers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for home team
ALTER TABLE FitUsers ADD CONSTRAINT fk_fitusers_home_team 
    FOREIGN KEY (home_team_id) REFERENCES FitTeams(id);
