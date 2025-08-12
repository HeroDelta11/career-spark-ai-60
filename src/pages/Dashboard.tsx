import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BrandHeader from "@/components/BrandHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMetrics, type Metrics } from "@/lib/metrics";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metrics>({});
  useEffect(() => {
    setMetrics(getMetrics());
  }, []);

  const score = metrics.resumeScore ?? undefined;
  const last = metrics.lastAnalyzeAt ? new Date(metrics.lastAnalyzeAt).toLocaleString() : "—";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard – AI Career Coach</title>
        <meta name="description" content="See your latest resume score and total cover letters created." />
        <link rel="canonical" href={window.location.origin + "/dashboard"} />
      </Helmet>
      <BrandHeader />
      <main className="container mx-auto py-10 grid gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Last Resume Score</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              {score !== undefined ? `${score}` : "N/A"}
              <div className="mt-2 text-sm text-muted-foreground">Last analyzed: {last}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cover Letters Created</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">
              {metrics.coverLettersCreated ?? 0}
              <div className="mt-2 text-sm text-muted-foreground">Total generated on this device</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link to="/analyze"><Button variant="secondary">Analyze Resume</Button></Link>
              <Link to="/cover-letter"><Button>New Cover Letter</Button></Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
