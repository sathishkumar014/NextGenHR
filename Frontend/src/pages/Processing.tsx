import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AudioWaveform, Video, CheckCircle2, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

const analysisSteps = [
  {
    id: "text",
    icon: FileText,
    label: "Text Analysis",
    description: "Analyzing answer quality & relevance",
  },
  {
    id: "audio",
    icon: AudioWaveform,
    label: "Audio Analysis",
    description: "Processing tone, speed & confidence",
  },
  {
    id: "video",
    icon: Video,
    label: "Video Analysis",
    description: "Evaluating expressions & body language",
  },
];

const stepDurations = [1800, 2400, 2000];

const Processing = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const analyzeInterview = async () => {
      const interview = JSON.parse(localStorage.getItem("interview") || "null");
      const answers = JSON.parse(
        localStorage.getItem("interview_answers") || "[]"
      ) as string[];

      if (!answers.length) {
        throw new Error("No answers available for analysis.");
      }

      const response = await fetch(getApiUrl("/interview/analyze"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interview_id: interview?.id,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis request failed.");
      }

      localStorage.setItem("interview_analysis", JSON.stringify(data));
      localStorage.removeItem("interview_analysis_error");
    };

    const processSteps = async () => {
      const analyzePromise = analyzeInterview().then(
        () => ({ ok: true as const }),
        (error) => ({ ok: false as const, error })
      );

      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, stepDurations[i]));
        setCompletedSteps((prev) => [...prev, analysisSteps[i].id]);
      }

      const analysisResult = await analyzePromise;

      if (!analysisResult.ok) {
        const message =
          analysisResult.error instanceof Error
            ? analysisResult.error.message
            : "Analysis failed.";
        localStorage.removeItem("interview_analysis");
        localStorage.setItem("interview_analysis_error", message);
      }

      setTimeout(() => {
        navigate("/results");
      }, 1000);
    };

    processSteps();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <span className="font-bold text-xl">NextGen HR</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up">
          Analyzing Your Responses...
        </h1>
        <p className="text-muted-foreground text-lg mb-12 animate-fade-in-up delay-100">
          Our multimodal AI is processing your interview performance
        </p>

        {/* Analysis Steps */}
        <div className="space-y-4 mb-12">
          {analysisSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index && !isCompleted;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-6 rounded-2xl border transition-all duration-500 transform ${
                  isCompleted
  ? "bg-primary/10 border-primary/50 scale-[1.02]"
                    : isCurrent
                    ? "bg-card border-primary/30 card-glow"
                    : "bg-card/50 border-border/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary"
                      : isCurrent
                      ? "bg-primary/20"
                      : "bg-secondary"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <step.icon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`font-bold transition-colors ${
                      isCompleted
                        ? "text-primary"
                        : isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {isCompleted && (
                  <span className="text-sm font-medium text-primary">Complete</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">
            {completedSteps.length === analysisSteps.length
              ? "Generating your personalized report..."
              : `Processing ${currentStep + 1} of ${analysisSteps.length} analyses`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Processing;
