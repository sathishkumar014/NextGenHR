import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  RotateCcw,
  Trophy,
  Brain,
  MessageSquare,
  Heart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Home,
  Loader2,
  type LucideIcon,
} from "lucide-react";

type ScoreCategory =
  | "overall"
  | "knowledge"
  | "communication"
  | "confidence"
  | "emotion";

type Scores = Record<ScoreCategory, number>;

interface Suggestion {
  title: string;
  description: string;
}

interface AnalysisResult {
  scores: Scores;
  strengths: string[];
  improvements: string[];
  suggestions: Suggestion[];
}

const fallbackSuggestions: Suggestion[] = [
  {
    title: "Practice STAR Method",
    description:
      "Structure your answers using Situation, Task, Action, Result format.",
  },
  {
    title: "Record & Review",
    description:
      "Review your speaking pace and clarity from mock interview recordings.",
  },
  {
    title: "Research Company",
    description:
      "Prepare examples aligned with company values and role requirements.",
  },
];

const clampScore = (value: unknown): number => {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(numericValue)));
};

const normalizeTextList = (
  value: unknown,
  fallbackText: string
): string[] => {
  if (!Array.isArray(value)) {
    return [fallbackText];
  }

  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return normalized.length ? normalized : [fallbackText];
};

const normalizeSuggestions = (value: unknown): Suggestion[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      title: typeof item?.title === "string" ? item.title.trim() : "",
      description:
        typeof item?.description === "string" ? item.description.trim() : "",
    }))
    .filter((item) => item.title && item.description);
};

const normalizeResult = (value: any): AnalysisResult => ({
  scores: {
    overall: clampScore(value?.scores?.overall),
    knowledge: clampScore(value?.scores?.knowledge),
    communication: clampScore(value?.scores?.communication),
    confidence: clampScore(value?.scores?.confidence),
    emotion: clampScore(value?.scores?.emotion),
  },
  strengths: normalizeTextList(
    value?.strengths,
    "No strengths were returned by the analysis."
  ),
  improvements: normalizeTextList(
    value?.improvements,
    "No improvement areas were returned by the analysis."
  ),
  suggestions: normalizeSuggestions(value?.suggestions),
});

const ScoreRing = ({
  score,
  label,
  icon: Icon,
}: {
  score: number;
  label: string;
  icon: LucideIcon;
}) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-border"
          />
          <circle
            cx="56"
            cy="56"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

const Results = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("interview_analysis");
    const storedError = localStorage.getItem("interview_analysis_error");

    if (!storedAnalysis) {
      setErrorMessage(
        storedError || "No report available. Please complete an interview first."
      );
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedAnalysis);
      setAnalysis(normalizeResult(parsed));
      setErrorMessage(null);
      localStorage.removeItem("interview_analysis_error");
    } catch (error) {
      console.error("Failed to parse interview analysis:", error);
      setErrorMessage("Failed to load your report. Please try another interview.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const suggestionsWithIcons = useMemo(() => {
    const iconCycle: LucideIcon[] = [Brain, MessageSquare, TrendingUp];
    const baseSuggestions =
      analysis?.suggestions.length && analysis.suggestions.length > 0
        ? analysis.suggestions
        : fallbackSuggestions;

    return baseSuggestions.slice(0, 3).map((suggestion, index) => ({
      ...suggestion,
      icon: iconCycle[index % iconCycle.length],
    }));
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your interview report...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Report unavailable</h1>
          <p className="text-muted-foreground mb-6">
            {errorMessage || "We couldn&apos;t generate your report."}
          </p>
          <Link to="/interview-setup">
            <Button variant="hero" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Another Interview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg">NextGen HR</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Interview Complete
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your Performance Report
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Here&apos;s your AI-generated analysis based on your interview answers.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 mb-8 card-glow">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-48 h-48 relative">
                <svg className="w-48 h-48 -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-border"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={
                      2 * Math.PI * 80 -
                      (analysis.scores.overall / 100) * 2 * Math.PI * 80
                    }
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">
                    {analysis.scores.overall}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Overall Score
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
              <ScoreRing
                score={analysis.scores.knowledge}
                label="Knowledge"
                icon={Brain}
              />
              <ScoreRing
                score={analysis.scores.communication}
                label="Communication"
                icon={MessageSquare}
              />
              <ScoreRing
                score={analysis.scores.confidence}
                label="Confidence"
                icon={TrendingUp}
              />
              <ScoreRing
                score={analysis.scores.emotion}
                label="Emotional Stability"
                icon={Heart}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-muted/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Areas for Improvement</h2>
            </div>
            <ul className="space-y-3">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 mb-8 card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Actionable Suggestions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestionsWithIcons.map((suggestion, index) => {
              const Icon = suggestion.icon;

              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors"
                >
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to improve?</h3>
          <p className="text-muted-foreground mb-6">
            Practice makes perfect. Try another interview to track your progress.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/interview-setup">
              <Button variant="hero" size="lg" className="group">
                <RotateCcw className="w-5 h-5 mr-2" />
                Practice Again
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Back to Home
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
