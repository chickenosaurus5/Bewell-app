import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Heart, Award, Sparkles, Home, MessageCircle, User } from "lucide-react";
import MoodCalendar from "@/components/MoodCalendar";

const Dashboard = () => {
  const [userName, setUserName] = useState("Friend");
  const [isInProfile, setIsInProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user from backend instead of localStorage
    const fetchUser = async () => {
      try {
        const resp = await fetch(`http://127.0.0.1:8000/profile/${localStorage.getItem("loginUserId")}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        
        let parsed = null;
        try {
          parsed = await resp.json();
        } catch (e) {
          // ignore parse error
        }

        if (!resp.ok || !parsed?.user) {
          // Not authenticated or server returned error -> redirect to login
          navigate("/login");
          return;
        }

        const user = parsed.user;
        if (user?.firstName) setUserName(user.firstName);
        // If backend indicates this is a profile login, setIsInProfile accordingly
        if (parsed?.isProfileLogin !== undefined) {
          setIsInProfile(Boolean(parsed.isProfileLogin));
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  const mySpaceCards = [
    {
      title: "Notes",
      icon: <Sparkles className="w-6 h-6" />,
      color: "notes",
      description: "Daily thoughts",
    },
    {
      title: "Activities",
      icon: <Heart className="w-6 h-6" />,
      color: "activities",
      description: "Mindful moments",
    },
    {
      title: "Books",
      icon: <BookOpen className="w-6 h-6" />,
      color: "books",
      description: "Reading list",
    },
    {
      title: "Achievements",
      icon: <Award className="w-6 h-6" />,
      color: "primary",
      description: "Your progress",
    },
  ];

  return (
    <div className="min-h-screen gradient-calm">
      {/* Navigation Header */}
      <header className="bg-header shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Left: Company Logo */}
            <button 
              onClick={() => navigate("/")}
              className="text-white font-heading font-bold text-xl hover:opacity-80 transition-opacity"
            >
              BeWell
            </button>
            
            {/* Center: AI Companion & Home */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/ai-chat")}
                className="text-white hover:bg-white/10"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              {!isInProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="text-white hover:bg-white/10"
                >
                  <Home className="w-6 h-6" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Right: Empty for balance */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                {userName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
                Welcome back, {userName}
              </h1>
              <p className="text-lg text-muted-foreground italic">
                "You are stronger than you think" 💜
              </p>
            </div>
          </div>
        </div>

        {/* My Space Cards */}
        <div className="mb-12 animate-fade-in-slow">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-foreground">
            My Space
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mySpaceCards.map((card, index) => (
              <Card
                key={index}
                onClick={() => {
                  if (card.title === "Notes") {
                    navigate("/notes");
                  } else if (card.title === "Activities") {
                    navigate("/activities");
                  } else if (card.title === "Achievements") {
                    navigate("/achievements");
                  }
                  // Add navigation for other cards as needed
                }}
                className={`p-6 cursor-pointer hover-lift transition-calm border-0 ${
                  card.color === "notes"
                    ? "bg-notes text-white"
                    : card.color === "activities"
                    ? "bg-activities text-white"
                    : card.color === "books"
                    ? "bg-books text-white"
                    : "bg-achievements text-white"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Mood Calendar */}
        <div className="animate-fade-in-slow">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-foreground">
            Mood Calendar
          </h2>
          <Card className="p-8 bg-calendar border-calendar/50">
            <MoodCalendar />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
