import { useState } from "react";
import { Helmet } from "react-helmet-async";
import BrandHeader from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { invokeFunction } from "@/lib/edge-functions";

const Interview = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onReview = async () => {
    if (!answer) {
      toast({ title: "Missing answer", description: "Paste your response to get feedback." });
      return;
    }
    setLoading(true);
    setResult(null);
    const { data, error } = await invokeFunction<{ text: string }>("gemini-coach", { mode: "interview_review", question, answer });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message });
      return;
    }
    setResult(data?.text ?? "No response");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Interview Response Review – AI Career Coach</title>
        <meta name="description" content="Get constructive feedback to improve clarity, relevance, and confidence in your interview answers." />
        <link rel="canonical" href={window.location.origin + "/interview"} />
      </Helmet>
      <BrandHeader />
      <main className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Interview Response Review</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Interview Question (optional)</label>
              <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="Paste the question if you have it..." />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Your Answer</label>
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={10} placeholder="Paste your answer for review..." />
            </div>
            <div>
              <Button onClick={onReview} disabled={loading}>{loading ? "Reviewing..." : "Get Feedback"}</Button>
            </div>
            {result && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h3>Feedback</h3>
                <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-4 text-sm">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Interview;
