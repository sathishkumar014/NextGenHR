import { useEffect, useRef } from "react";
import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/pages/LiveInterview";

interface InterviewChatProps {
  messages: ChatMessage[];
}

const InterviewChat = ({ messages }: InterviewChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-card rounded-2xl border border-border card-glow flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold text-sm">Conversation History</h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === "ai"
                  ? "bg-primary/10"
                  : "bg-secondary"
              }`}
            >
              {msg.role === "ai" ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-secondary/50 border border-border text-foreground"
                  : "bg-primary/10 border border-primary/20 text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewChat;
