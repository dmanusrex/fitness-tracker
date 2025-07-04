import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard-overview"
import { ActivityLog } from "@/components/activity-log"
import { GoalsProgress } from "@/components/goals-progress"
import { TeamChallenges } from "@/components/team-challenges"
import { Leaderboards } from "@/components/leaderboards"
import { AddActivityForm } from "@/components/add-activity-form"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fitness Tracker</h1>
        <p className="text-muted-foreground">
          Track your progress across swimming, running, and competition activities
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="activity">Log Activity</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardOverview />
          </Suspense>
          <Suspense fallback={<div>Loading recent activity...</div>}>
            <ActivityLog limit={5} />
          </Suspense>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Log New Activity</CardTitle>
              <CardDescription>Record your training session or competition performance</CardDescription>
            </CardHeader>
            <CardContent>
              <AddActivityForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Suspense fallback={<div>Loading goals...</div>}>
            <GoalsProgress />
          </Suspense>
        </TabsContent>

        <TabsContent value="challenges">
          <Suspense fallback={<div>Loading challenges...</div>}>
            <TeamChallenges />
          </Suspense>
        </TabsContent>

        <TabsContent value="leaderboards">
          <Suspense fallback={<div>Loading leaderboards...</div>}>
            <Leaderboards />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
