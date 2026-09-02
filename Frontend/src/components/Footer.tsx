import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              NextGen<span className="text-primary">HR</span>
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Virtual Interviewer & Performance Analyzer — Built as an academic innovation project using AI & multimodal learning.
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2026 NextGen HR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;