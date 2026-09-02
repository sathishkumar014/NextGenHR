import { Mic } from "lucide-react";

interface MicWaveformProps {
  isActive: boolean;
}

const MicWaveform = ({ isActive }: MicWaveformProps) => {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary/50">
      <Mic className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <div className="flex items-end gap-0.5 h-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all ${
              isActive ? "bg-primary animate-waveform" : "bg-muted-foreground/30 h-1"
            }`}
            style={
              isActive
                ? {
                    animationDelay: `${i * 100}ms`,
                    animationDuration: `${600 + i * 80}ms`,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MicWaveform;
