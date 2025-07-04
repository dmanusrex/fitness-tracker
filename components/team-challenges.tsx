import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTeamChallenges } from "@/lib/database"
import { Plus, Users, Calendar, Trophy } from "lucide-react"
import { format, isAfter, isBefore } from "date-fns"

// Mock user ID for demo
const MOCK_USER_ID = 1

export async function TeamChallenges() {
  const challenges = await getTeamChallenges(MOCK_USER_ID)

  const getStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isBefore(now, start)) {
      return <Badge variant="secondary">Upcoming</Badge>
    } else if (isAfter(now, end)) {
      return <Badge variant="outline">Completed</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Challenges</CardTitle>
            <CardDescription>Compete with your teams in group challenges</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No team challenges yet</p>
              <p className="text-sm">Join a team or create a challenge to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-6 border rounded-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{challenge.name}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.team_name}</p>
                    </div>
                    {getStatusBadge(challenge.start_date, challenge.end_date)}
                  </div>

                  {challenge.description && <p className="text-sm text-muted-foreground">{challenge.description}</p>}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {challenge.category_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(challenge.start_date), "MMM d")} -{" "}
                      {format(new Date(challenge.end_date), "MMM d")}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Progress</span>
                      <span>
                        {challenge.current_progress?.toLocaleString() || 0}m /{" "}
                        {challenge.target_distance.toLocaleString()}m
                      </span>
                    </div>
                    <Progress
                      value={Math.min(((challenge.current_progress || 0) / challenge.target_distance) * 100, 100)}
                      className="h-3"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium">
                      {Math.round(((challenge.current_progress || 0) / challenge.target_distance) * 100)}% Complete
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join Team</CardTitle>
          <CardDescription>Enter an invite code to join a new team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input type="text" placeholder="Enter invite code..." className="flex-1 px-3 py-2 border rounded-md" />
            <Button>Join Team</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
