import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Category {
  id: number
  name: string
  description: string
  unit: string
}

export interface User {
  id: number
  external_user_id: string
  username: string
  email: string
  home_team_id: number | null
}

export interface Team {
  id: number
  name: string
  description: string
  invite_code: string
  is_home_team: boolean
}

export interface ActivityEntry {
  id: number
  user_id: number
  category_id: number
  distance: number
  entry_date: string
  notes: string | null
  category_name?: string
}

export interface PersonalGoal {
  id: number
  user_id: number
  category_id: number
  goal_type: "daily" | "weekly" | "monthly"
  target_distance: number
  start_date: string
  end_date: string | null
  is_active: boolean
  category_name?: string
}

export interface ProgramMilestone {
  id: number
  category_id: number
  name: string
  target_distance: number
  description: string
  category_name?: string
  user_progress?: number
  is_achieved?: boolean
}

export interface TeamChallenge {
  id: number
  team_id: number
  category_id: number
  name: string
  description: string
  target_distance: number
  start_date: string
  end_date: string
  is_active: boolean
  category_name?: string
  team_name?: string
  current_progress?: number
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return await sql`SELECT * FROM FitCategories ORDER BY name`
}

export async function createCategory(name: string, description: string, unit = "meters") {
  return await sql`
    INSERT INTO FitCategories (name, description, unit)
    VALUES (${name}, ${description}, ${unit})
    RETURNING *
  `
}

// Users
export async function createUser(externalUserId: string, username: string, email: string, homeTeamId?: number) {
  return await sql`
    INSERT INTO FitUsers (external_user_id, username, email, home_team_id)
    VALUES (${externalUserId}, ${username}, ${email}, ${homeTeamId || null})
    RETURNING *
  `
}

export async function getUserByExternalId(externalUserId: string): Promise<User | null> {
  const users = await sql`
    SELECT * FROM FitUsers WHERE external_user_id = ${externalUserId}
  `
  return users[0] || null
}

// Activity Entries
export async function createActivityEntry(
  userId: number,
  categoryId: number,
  distance: number,
  entryDate: string,
  notes?: string,
) {
  return await sql`
    INSERT INTO FitActivityEntries (user_id, category_id, distance, entry_date, notes)
    VALUES (${userId}, ${categoryId}, ${distance}, ${entryDate}, ${notes || null})
    RETURNING *
  `
}

export async function getUserActivityEntries(userId: number, limit = 50): Promise<ActivityEntry[]> {
  return await sql`
    SELECT ae.*, c.name as category_name
    FROM FitActivityEntries ae
    JOIN FitCategories c ON ae.category_id = c.id
    WHERE ae.user_id = ${userId}
    ORDER BY ae.entry_date DESC, ae.created_at DESC
    LIMIT ${limit}
  `
}

export async function getUserProgressByCategory(
  userId: number,
): Promise<{ category_id: number; category_name: string; total_distance: number }[]> {
  return await sql`
    SELECT 
      c.id as category_id,
      c.name as category_name,
      COALESCE(SUM(ae.distance::numeric), 0)::integer as total_distance
    FROM FitCategories c
    LEFT JOIN FitActivityEntries ae ON c.id = ae.category_id AND ae.user_id = ${userId}
    GROUP BY c.id, c.name
    ORDER BY c.name
  `
}

// Personal Goals
export async function createPersonalGoal(
  userId: number,
  categoryId: number,
  goalType: string,
  targetDistance: number,
  startDate: string,
  endDate?: string,
) {
  return await sql`
    INSERT INTO FitPersonalGoals (user_id, category_id, goal_type, target_distance, start_date, end_date)
    VALUES (${userId}, ${categoryId}, ${goalType}, ${targetDistance}, ${startDate}, ${endDate || null})
    RETURNING *
  `
}

export async function getUserPersonalGoals(userId: number): Promise<PersonalGoal[]> {
  return await sql`
    SELECT pg.*, c.name as category_name
    FROM FitPersonalGoals pg
    JOIN FitCategories c ON pg.category_id = c.id
    WHERE pg.user_id = ${userId} AND pg.is_active = true
    ORDER BY pg.created_at DESC
  `
}

