import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCategoryLeaderboard } from "@/lib/database"
import { Trophy, Medal, Award } from "lucide-react"

export async function Leaderboards() {
  const [swimmingLeaderboard, runningLeaderboard, competitionLeaderboard] = await Promise.all([
    getCategoryLeaderboard(1, 10), // Swimming
    getCategoryLeaderboard(2, 10), // Running
    getCategoryLeaderboard(3, 10), // Competition
  ])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const LeaderboardTable = ({ data, title }: { data: any[]; title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title} Leaderboard</CardTitle>
        <CardDescription>Top performers in {title.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No data available yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((entry, index) => (
              <div key={entry.username} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getRankIcon(index + 1)}
                  <div>
                    <div className="font-medium">{entry.username}</div>
                    <div className="text-sm text-muted-foreground">{entry.total_entries} activities</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{entry.total_distance.toLocaleString()}m</div>
                  {index < 3 && (
                    <Badge variant="secondary" className="text-xs">
                      Top {index + 1}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="swimming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="swimming">Swimming</TabsTrigger>
        <TabsTrigger value="running">Running</TabsTrigger>
        <TabsTrigger value="competition">Competition</TabsTrigger>
      </TabsList>

      <TabsContent value="swimming">
        <LeaderboardTable data={swimmingLeaderboard} title="Swimming" />
      </TabsContent>

      <TabsContent value="running">
        <LeaderboardTable data={runningLeaderboard} title="Running" />
      </TabsContent>

      <TabsContent value="competition">
        <LeaderboardTable data={competitionLeaderboard} title="Competition" />
      </TabsContent>
    </Tabs>
  )
}
