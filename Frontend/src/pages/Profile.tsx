import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  Zap,
  ArrowRight,
  Brain,
  MessageSquare,
  TrendingUp,
  Heart,
  Calendar,
  Home,
  type LucideIcon,
} from "lucide-react";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";
import { getApiUrl } from "@/lib/api";

interface StoredUser {
  id?: string | number;
  name?: string;
  email?: string;
}

interface InterviewHistoryApiRow {
  id: string | number;
  role?: string | null;
  interview_type?: string | null;
  created_at?: string | null;
  overall_score?: number | string | null;
  knowledge_score?: number | string | null;
  communication_score?: number | string | null;
  confidence_score?: number | string | null;
  emotion_score?: number | string | null;
  strengths?: unknown;
  improvements?: unknown;
}

interface InterviewHistoryItem {
  id: string | number;
  role: string;
  type: string;
  date: string;
  overall: number;
  knowledge: number;
  communication: number;
  confidence: number;
  emotion: number;
  strengths: string[];
  improvements: string[];
}

const clampScore = (value: unknown): number => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const formatDate = (value?: string | null): string => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatInterviewType = (value?: string | null): string => {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const parseTextList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean);
      }
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }

  return [];
};

const ScoreBar = ({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: LucideIcon;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold">{score}%</span>
    </div>
    <div className="h-2 rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-700"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const Profile = () => {
  const user = useMemo<StoredUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadInterviewHistory = async () => {
      if (!user?.id) {
        setErrorMessage("Login is required to view profile analytics.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl(`/interview/history/${user.id}`));
        const data = (await response.json()) as InterviewHistoryApiRow[] | { error?: string };

        if (!response.ok) {
          const message =
            typeof data === "object" && data && "error" in data
              ? data.error || "Failed to load interview history."
              : "Failed to load interview history.";
          throw new Error(message);
        }

        const rows = Array.isArray(data) ? data : [];
        const normalized = rows.map((row): InterviewHistoryItem => {
          const overall = clampScore(row.overall_score);

          return {
            id: row.id,
            role: row.role || "Unknown Role",
            type: formatInterviewType(row.interview_type),
            date: formatDate(row.created_at),
            overall,
            knowledge: clampScore(row.knowledge_score ?? overall),
            communication: clampScore(row.communication_score ?? overall),
            confidence: clampScore(row.confidence_score ?? overall),
            emotion: clampScore(row.emotion_score ?? overall),
            strengths: parseTextList(row.strengths),
            improvements: parseTextList(row.improvements),
          };
        });

        setInterviews(normalized);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to load interview history:", error);
        setErrorMessage("Could not load interview history from database.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviewHistory();
  }, [user]);

  const latestInterview = interviews[0];
  const avgOverall = interviews.length
    ? Math.round(interviews.reduce((sum, item) => sum + item.overall, 0) / interviews.length)
    : 0;
  const bestScore = interviews.length ? Math.max(...interviews.map((item) => item.overall)) : 0;
  const overallImprovement =
    interviews.length > 1
      ? interviews[0].overall - interviews[interviews.length - 1].overall
      : 0;
  const overallImprovementLabel = `${overallImprovement > 0 ? "+" : ""}${overallImprovement}%`;

  const performanceData = useMemo(
    () =>
      [...interviews].reverse().map((item, index) => ({
        name: `#${index + 1}`,
        score: item.overall,
      })),
    [interviews]
  );

  const averageMetric = (selector: (item: InterviewHistoryItem) => number): number => {
    if (!interviews.length) {
      return 0;
    }
    return Math.round(interviews.reduce((sum, item) => sum + selector(item), 0) / interviews.length);
  };

  const radarData = [
    { subject: "Knowledge", value: averageMetric((item) => item.knowledge) },
    { subject: "Communication", value: averageMetric((item) => item.communication) },
    { subject: "Confidence", value: averageMetric((item) => item.confidence) },
    { subject: "Emotion", value: averageMetric((item) => item.emotion) },
    {
      subject: "Problem Solving",
      value: averageMetric((item) => Math.round((item.knowledge + item.confidence) / 2)),
    },
  ];

  const insightItems = useMemo(() => {
    if (!latestInterview) {
      return ["Complete an interview to view AI insights from the database."];
    }

    const strengths = latestInterview.strengths
      .slice(0, 2)
      .map((insight) => `✔ ${insight}`);
    const improvements = latestInterview.improvements
      .slice(0, 2)
      .map((insight) => `⚠ ${insight}`);
    const merged = [...strengths, ...improvements];

    if (!merged.length) {
      return [`✔ Latest interview overall score: ${latestInterview.overall}/100`];
    }

    return merged;
  }, [latestInterview]);

  const above80Count = interviews.filter((item) => item.overall >= 80).length;
  const confidenceImprovement =
    interviews.length > 1
      ? interviews[0].confidence - interviews[interviews.length - 1].confidence
      : 0;

  const achievements = [
    above80Count > 0
      ? `🏆 Scored above 80 in ${above80Count} interview${above80Count > 1 ? "s" : ""}`
      : "🏆 Keep practicing to reach 80+ scores",
    `🔥 Completed ${interviews.length} mock interview${interviews.length === 1 ? "" : "s"}`,
    interviews.length > 1
      ? `📈 Confidence ${confidenceImprovement >= 0 ? "improved" : "shifted"} by ${Math.abs(
          confidenceImprovement
        )}%`
      : "📈 Complete more interviews to track confidence trend",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">NextGen HR</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/interview-setup">
                <Button variant="hero" size="sm">
                  New Interview
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border p-8 card-glow mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold mb-1">{user?.name || "Candidate"}</h1>

                {/* Skill Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  {["React", "Python", "Machine Learning", "SQL"].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 text-muted-foreground text-sm mt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {user?.email || "No email"}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {latestInterview?.role || "Software Engineer"}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{avgOverall}</div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </div>

          {/* Analytics Summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="text-3xl font-bold">{interviews.length}</div>
              <div className="text-sm text-muted-foreground">Total Interviews</div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="text-3xl font-bold text-primary">{bestScore}%</div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="text-3xl font-bold">{overallImprovementLabel}</div>
              <div className="text-sm text-muted-foreground">Improvement</div>
            </div>
          </div>

          {/* Performance Growth */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Performance Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <Line type="monotone" dataKey="score" stroke="currentColor" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Strength */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Skill Strength</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  dataKey="value"
                  stroke="currentColor"
                  fill="currentColor"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">AI Insights</h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {insightItems.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Achievements</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {achievements.map((achievement) => (
                <div key={achievement} className="p-4 rounded-lg bg-primary/10 text-primary">
                  {achievement}
                </div>
              ))}
            </div>
          </div>

          {/* Interview History */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold mb-6">Interview History</h2>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading interview history...</p>
            ) : errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : interviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No interviews found yet. Complete one interview to populate this section.
              </p>
            ) : (
              <div className="space-y-6">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-6 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{interview.role}</h3>
                        <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            {interview.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {interview.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {interview.overall}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <ScoreBar label="Knowledge" score={interview.knowledge} icon={Brain} />
                      <ScoreBar
                        label="Communication"
                        score={interview.communication}
                        icon={MessageSquare}
                      />
                      <ScoreBar label="Confidence" score={interview.confidence} icon={TrendingUp} />
                      <ScoreBar
                        label="Emotion Stability"
                        score={interview.emotion}
                        icon={Heart}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
