import { MessageSquare, BarChart3, Brain } from "lucide-react";

const ValueProposition = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section intro */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Interviews are stressful.
              <br />
              <span className="text-muted-foreground">Preparation shouldn't be.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most mock interview platforms only check <span className="text-foreground font-medium">what you say</span>.
              Real interviews judge <span className="text-foreground font-medium">how you say it</span>.
            </p>
          </div>

          {/* Feature highlight */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 card-glow">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                NextGen HR Advantage
              </span>
              <h3 className="text-2xl md:text-3xl font-bold">
                We go deeper than surface-level feedback.
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">What You Say</h4>
                <p className="text-muted-foreground text-sm">
                  Answer quality, relevance, structure, and depth of knowledge
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">How You Speak</h4>
                <p className="text-muted-foreground text-sm">
                  Tone, pace, clarity, confidence, and vocal patterns
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">How You React</h4>
                <p className="text-muted-foreground text-sm">
                  Body language, expressions, eye contact, and composure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;