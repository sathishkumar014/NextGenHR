import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();
  const driveVideoId = "1mL890COxNzitY8_PW954-_sd6cbpMC8w";
  const driveEmbedUrl = `https://drive.google.com/file/d/${driveVideoId}/preview?autoplay=1`;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Trusted by students and job seekers worldwide
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up delay-100">
            Practice Real Interviews.
            <br />
            <span className="text-gradient">Get AI Feedback.</span>
            <br />
            Get Interview-Ready Faster.
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Prepare for real job interviews with an AI-powered mock interviewer that evaluates your{" "}
            <span className="text-foreground font-medium">answers, confidence, communication, and emotions</span>{" "}
            — just like a real HR.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Button variant="hero" size="xl" className="group" onClick={() => navigate('/interview-setup')}>
              Start Free AI Mock Interview
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="group"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="w-5 h-5" />
              See How It Works
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center mt-16 border-t border-border/50 animate-fade-in-up delay-400">
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-background/95 backdrop-blur-xl border-border overflow-hidden">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="aspect-video w-full">
            {isVideoOpen && (
              <iframe
                className="w-full h-full"
                src={driveEmbedUrl}
                title="How NextGen HR Works"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
