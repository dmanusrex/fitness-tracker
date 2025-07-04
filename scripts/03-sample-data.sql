-- Create a test user
INSERT INTO FitUsers (external_user_id, username, email, home_team_id) VALUES
    ('test-user-001', 'john_swimmer', 'john@example.com', 1);

-- Get the user ID for our test user
-- Insert sample activity entries for the test user
INSERT INTO FitActivityEntries (user_id, category_id, distance, entry_date, notes) VALUES
    -- Swimming activities
    (1, 1, 2000, '2024-01-15', 'Morning swim practice - felt strong today'),
    (1, 1, 1500, '2024-01-14', 'Easy recovery swim'),
    (1, 1, 3000, '2024-01-13', 'Long distance training session'),
    (1, 1, 1000, '2024-01-12', 'Sprint intervals'),
    (1, 1, 2500, '2024-01-11', 'Technique focused session'),
    
    -- Running activities
    (1, 2, 5000, '2024-01-15', 'Morning jog around the park'),
    (1, 2, 3000, '2024-01-13', 'Easy recovery run'),
    (1, 2, 8000, '2024-01-11', 'Long run - building endurance'),
    (1, 2, 2000, '2024-01-10', 'Speed work on track'),
    
    -- Competition activities
    (1, 3, 1500, '2024-01-14', 'Local swim meet - 1500m freestyle'),
    (1, 3, 800, '2024-01-12', 'Time trial - 800m freestyle'),
    (1, 3, 400, '2024-01-10', 'Sprint competition - 400m freestyle');

-- Create some personal goals for the test user
INSERT INTO FitPersonalGoals (user_id, category_id, goal_type, target_distance, start_date, end_date) VALUES
    (1, 1, 'weekly', 10000, '2024-01-08', '2024-01-14'),
    (1, 2, 'monthly', 50000, '2024-01-01', '2024-01-31'),
    (1, 3, 'weekly', 2000, '2024-01-08', '2024-01-14');

-- Add the test user to a team
INSERT INTO FitTeamMemberships (user_id, team_id) VALUES
    (1, 1); -- Join the Aquatic Club

-- Create a sample team challenge
INSERT INTO FitTeamChallenges (team_id, category_id, name, description, target_distance, start_date, end_date, created_by) VALUES
    (1, 1, 'January Swimming Challenge', 'Team goal to swim 100,000 meters collectively in January', 100000, '2024-01-01', '2024-01-31', 1),
    (1, 2, 'New Year Running Challenge', 'Kick off the year with a team running challenge', 75000, '2024-01-01', '2024-01-31', 1);
