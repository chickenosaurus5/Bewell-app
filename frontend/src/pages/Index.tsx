import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircle, User, Calendar, TrendingUp, Users, Linkedin, Instagram, Twitter } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import heroCalmImage from "@/assets/309183975_11285963 (1).jpg";
import mindfulnessImage from "@/assets/20945346.jpg";
import communityImage from "@/assets/Tiny office employees working in abstract caring hands.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding-complete");
    const isLoggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(hasCompletedOnboarding === "true" || isLoggedInStatus === "true");
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const recentEvents = [
    {
      title: "Mental Health Awareness Week",
      date: "June 15-21, 2025",
      description: "Join us for a week of workshops, webinars, and community support sessions.",
      image: heroCalmImage
    },
    {
      title: "Mindfulness Workshop",
      date: "July 5, 2025",
      description: "Learn practical mindfulness techniques from certified instructors.",
      image: mindfulnessImage
    },
    {
      title: "Community Support Circle",
      date: "July 12, 2025",
      description: "Connect with others on their mental health journey in a safe space.",
      image: communityImage
    }
  ];

  const statistics = [
    {
      icon: Users,
      value: "200K+",
      label: "Users Worldwide"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "of users report improved mood"
    },
    {
      icon: Calendar,
      value: "15K+",
      label: "sessions with psychologists conducted"
    }
  ];

  const missionCards = [
    {
      icon: MessageCircle,
      title: "AI Mood Assistant",
      description: "Your 24/7 companion that understands and supports your emotional journey with personalized insights."
    },
    {
      icon: TrendingUp,
      title: "Personalized Growth Plan",
      description: "Track your progress and receive tailored recommendations to enhance your mental well-being."
    },
    {
      icon: Heart,
      title: "Professional Guidance",
      description: "Connect with licensed psychologists and therapists for expert support when you need it most."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50" style={{ backgroundColor: '#8447FF' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="text-2xl font-heading font-bold text-white hover:opacity-80 transition-calm"
            >
              BeWell
            </button>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <button className="text-white hover:text-[#F9A620] transition-calm">
                  Community
                </button>
                <button className="text-white hover:text-[#FFB2E6] transition-calm">
                  About Us
                </button>
              </nav>
              <Button
                onClick={() => navigate("/registration")}
                className="rounded-full px-6 bg-white text-[#8447FF] hover:bg-[#F9A620] hover:text-white transition-calm"
              >
                Sign Up
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUserIconClick}
                className="rounded-full text-white hover:bg-white/10"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Mental Health Companion</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground leading-tight">
            Welcome to
            {/* <span className="block gradient-primary bg-clip-text text-transparent">
              BeWell
            </span> */}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your safe space for emotional well-being. Track your mood, chat with our AI companion, and find your path to better mental health.
          </p>
        </div>
      </section>

      {/* Recent Events Carousel */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">Recent Events</h2>
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {recentEvents.map((event, index) => (
                <CarouselItem key={index}>
                  <div className="rounded-3xl bg-card shadow-gentle border border-border overflow-hidden">
                    <div className="flex items-center">
                      <div className="flex-1 p-8">
                        <h3 className="text-2xl font-heading font-semibold mb-3">{event.title}</h3>
                        <p className="text-primary font-medium mb-4">{event.date}</p>
                        <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>
                        <Button 
                          className="px-6 py-3 text-base font-semibold rounded-xl transition-calm"
                          style={{ backgroundColor: '#8447FF', color: 'white' }}
                        >
                          View More
                        </Button>
                      </div>
                      <div className="w-64 h-64 p-4 flex items-center justify-center">
                        <div className="w-full h-full overflow-hidden rounded-2xl">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {statistics.map((stat, index) => {
              const colors = ['#A855F7', '#F9A620', '#FFB2E6'];
              return (
                <div 
                  key={index}
                  className="text-center animate-fade-in"
                >
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: colors[index] }}
                  >
                    <stat.icon className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold mb-2" style={{ color: colors[index] }}>
                    {stat.value}
                  </h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">Community Partners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Google", description: "Technology partner supporting mental health innovation", hoverShadow: "hover:shadow-[0_10px_40px_-10px_#D972FF]" },
              { name: "OpenAI", description: "AI-powered insights for better emotional well-being", hoverShadow: "hover:shadow-[0_10px_40px_-10px_#F9A620]" },
              { name: "American Psychology Association", description: "Professional guidance and research collaboration", hoverShadow: "hover:shadow-[0_10px_40px_-10px_#C3F2A5]" }
            ].map((partner, index) => (
              <div 
                key={index}
                className={`p-8 rounded-3xl bg-card shadow-gentle hover-lift transition-calm animate-fade-in text-center ${partner.hoverShadow}`}
              >
                {/* <h3 className="text-3xl font-heading font-bold mb-4 gradient-primary bg-clip-text text-transparent">
                  {partner.name}
                </h3> */}
                <p className="text-muted-foreground leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {missionCards.map((card, index) => {
              const colors = ['bg-notes text-white', 'bg-activities text-white', 'bg-books text-white'];
              return (
                <div 
                  key={index}
                  className={`p-8 rounded-3xl shadow-gentle hover-lift transition-calm animate-fade-in ${colors[index]}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-6">
                    <card.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-4">{card.title}</h3>
                  <p className="leading-relaxed opacity-90">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8447FF] text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Contact Us & Social Icons */}
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold">contact us:</span>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-calm">
              <Linkedin className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-calm">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-calm">
              <Twitter className="w-5 h-5" />
            </button>
          </div>

          {/* Address */}
          <div className="mb-6">
            <span className="font-semibold">Address: </span>
            <span>California, Silicon Valley</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8">
            <button className="hover:text-[#F9A620] transition-calm">
              cookie management
            </button>
            <button className="hover:text-[#FFB2E6] transition-calm">
              privacy policy
            </button>
            <button className="hover:text-[#C3F2A5] transition-calm">
              careers
            </button>
            <button className="hover:text-[#F9A620] transition-calm">
              partners
            </button>
            <button className="hover:text-[#FFB2E6] transition-calm">
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
