import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            NextGen<span className="text-primary">HR</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            How It Works
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Features
          </a>
          <a href="#technology" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Technology
          </a>
        </div>

<div className="flex items-center gap-3">

  {user ? (
    <>
      <span className="hidden md:block text-sm font-medium">
        Hi, {user.name}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/profile')}
      >
        Profile
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          localStorage.removeItem("user");
          navigate('/');
          window.location.reload();
        }}
      >
        Logout
      </Button>
    </>
  ) : (
    <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
      Log In
    </Button>
  )}

         <Button
  variant="hero"
  size="sm"
  onClick={() => {
    if (user) {
      navigate('/interview-setup');
    } else {
      navigate('/signup');
    }
  }}
>
  Start Free Interview
</Button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;