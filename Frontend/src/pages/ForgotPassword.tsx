import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Reset link sent (Demo UI)");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-16 pb-20 px-4">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password</h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter your email to receive reset instructions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
