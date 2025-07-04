-- Seed initial data

-- Insert default categories
INSERT INTO FitCategories (name, description, unit) VALUES
    ('Swimming', 'Swimming activities and training', 'meters'),
    ('Running', 'Running and jogging activities', 'meters'),
    ('Competition', 'Competitive events and races', 'meters')
ON CONFLICT (name) DO NOTHING;

-- Insert sample program milestones
INSERT INTO FitProgramMilestones (category_id, name, target_distance, description) VALUES
    (1, 'Swimming Novice', 10000, 'Complete 10,000 meters of swimming'),
    (1, 'Swimming Enthusiast', 50000, 'Complete 50,000 meters of swimming'),
    (1, 'Swimming Champion', 100000, 'Complete 100,000 meters of swimming'),
    (1, 'Swimming Legend', 1000000, 'Complete 1 million meters of swimming'),
    (2, 'Running Starter', 10000, 'Complete 10,000 meters of running'),
    (2, 'Running Athlete', 50000, 'Complete 50,000 meters of running'),
    (2, 'Running Master', 100000, 'Complete 100,000 meters of running'),
    (2, 'Running Elite', 1000000, 'Complete 1 million meters of running'),
    (3, 'Competition Rookie', 5000, 'Complete 5,000 meters in competitions'),
    (3, 'Competition Pro', 25000, 'Complete 25,000 meters in competitions'),
    (3, 'Competition Champion', 100000, 'Complete 100,000 meters in competitions')
ON CONFLICT DO NOTHING;

-- Insert sample home teams
INSERT INTO FitTeams (name, description, is_home_team, invite_code) VALUES
    ('Aquatic Club', 'Main swimming and fitness club', true, 'AQUA2024'),
    ('Runners United', 'Community running group', true, 'RUN2024'),
    ('Elite Athletes', 'Competitive sports team', true, 'ELITE24')
ON CONFLICT (invite_code) DO NOTHING;
