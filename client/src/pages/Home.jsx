import React from "react";
import { BookOpen, Users, RefreshCw, Zap, MessageSquare } from "lucide-react";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import TestimonialSection from "../components/TestimonialSection";
import CallToAction from "../components/CallToAction";

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-teal-600" />,
      title: "Learn anything",
      description:
        "Access a diverse range of skills from coding to cooking, taught by real people with real experience.",
    },
    {
      icon: <Users className="h-6 w-6 text-teal-600" />,
      title: "Teach what you know",
      description:
        "Share your expertise and help others while building your profile as a skilled mentor.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-teal-600" />,
      title: "Fair exchanges",
      description:
        "Our matching algorithm ensures balanced skill swaps so everyone benefits equally.",
    },
    {
      icon: <Zap className="h-6 w-6 text-teal-600" />,
      title: "No cost learning",
      description:
        "Learn new skills without spending money - just exchange your knowledge for others.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-teal-600" />,
      title: "Build connections",
      description:
        "Create meaningful relationships with others who share your passion for learning.",
    },
  ];

  return (
    <div>
      <Hero />
      <FeatureSection features={features} />
      <TestimonialSection />
      <CallToAction />
    </div>
  );
};

export default Home;
