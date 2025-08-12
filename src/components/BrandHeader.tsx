import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const BrandHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-glow))] shadow-[var(--shadow-glow)]" />
          <span className="text-lg font-semibold tracking-tight">AI Career Coach</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/dashboard"><Button variant="secondary" size="sm">Dashboard</Button></Link>
          <Link to="/analyze"><Button variant="secondary" size="sm">Analyze</Button></Link>
          <Link to="/interview"><Button variant="secondary" size="sm">Interview</Button></Link>
          <Link to="/cover-letter"><Button size="sm">Cover Letter</Button></Link>
          <Link to="/auth"><Button variant="outline" size="sm">Sign in</Button></Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default BrandHeader;