// Program Milestones
export async function getProgramMilestonesWithProgress(userId: number): Promise<ProgramMilestone[]> {
  return await sql`
    SELECT 
      pm.*,
      c.name as category_name,
      COALESCE(SUM(ae.distance), 0) as user_progress,
      CASE WHEN COALESCE(SUM(ae.distance), 0) >= pm.target_distance THEN true ELSE false END as is_achieved
    FROM FitProgramMilestones pm
    JOIN FitCategories c ON pm.category_id = c.id
    LEFT JOIN FitActivityEntries ae ON pm.category_id = ae.category_id AND ae.user_id = ${userId}
    GROUP BY pm.id, c.name
    ORDER BY pm.category_id, pm.target_distance
  `
}

// Teams
export async function getTeams(): Promise<Team[]> {
  return await sql`SELECT * FROM FitTeams ORDER BY name`
}

export async function createTeam(
  name: string,
  description: string,
  inviteCode: string,
  isHomeTeam = false,
  createdBy: number,
) {
  return await sql`
    INSERT INTO FitTeams (name, description, invite_code, is_home_team, created_by)
    VALUES (${name}, ${description}, ${inviteCode}, ${isHomeTeam}, ${createdBy})
    RETURNING *
  `
}

export async function joinTeamByInviteCode(userId: number, inviteCode: string) {
  const team = await sql`SELECT id FROM FitTeams WHERE invite_code = ${inviteCode}`
  if (team.length === 0) throw new Error("Invalid invite code")

  return await sql`
    INSERT INTO FitTeamMemberships (user_id, team_id)
    VALUES (${userId}, ${team[0].id})
    ON CONFLICT (user_id, team_id) DO NOTHING
    RETURNING *
  `
}

export async function getUserTeams(userId: number): Promise<Team[]> {
  return await sql`
    SELECT t.*
    FROM FitTeams t
    JOIN FitTeamMemberships tm ON t.id = tm.team_id
    WHERE tm.user_id = ${userId}
    ORDER BY t.is_home_team DESC, t.name
  `
}

// Team Challenges
export async function createTeamChallenge(
  teamId: number,
  categoryId: number,
  name: string,
  description: string,
  targetDistance: number,
  startDate: string,
  endDate: string,
  createdBy: number,
) {
  return await sql`
    INSERT INTO FitTeamChallenges (team_id, category_id, name, description, target_distance, start_date, end_date, created_by)
    VALUES (${teamId}, ${categoryId}, ${name}, ${description}, ${targetDistance}, ${startDate}, ${endDate}, ${createdBy})
    RETURNING *
  `
}

export async function getTeamChallenges(userId: number): Promise<TeamChallenge[]> {
  return await sql`
    SELECT 
      tc.*,
      t.name as team_name,
      c.name as category_name,
      COALESCE(SUM(ae.distance), 0) as current_progress
    FROM FitTeamChallenges tc
    JOIN FitTeams t ON tc.team_id = t.id
    JOIN FitCategories c ON tc.category_id = c.id
    JOIN FitTeamMemberships tm ON t.id = tm.team_id
    LEFT JOIN FitActivityEntries ae ON tc.category_id = ae.category_id 
      AND ae.user_id IN (
        SELECT tm2.user_id FROM FitTeamMemberships tm2 WHERE tm2.team_id = tc.team_id
      )
      AND ae.entry_date >= tc.start_date 
      AND ae.entry_date <= tc.end_date
    WHERE tm.user_id = ${userId} AND tc.is_active = true
    GROUP BY tc.id, t.name, c.name
    ORDER BY tc.end_date ASC
  `
}

// Leaderboards
export async function getCategoryLeaderboard(categoryId: number, limit = 10) {
  return await sql`
    SELECT 
      u.username,
      SUM(ae.distance) as total_distance,
      COUNT(ae.id) as total_entries
    FROM FitUsers u
    JOIN FitActivityEntries ae ON u.id = ae.user_id
    WHERE ae.category_id = ${categoryId}
    GROUP BY u.id, u.username
    ORDER BY total_distance DESC
    LIMIT ${limit}
  `
}

export async function getTeamLeaderboard(teamId: number, categoryId: number) {
  return await sql`
    SELECT 
      u.username,
      SUM(ae.distance) as total_distance,
      COUNT(ae.id) as total_entries
    FROM FitUsers u
    JOIN FitTeamMemberships tm ON u.id = tm.user_id
    JOIN FitActivityEntries ae ON u.id = ae.user_id
    WHERE tm.team_id = ${teamId} AND ae.category_id = ${categoryId}
    GROUP BY u.id, u.username
    ORDER BY total_distance DESC
  `
}
