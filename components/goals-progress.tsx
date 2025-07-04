import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserPersonalGoals, getProgramMilestonesWithProgress } from "@/lib/database"
import { Plus, Target, Trophy } from "lucide-react"
import { format } from "date-fns"

// Mock user ID for demo
const MOCK_USER_ID = 1

export async function GoalsProgress() {
  const [personalGoals, milestones] = await Promise.all([
    getUserPersonalGoals(MOCK_USER_ID),
    getProgramMilestonesWithProgress(MOCK_USER_ID),
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Goals</CardTitle>
            <CardDescription>Your custom targets and objectives</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent>
          {personalGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No personal goals set</p>
              <p className="text-sm">Create your first goal to start tracking progress!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {personalGoals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{goal.category_name}</h4>
                    <Badge variant="outline" className="capitalize">
                      {goal.goal_type}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.target_distance.toLocaleString()}m target</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(goal.start_date), "MMM d, yyyy")} -{" "}
                    {goal.end_date ? format(new Date(goal.end_date), "MMM d, yyyy") : "Ongoing"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program Milestones</CardTitle>
          <CardDescription>Achievement levels across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{milestone.name}</h4>
                  {milestone.is_achieved && (
                    <Badge variant="secondary">
                      <Trophy className="h-3 w-3 mr-1" />
                      Achieved
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{milestone.category_name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{milestone.user_progress?.toLocaleString() || 0}m</span>
                    <span>{milestone.target_distance.toLocaleString()}m</span>
                  </div>
                  <Progress
                    value={Math.min(((milestone.user_progress || 0) / milestone.target_distance) * 100, 100)}
                    className="h-2"
                  />
                </div>
                {milestone.description && <p className="text-xs text-muted-foreground">{milestone.description}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
