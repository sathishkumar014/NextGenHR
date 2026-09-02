import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  Video, 
  Mic, 
  User, 
  Briefcase, 
  BarChart3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

const interviewTypes = [
  { id: "hr", label: "HR Interview", description: "Behavioral & soft skills" },
  { id: "technical", label: "Technical Interview", description: "Domain-specific questions" },
  { id: "mixed", label: "Mixed Interview", description: "Comprehensive evaluation" },
];

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "QA Engineer",
  "SDET (Test Automation Engineer)",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Prompt Engineer",
  "Product Manager",
  "Project Manager",
  "UX Designer",
  "UI Designer",
  "Marketing Manager",
  "Sales Executive",
  "HR Manager",
  "Business Analyst",
  "DevOps Engineer",
  "Data Scientist",
];

const difficultyLevels = [
  { id: "beginner", label: "Beginner", description: "Entry-level questions" },
  { id: "intermediate", label: "Intermediate", description: "Mid-level complexity" },
  { id: "advanced", label: "Advanced", description: "Senior-level challenges" },
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "pending">("pending");

  const checkPermissions = async () => {
    // Simulated permission check for UI demo
    setCameraPermission("granted");
    setMicPermission("granted");
  };

  const isReady = interviewType && role && difficulty && cameraPermission === "granted" && micPermission === "granted";
  const startInterview = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    const response = await fetch(getApiUrl("/interview/create"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        role: role,
        interview_type: interviewType,
        difficulty: difficulty
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
  "interview",
  JSON.stringify({ id: data.interview_id })
);
      navigate("/interview");
    } else {
      alert("Failed to start interview");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground hover:text-foreground transition-colors">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg">NextGen HR</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Interview Setup
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Configure Your Interview
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Customize your AI interview experience for the best results
            </p>
          </div>

          {/* Setup Form */}
          <div className="space-y-8">
            {/* Interview Type */}
            <div className="bg-card rounded-2xl border border-border p-6 card-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Interview Type</h2>
                  <p className="text-sm text-muted-foreground">Select the type of interview you want to practice</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {interviewTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setInterviewType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      interviewType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div className="bg-card rounded-2xl border border-border p-6 card-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Role Selection</h2>
                  <p className="text-sm text-muted-foreground">Choose the role you're preparing for</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                      role === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="bg-card rounded-2xl border border-border p-6 card-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Difficulty Level</h2>
                  <p className="text-sm text-muted-foreground">Select the challenge level</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setDifficulty(level.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      difficulty === level.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{level.label}</h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-card rounded-2xl border border-border p-6 card-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Device Permissions</h2>
                  <p className="text-sm text-muted-foreground">Grant access to camera and microphone</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  cameraPermission === "granted" ? "border-green-500/50 bg-green-500/10" : 
                  cameraPermission === "denied" ? "border-destructive/50 bg-destructive/10" :
                  "border-border bg-secondary/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <Video className={`w-5 h-5 ${
                      cameraPermission === "granted" ? "text-green-500" : 
                      cameraPermission === "denied" ? "text-destructive" : "text-muted-foreground"
                    }`} />
                    <span className="font-medium">Camera</span>
                  </div>
                  {cameraPermission === "granted" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : cameraPermission === "denied" ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                </div>
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  micPermission === "granted" ? "border-green-500/50 bg-green-500/10" : 
                  micPermission === "denied" ? "border-destructive/50 bg-destructive/10" :
                  "border-border bg-secondary/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <Mic className={`w-5 h-5 ${
                      micPermission === "granted" ? "text-green-500" : 
                      micPermission === "denied" ? "text-destructive" : "text-muted-foreground"
                    }`} />
                    <span className="font-medium">Microphone</span>
                  </div>
                  {micPermission === "granted" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : micPermission === "denied" ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                </div>
              </div>
              {(cameraPermission === "pending" || micPermission === "pending") && (
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={checkPermissions}
                >
                  Grant Permissions
                </Button>
              )}
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
<Button
  variant="hero"
  size="xl"
  className="group min-w-64"
  disabled={!isReady}
  onClick={startInterview}
>
  Start Interview
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</Button>
              {!isReady && (
                <p className="text-sm text-muted-foreground mt-4">
                  Complete all fields and grant permissions to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSetup;
