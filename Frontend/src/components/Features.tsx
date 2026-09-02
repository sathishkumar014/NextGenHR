import { Sparkles, BarChart2, Lightbulb, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Adaptive AI Questioning",
    description: "No fixed scripts. The AI asks follow-up questions based on how you respond — just like a real interviewer.",
  },
  {
    icon: BarChart2,
    title: "Holistic Performance Scoring",
    description: "We don't just score answers. We evaluate knowledge, communication, confidence, and emotions together.",
  },
  {
    icon: Lightbulb,
    title: "Explainable AI Feedback",
    description: "You won't just see scores. You'll understand why you got them and how to improve.",
  },
  {
    icon: Shield,
    title: "Fair & Transparent Evaluation",
    description: "Bias-aware models ensure feedback is fair, consistent, and transparent across all users.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Makes NextGen HR Different
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for real results, not just practice
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;