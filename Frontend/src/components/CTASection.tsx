import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Repeat practice message */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <RefreshCw className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Practice. Improve. Succeed.
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to face interviews
            <br />
            <span className="text-gradient">with confidence?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Start your AI-powered mock interview now and see how you truly perform.
            One interview isn't enough — practice as many times as you want.
          </p>

          <Button variant="hero" size="xl" className="group" onClick={() => navigate('/interview-setup')}>
            Start Free AI Mock Interview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card. No pressure. Just practice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;