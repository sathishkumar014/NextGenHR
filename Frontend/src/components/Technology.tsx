import { Cpu, AudioWaveform, Eye, Boxes } from "lucide-react";

const techItems = [
  {
    icon: Cpu,
    title: "Large Language Models",
    description: "Dynamic questioning powered by state-of-the-art LLMs",
  },
  {
    icon: AudioWaveform,
    title: "Speech Analysis",
    description: "Real-time confidence and emotion detection from voice",
  },
  {
    icon: Eye,
    title: "Vision AI",
    description: "Facial expression and body language analysis",
  },
  {
    icon: Boxes,
    title: "Multimodal Fusion",
    description: "Holistic scoring combining all signals together",
  },
];

const Technology = () => {
  return (
    <section id="technology" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Cutting-Edge Tech
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              The Technology Behind NextGen HR
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built using modern AI technologies trusted in real-world applications.
              This isn't a demo tool — it's an{" "}
              <span className="text-foreground font-medium">intelligent interview simulation system</span>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {techItems.map((item) => (
              <div
                key={item.title}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;