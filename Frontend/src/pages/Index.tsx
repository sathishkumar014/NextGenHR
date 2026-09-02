import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueProposition from "@/components/ValueProposition";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Technology from "@/components/Technology";
import WhatYouLearn from "@/components/WhatYouLearn";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <HowItWorks />
      <Features />
      <Technology />
      <WhatYouLearn />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;