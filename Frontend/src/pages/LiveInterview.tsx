import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";
import InterviewChat from "@/components/InterviewChat";
import MicWaveform from "@/components/MicWaveform";
import { getApiUrl } from "@/lib/api";


export interface ChatMessage {
  role: "ai" | "user";
  text: string;
}



const LiveInterview = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
const [selectedVoice, setSelectedVoice] = useState<string>("female");
  const recognitionRef = useRef<any>(null);
const [isRecording, setIsRecording] = useState(false);
const [transcript, setTranscript] = useState("");

// 🔊 Speak Question with selected voice
const speakQuestion = (text: string) => {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

const availableVoices =
  window.speechSynthesis.getVoices().length
    ? window.speechSynthesis.getVoices()
    : voices;

  const voice = availableVoices.find(v =>
    selectedVoice === "male"
      ? v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("david")
      : v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha")
  );

  if (voice) utterance.voice = voice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};





useEffect(() => {
  const timer = setInterval(() => {
    setTimeElapsed((prev) => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);

// ✅ LOAD QUESTIONS WHEN PAGE OPENS
useEffect(() => {
  const loadQuestions = async () => {
    const interview = JSON.parse(localStorage.getItem("interview") || "null");

    if (!interview) {
      alert("Interview session missing");
      return;
    }

    try {
      const res = await fetch(getApiUrl(`/interview/questions/${interview.id}`));

      const data = await res.json();

      if (res.ok && data.length > 0) {
      const questionTexts = data.map((q: { question_text: string }) => q.question_text);

        setQuestions(questionTexts);
        setChatMessages([{ role: "ai", text: questionTexts[0] }]);
        speakQuestion(questionTexts[0]);
      } else {
        alert("No questions found");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load questions");
    }
  };

  loadQuestions();
}, []);

useEffect(() => {
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsVideoOn(false);
    }
  };

  startCamera();

  return () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  };
}, []);

// 🎤 SPEECH RECOGNITION SETUP
useEffect(() => {
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    console.log("Speech recognition not supported");
    return;
  }

  const recognition = new SpeechRecognitionClass();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let text = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }

    setTranscript(text);
  };

  recognition.onend = () => {
  setIsRecording(false);
};

  recognitionRef.current = recognition;
}, []);

// 🔊 Load available voices
useEffect(() => {
  const loadVoices = () => {
    const allVoices = speechSynthesis.getVoices();
    setVoices(allVoices);
  };

  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}, []);

// Simulate AI speaking for 3 seconds when a new question appears
useEffect(() => {
  setIsSpeaking(true);
  const timeout = setTimeout(() => setIsSpeaking(false), 3000);
  return () => clearTimeout(timeout);
}, [currentQuestion]);


  const formatTime = (seconds: number) => {
    // 🔊 AI VOICE: speak question
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

const extractAnswers = (messages: ChatMessage[]) =>
  messages
    .filter((message) => message.role === "user")
    .map((message) => message.text.trim())
    .filter(Boolean);

const persistInterviewAnswers = (pendingTranscript: string) => {
  const normalizedTranscript = pendingTranscript.trim();
  const messagesToPersist = normalizedTranscript
    ? [...chatMessages, { role: "user" as const, text: normalizedTranscript }]
    : chatMessages;

  const answers = extractAnswers(messagesToPersist);
  localStorage.setItem("interview_answers", JSON.stringify(answers));
};

  
const handleNextQuestion = () => {
  if (currentQuestion < questions.length - 1) {

    if (transcript.trim() !== "") {
      setChatMessages(prev => [
        ...prev,
        { role: "user", text: transcript }
      ]);
    }

    setTranscript("");
    setIsThinking(true);

    setTimeout(() => {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);

      setChatMessages(prev => [
        ...prev,
        { role: "ai", text: questions[nextQ] }
      ]);

setTimeout(() => speakQuestion(questions[nextQ]), 100);

      setIsThinking(false);
    }, 1200);
  }
};

 const handleEndInterview = () => {
  window.speechSynthesis.cancel();
  recognitionRef.current?.stop();
  persistInterviewAnswers(transcript);
  navigate("/processing");
};

  
// 🎤 START / STOP RECORDING
const toggleRecording = () => {
  if (!recognitionRef.current) return;

  if (isRecording) {
    recognitionRef.current.stop();
    setIsRecording(false);

    // push spoken answer into chat
    if (transcript.trim() !== "") {
      setChatMessages(prev => [
        ...prev,
        { role: "user", text: transcript }
      ]);
      setTranscript("");
    }

  } else {
    recognitionRef.current.start();
    setIsRecording(true);
  }
};



