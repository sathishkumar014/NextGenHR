import { CheckCircle2 } from "lucide-react";

const learnings = [
  "How strong your answers really were",
  "Whether your confidence matched your words",
  "How your tone and expressions affected perception",
  "Exactly what to improve before the real interview",
];

const audiences = [
  "College students preparing for placements",
  "Job seekers facing technical or HR interviews",
  "Anyone who wants realistic interview practice",
];

const WhatYouLearn = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* What you'll learn */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              After Each Session
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What You'll Learn From Each Interview
            </h2>
            <div className="space-y-4">
              {learnings.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Who is this for */}
          <div className="bg-card rounded-2xl border border-border p-8 card-glow">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-foreground text-sm font-medium mb-4">
              Who Is This For?
            </span>
            <h3 className="text-2xl font-bold mb-6">
              Built for real people preparing for real interviews
            </h3>
            <div className="space-y-4">
              {audiences.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouLearn;