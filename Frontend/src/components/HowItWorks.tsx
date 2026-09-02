import { Button } from "@/components/ui/button";
import { UserPlus, Video, Layers, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us your role, domain, and experience level. This helps the AI tailor interview questions just for you.",
  },
  {
    number: "02",
    icon: Video,
    title: "Face an AI Interviewer",
    description: "Experience a realistic interview powered by advanced AI. Questions adapt in real time based on your answers.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Multimodal AI Analysis",
    description: "Your performance is analyzed using Text (answer quality), Audio (tone, confidence), and Video (expressions, eye contact).",
  },
  {
    number: "04",
    icon: FileText,
    title: "Get Clear, Actionable Feedback",
    description: "Receive skill-wise scores, confidence insights, and honest improvement suggestions you can act on immediately.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to interview excellence
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-all duration-300 card-glow"
              >
                {/* Step number */}
                <span className="absolute top-6 right-6 text-6xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.number}
                </span>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-page CTA */}
          <div className="text-center mt-16">
            <Button variant="hero" size="lg" className="group" onClick={() => navigate('/interview-setup')}>
              Try Your First AI Interview – It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required. No signup friction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;