const toggleCamera = () => {
  if (isVideoOn) {
    streamRef.current?.getTracks().forEach(track => track.stop());
  } else {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;
      });
  }

  setIsVideoOn(!isVideoOn);
};
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg">NextGen HR</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Live Interview</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono font-medium text-primary">{formatTime(timeElapsed)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* AI Interviewer Panel */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            {/* AI Question Card */}
            <div className="bg-card rounded-2xl border border-border p-8 card-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-yellow-dark flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold">AI Interviewer</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      {isThinking ? "Thinking..." : isSpeaking ? "Speaking" : "Listening"}
                    </span>
                  </div>
                </div>
                <MicWaveform isActive={isSpeaking && !isThinking} />
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
<select
  className="text-xs bg-secondary px-2 py-1 rounded"
  value={selectedVoice}
  onChange={(e) => setSelectedVoice(e.target.value)}
>
  <option value="female">Female Voice</option>
  <option value="male">Male Voice</option>
</select>
                </button>
              </div>

              <div className="relative">
                {isThinking ? (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                 <p className="text-xl md:text-2xl font-medium leading-relaxed">
                {questions.length > 0 ? `"${questions[currentQuestion]}"` : "Loading..."}
                </p>

                )}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index < currentQuestion
                      ? "bg-primary"
                      : index === currentQuestion
                      ? "bg-primary/50"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="hero"
                size="lg"
                className="flex-1 group"
                onClick={handleNextQuestion}
                disabled={currentQuestion >= questions.length - 1 || isThinking}
              >
                Next Question
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="px-8"
                onClick={handleEndInterview}
              >
                End Interview
              </Button>
            </div>

            {/* Chat History */}
            <InterviewChat messages={chatMessages} />
          </div>

          {/* Candidate Panel */}
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden card-glow">
              <div className="aspect-[4/3] bg-secondary relative flex items-center justify-center">
                {isVideoOn ? (
  <>
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
    />

    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-sm font-medium">Live</span>
    </div>
  </>
) : (
  <div className="text-center">
    <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
    <p className="text-sm text-muted-foreground">Camera Off</p>
  </div>
)}

              </div>
              <div className="p-4 flex justify-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                  isRecording
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }`}
                >
                {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isVideoOn
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }`}
                >
                  {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-card rounded-2xl border border-border p-6 card-glow">
              <h3 className="font-bold mb-4">Recording Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Audio</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-green-500 animate-pulse" : "bg-destructive"}`} />
                    <span className={`text-sm font-medium ${isMicOn ? "text-green-500" : "text-destructive"}`}>
                    {isRecording ? "Recording" : "Stopped"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Video</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isVideoOn ? "bg-green-500 animate-pulse" : "bg-destructive"}`} />
                    <span className={`text-sm font-medium ${isVideoOn ? "text-green-500" : "text-destructive"}`}>
                      {isVideoOn ? "Recording" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Analysis</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-bold text-primary mb-2">💡 Quick Tip</h3>
              <p className="text-sm text-muted-foreground">
                Maintain eye contact with the camera and speak clearly. The AI analyzes both your verbal and non-verbal cues.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveInterview;
