import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import BrandHeader from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    try {
      // Placeholder until Supabase auth is configured in this project.
      toast({ title: "Auth not configured", description: "Connect Supabase auth to enable sign-in/sign-up." });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sign in – AI Career Coach</title>
        <meta name="description" content="Secure authentication for your AI Career Coach workspace." />
        <link rel="canonical" href={window.location.origin + "/auth"} />
      </Helmet>
      <BrandHeader />
      <main className="container mx-auto flex max-w-md flex-col gap-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={submit} disabled={loading}>{loading ? "Please wait..." : (isSignUp ? "Sign up" : "Sign in")}</Button>
              <Button variant="ghost" onClick={() => setIsSignUp((v) => !v)}>
                {isSignUp ? "Have an account? Sign in" : "New here? Create account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
