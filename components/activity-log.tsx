import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserActivityEntries } from "@/lib/database"
import { format } from "date-fns"
import { Activity, Calendar, FileText } from "lucide-react"

// Mock user ID for demo
const MOCK_USER_ID = 1

interface ActivityLogProps {
  limit?: number
}

export async function ActivityLog({ limit = 10 }: ActivityLogProps) {
  const activities = await getUserActivityEntries(MOCK_USER_ID, limit)

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest training sessions and competitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No activities logged yet</p>
            <p className="text-sm">Start by logging your first training session!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest training sessions and competitions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{activity.category_name}</Badge>
                  <span className="font-medium">{activity.distance.toLocaleString()}m</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(activity.entry_date), "MMM d, yyyy")}
                  </div>
                  {activity.notes && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">{activity.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
