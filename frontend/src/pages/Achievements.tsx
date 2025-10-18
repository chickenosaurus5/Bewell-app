import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Award, 
  Star,
  Crown,
  Gift,
  BookOpen,
  Bot,
  Percent,
  Trophy,
  Zap,
  User,
  ShoppingCart,
  CheckCircle2
} from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  category: "discount" | "ebook" | "premium" | "cosmetic";
  purchased: boolean;
}

const Achievements = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [userName, setUserName] = useState("Friend");
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const rewards: Reward[] = [
    {
      id: "discount-10",
      name: "10% Wellness Discount",
      description: "Get 10% off on wellness products and services",
      cost: 100,
      icon: <Percent className="w-6 h-6" />,
      category: "discount",
      purchased: false,
    },
    {
      id: "ebook-mindfulness",
      name: "Mindfulness E-book",
      description: "Free access to our premium mindfulness guide",
      cost: 150,
      icon: <BookOpen className="w-6 h-6" />,
      category: "ebook",
      purchased: false,
    },
    {
      id: "premium-ai-week",
      name: "1 Week Premium AI",
      description: "Unlock advanced AI features for 7 days",
      cost: 200,
      icon: <Bot className="w-6 h-6" />,
      category: "premium",
      purchased: false,
    },
    {
      id: "discount-20",
      name: "20% Wellness Discount",
      description: "Get 20% off on wellness products and services",
      cost: 250,
      icon: <Percent className="w-6 h-6" />,
      category: "discount",
      purchased: false,
    },
    {
      id: "ebook-stress",
      name: "Stress Management E-book",
      description: "Complete guide to managing stress and anxiety",
      cost: 300,
      icon: <BookOpen className="w-6 h-6" />,
      category: "ebook",
      purchased: false,
    },
    {
      id: "premium-ai-month",
      name: "1 Month Premium AI",
      description: "Unlock advanced AI features for 30 days",
      cost: 500,
      icon: <Bot className="w-6 h-6" />,
      category: "premium",
      purchased: false,
    },
    {
      id: "golden-theme",
      name: "Golden Theme",
      description: "Unlock exclusive golden theme for your dashboard",
      cost: 200,
      icon: <Star className="w-6 h-6" />,
      category: "cosmetic",
      purchased: false,
    },
    {
      id: "premium-ai-year",
      name: "1 Year Premium AI",
      description: "Unlock advanced AI features for 365 days",
      cost: 2000,
      icon: <Bot className="w-6 h-6" />,
      category: "premium",
      purchased: false,
    },
  ];

  // Load user data and achievements
  useEffect(() => {
    const savedPoints = localStorage.getItem("achievementPoints");
    const savedLevel = localStorage.getItem("userLevel");
    const userData = localStorage.getItem("userData");
    
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }
    if (savedLevel) {
      setLevel(parseInt(savedLevel));
    }
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.firstName) {
          setUserName(parsedData.firstName);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getLevelProgress = () => {
    const currentLevelPoints = (level - 1) * 50;
    const nextLevelPoints = level * 50;
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const getLevelTitle = (level: number): string => {
    if (level >= 20) return "Legendary Wellness Master";
    if (level >= 15) return "Wellness Sage";
    if (level >= 10) return "Wellness Expert";
    if (level >= 5) return "Wellness Enthusiast";
    return "Wellness Beginner";
  };

  const getLevelColor = (level: number): string => {
    if (level >= 20) return "text-purple-600";
    if (level >= 15) return "text-blue-600";
    if (level >= 10) return "text-green-600";
    if (level >= 5) return "text-yellow-600";
    return "text-gray-600";
  };

  const handlePurchaseReward = (reward: Reward) => {
    if (points >= reward.cost) {
      const newPoints = points - reward.cost;
      setPoints(newPoints);
      localStorage.setItem("achievementPoints", newPoints.toString());
      
      // Mark reward as purchased
      const purchasedRewards = JSON.parse(localStorage.getItem("purchasedRewards") || "[]");
      purchasedRewards.push(reward.id);
      localStorage.setItem("purchasedRewards", JSON.stringify(purchasedRewards));
      
      setShowRewardsModal(false);
      setSelectedReward(null);
      
      // Show success message
      alert(`Congratulations! You've purchased ${reward.name}!`);
    } else {
      alert("Not enough points! Complete more activities to earn points.");
    }
  };

  const getPurchasedRewards = (): string[] => {
    return JSON.parse(localStorage.getItem("purchasedRewards") || "[]");
  };

  const purchasedRewards = getPurchasedRewards();

  return (
    <div className="min-h-screen gradient-calm">
      {/* Navigation Header */}
      <header className="bg-header shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Center: Title */}
            <h1 className="text-white font-heading font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </h1>
            
            {/* Right: User Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome to Achievements, {userName}!
            </h2>
            <p className="text-lg text-muted-foreground">
              Earn points, level up, and unlock amazing rewards
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Points Card */}
          <Card className="p-6 bg-card/80 border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  {points}
                </h3>
                <p className="text-muted-foreground font-medium">Achievement Points</p>
              </div>
            </div>
          </Card>

          {/* Level Card */}
          <Card className="p-6 bg-card/80 border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  Level {level}
                </h3>
                <p className="text-muted-foreground font-medium">{getLevelTitle(level)}</p>
              </div>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="p-6 bg-card/80 border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-activities flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Next Level
                </h3>
                <Progress value={getLevelProgress()} className="h-2 mb-1" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(getLevelProgress())}% to Level {level + 1}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rewards Section */}
        <div className="animate-fade-in-slow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-semibold text-foreground">
              Rewards Store
            </h3>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {rewards.length} rewards available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const isPurchased = purchasedRewards.includes(reward.id);
                const canAfford = points >= reward.cost;
                
                return (
                  <Card
                    key={reward.id}
                    className={`p-6 transition-all duration-300 border-border/50 shadow-none h-full ${
                      isPurchased 
                        ? "bg-muted/50 opacity-75" 
                        : "bg-card/80 cursor-pointer hover:scale-105 hover:-translate-y-1"
                    }`}
                    style={{
                      boxShadow: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isPurchased) {
                        const colors = {
                          discount: '0 20px 60px -10px rgba(132, 71, 255, 0.6)',
                          ebook: '0 20px 60px -10px rgba(249, 166, 32, 0.6)',
                          premium: '0 20px 60px -10px rgba(255, 178, 230, 0.6)',
                          cosmetic: '0 20px 60px -10px rgba(195, 242, 165, 0.6)'
                        };
                        e.currentTarget.style.boxShadow = colors[reward.category];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPurchased) {
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                    onClick={() => {
                      if (!isPurchased && canAfford) {
                        setSelectedReward(reward);
                        setShowRewardsModal(true);
                      }
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          reward.category === "discount" ? "bg-primary" :
                          reward.category === "ebook" ? "bg-books" :
                          reward.category === "premium" ? "bg-secondary" :
                          "bg-notes"
                        }`}>
                          {reward.icon}
                        </div>
                        {isPurchased && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-foreground mb-3 text-lg">
                          {reward.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {reward.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground text-lg">
                            {reward.cost}
                          </span>
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>
                        {isPurchased ? (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            Purchased
                          </Badge>
                        ) : !canAfford ? (
                          <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                            Need {reward.cost - points} more
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs px-2 py-1 bg-primary text-primary-foreground">
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="mt-8 p-6 bg-card/80 border-border/50">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            How to Earn Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-activities flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">Complete Activities</p>
                <p className="text-sm text-muted-foreground">+5 points per activity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-notes flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">Write Diary Entries</p>
                <p className="text-sm text-muted-foreground">+3 points per entry</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">Use AI Chat</p>
                <p className="text-sm text-muted-foreground">+1 point per session</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">Daily Streaks</p>
                <p className="text-sm text-muted-foreground">+10 points per day</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Purchase Confirmation Modal */}
      <Dialog open={showRewardsModal} onOpenChange={() => setShowRewardsModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold">
              Purchase Reward
            </DialogTitle>
          </DialogHeader>
          
          {selectedReward && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  selectedReward.category === "discount" ? "bg-primary" :
                  selectedReward.category === "ebook" ? "bg-books" :
                  selectedReward.category === "premium" ? "bg-secondary" :
                  "bg-notes"
                }`}>
                  {selectedReward.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {selectedReward.name}
                </h3>
                <p className="text-muted-foreground">
                  {selectedReward.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Cost</p>
                  <p className="text-sm text-muted-foreground">Achievement Points</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-foreground">
                    {selectedReward.cost}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Your Balance</p>
                  <p className="text-sm text-muted-foreground">Available Points</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-foreground">
                    {points}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRewardsModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePurchaseReward(selectedReward)}
                  disabled={points < selectedReward.cost}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Achievements;
