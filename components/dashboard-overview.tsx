import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getUserProgressByCategory, getProgramMilestonesWithProgress } from "@/lib/database"
import { Activity, Target, Trophy, Users } from "lucide-react"

// Mock user ID for demo - in real app this would come from auth
const MOCK_USER_ID = 1

export async function DashboardOverview() {
  const [categoryProgress, milestones] = await Promise.all([
    getUserProgressByCategory(MOCK_USER_ID),
    getProgramMilestonesWithProgress(MOCK_USER_ID),
  ])

  const totalDistance = categoryProgress.reduce((sum, cat) => sum + cat.total_distance, 0)
  const achievedMilestones = milestones.filter((m) => m.is_achieved).length

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDistance.toLocaleString()}m</div>
          <p className="text-xs text-muted-foreground">Across all categories</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milestones Achieved</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{achievedMilestones}</div>
          <p className="text-xs text-muted-foreground">Out of {milestones.length} total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Personal targets set</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Challenges</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">Currently participating</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Progress by Category</CardTitle>
          <CardDescription>Your total distance in each activity type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryProgress.map((category) => (
            <div key={category.category_id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{category.category_name}</div>
                <div className="text-sm text-muted-foreground">{category.total_distance.toLocaleString()}m</div>
              </div>
              <Progress value={Math.min((category.total_distance / 100000) * 100, 100)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Milestones</CardTitle>
          <CardDescription>Your progress towards program achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {milestones.slice(0, 6).map((milestone) => (
              <div key={milestone.id} className="space-y-2 p-4 border rounded-lg">
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
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{milestone.user_progress?.toLocaleString() || 0}m</span>
                    <span>{milestone.target_distance.toLocaleString()}m</span>
                  </div>
                  <Progress
                    value={Math.min(((milestone.user_progress || 0) / milestone.target_distance) * 100, 100)}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
