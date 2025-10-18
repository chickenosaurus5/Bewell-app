import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle2,
  Circle,
  Heart,
  User,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState({ title: "", time: "" });
  const [userName, setUserName] = useState("Friend");

  // Load saved activities and user data from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem("activitiesData");
    const userData = localStorage.getItem("userData");
    
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error("Error loading activities:", error);
      }
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

  // Save activities to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem("activitiesData", JSON.stringify(activities));
  }, [activities]);

  const handleCreateActivity = () => {
    if (!newActivity.title.trim()) return;

    const activity: Activity = {
      id: Date.now().toString(),
      title: newActivity.title.trim(),
      time: newActivity.time.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setActivities(prev => [activity, ...prev]);
    setNewActivity({ title: "", time: "" });
    setShowNewActivityModal(false);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setNewActivity({ title: activity.title, time: activity.time || "" });
    setShowNewActivityModal(true);
  };

  const handleUpdateActivity = () => {
    if (!editingActivity || !newActivity.title.trim()) return;

    const updatedActivity: Activity = {
      ...editingActivity,
      title: newActivity.title.trim(),
      time: newActivity.time.trim() || undefined,
    };

    setActivities(prev => prev.map(activity => 
      activity.id === editingActivity.id ? updatedActivity : activity
    ));
    
    setNewActivity({ title: "", time: "" });
    setEditingActivity(null);
    setShowNewActivityModal(false);
  };

  const handleToggleComplete = (activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const wasCompleted = activity.completed;
        const isNowCompleted = !activity.completed;
        
        // Award points when completing an activity
        if (!wasCompleted && isNowCompleted) {
          const currentPoints = parseInt(localStorage.getItem("achievementPoints") || "0");
          const newPoints = currentPoints + 5;
          localStorage.setItem("achievementPoints", newPoints.toString());
          
          // Update level if needed
          updateLevel(newPoints);
        }
        
        return {
          ...activity,
          completed: isNowCompleted,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      }
      return activity;
    }));
  };

  const updateLevel = (points: number) => {
    const currentLevel = parseInt(localStorage.getItem("userLevel") || "1");
    const newLevel = Math.floor(points / 50) + 1; // 50 points per level
    
    if (newLevel > currentLevel) {
      localStorage.setItem("userLevel", newLevel.toString());
      // Could add level up notification here
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
    }
  };

  const handleCloseModal = () => {
    setShowNewActivityModal(false);
    setEditingActivity(null);
    setNewActivity({ title: "", time: "" });
  };

  const getCompletedCount = () => {
    return activities.filter(activity => activity.completed).length;
  };

  const getTotalCount = () => {
    return activities.length;
  };

  const getCompletionPercentage = () => {
    if (activities.length === 0) return 0;
    return Math.round((getCompletedCount() / getTotalCount()) * 100);
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return format(date, "MMM d");
  };

  const sortedActivities = [...activities].sort((a, b) => {
    // Sort by completion status first, then by creation time
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
              <Heart className="w-5 h-5" />
              My Activities
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Your Daily Activities, {userName}
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay organized and track your wellness goals
            </p>
          </div>
          
          {/* Progress Section */}
          {activities.length > 0 && (
            <Card className="p-6 mb-6 bg-card/80 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Today's Progress
                </h3>
                <Badge variant="secondary" className="text-sm">
                  {getCompletedCount()}/{getTotalCount()} completed
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-activities h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {getCompletionPercentage()}% completed
              </p>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={() => setShowNewActivityModal(true)}
              className="px-8 py-6 text-lg font-semibold rounded-2xl shadow-gentle hover:shadow-lift transition-calm bg-activities text-white hover:bg-activities/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Activities List */}
        <div className="animate-fade-in-slow">
          <h3 className="text-xl font-heading font-semibold mb-6 text-foreground">
            Your Activities ({activities.length})
          </h3>
          
          {activities.length === 0 ? (
            <Card className="p-12 text-center bg-card/50 border-dashed border-2 border-muted-foreground/30">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                No activities yet
              </h4>
              <p className="text-muted-foreground mb-6">
                Start building healthy habits by adding your first activity
              </p>
              <Button
                onClick={() => setShowNewActivityModal(true)}
                className="bg-activities text-white hover:bg-activities/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Activity
              </Button>
            </Card>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {sortedActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    className={`p-4 transition-calm border-border/50 ${
                      activity.completed 
                        ? "bg-muted/50 opacity-75" 
                        : "bg-card/80 hover-lift"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={activity.completed}
                        onCheckedChange={() => handleToggleComplete(activity.id)}
                        className="h-5 w-5"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-foreground ${
                          activity.completed ? "line-through text-muted-foreground" : ""
                        }`}>
                          {activity.title}
                        </h4>
                        {activity.time && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {getTimeAgo(activity.createdAt)}
                          {activity.completedAt && (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              Completed {getTimeAgo(activity.completedAt)}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditActivity(activity)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* New Activity Modal */}
      <Dialog open={showNewActivityModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold">
              {editingActivity ? "Edit Activity" : "New Activity"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Activity Name
              </label>
              <Input
                placeholder="e.g., Exercise, Take medication, Eat breakfast..."
                value={newActivity.title}
                onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                className="text-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time (Optional)
              </label>
              <Input
                placeholder="e.g., 8:00 AM, After lunch, Before bed..."
                value={newActivity.time}
                onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                className="text-base"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                onClick={editingActivity ? handleUpdateActivity : handleCreateActivity}
                disabled={!newActivity.title.trim()}
                className="bg-activities text-white hover:bg-activities/90"
              >
                {editingActivity ? "Update Activity" : "Add Activity"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
