import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

type Mood = "excited" | "happy" | "content" | "neutral" | "sad" | "anxious" | "angry" | "tired" | null;

const moodEmojis = {
  excited: "🤩",
  happy: "😊",
  content: "😌",
  neutral: "😐",
  sad: "😢",
  anxious: "😰",
  angry: "😠",
  tired: "😴",
};

const moodLabels = {
  excited: "Excited",
  happy: "Happy",
  content: "Content",
  neutral: "Neutral",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Angry",
  tired: "Tired",
};

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMoods, setSelectedMoods] = useState<Record<string, Mood>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Load saved moods from localStorage on component mount
  useEffect(() => {
    const savedMoods = localStorage.getItem("moodCalendarData");
    if (savedMoods) {
      try {
        setSelectedMoods(JSON.parse(savedMoods));
      } catch (error) {
        console.error("Error loading mood data:", error);
      }
    }
  }, []);

  // Save moods to localStorage whenever selectedMoods changes
  useEffect(() => {
    localStorage.setItem("moodCalendarData", JSON.stringify(selectedMoods));
  }, [selectedMoods]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create a full calendar grid starting from the week start
  const allDays: Date[] = [];
  let currentDay = calendarStart;
  
  // Fill in days before month start
  while (currentDay < monthStart) {
    allDays.push(currentDay);
    currentDay = new Date(currentDay);
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  // Add all days in month
  allDays.push(...daysInMonth);
  
  // Fill remaining days to complete the grid (up to 35 days for 5 weeks)
  const remainingDays = 35 - allDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDay = new Date(monthEnd);
    nextDay.setDate(monthEnd.getDate() + i);
    allDays.push(nextDay);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowMoodModal(true);
  };

  const handleMoodSelect = (mood: Mood) => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      setSelectedMoods((prev) => ({
        ...prev,
        [dateKey]: mood,
      }));
    }
    setShowMoodModal(false);
    setSelectedDate(null);
  };

  const handleRemoveMood = () => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      setSelectedMoods((prev) => {
        const newMoods = { ...prev };
        delete newMoods[dateKey];
        return newMoods;
      });
    }
    setShowMoodModal(false);
    setSelectedDate(null);
  };

  const getMoodForDate = (date: Date): Mood => {
    const dateKey = format(date, "yyyy-MM-dd");
    return selectedMoods[dateKey] || null;
  };

  const getMoodColor = (mood: Mood): string => {
    const colors = {
      excited: "bg-yellow-100 border-yellow-400 text-yellow-800",
      happy: "bg-green-100 border-green-400 text-green-800",
      content: "bg-blue-100 border-blue-400 text-blue-800",
      neutral: "bg-gray-100 border-gray-400 text-gray-800",
      sad: "bg-blue-200 border-blue-500 text-blue-900",
      anxious: "bg-orange-100 border-orange-400 text-orange-800",
      angry: "bg-red-100 border-red-400 text-red-800",
      tired: "bg-purple-100 border-purple-400 text-purple-800",
    };
    return colors[mood] || "bg-gray-100 border-gray-400 text-gray-800";
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
        <h3 className="text-xl font-heading font-bold text-foreground">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 hover:bg-foreground/5"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 hover:bg-foreground/5"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="font-medium text-xs text-foreground/60 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {allDays.map((day, index) => {
          const mood = getMoodForDate(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={`${day.toString()}-${index}`}
              className="relative aspect-square"
            >
              <button
                onClick={() => handleDayClick(day)}
                className={`w-full h-full rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-calm hover:scale-105 ${
                  mood
                    ? `${getMoodColor(mood)}`
                    : isCurrentDay
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/20 bg-white text-foreground hover:border-primary/50"
                } ${!isCurrentMonth ? "opacity-30" : ""}`}
              >
                {mood ? (
                  <span className="text-lg">{moodEmojis[mood]}</span>
                ) : (
                  <span className="text-sm">{format(day, "d")}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Mood Selection Modal */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold text-center">
              How did you feel on {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current mood display */}
            {selectedDate && getMoodForDate(selectedDate) && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Current mood:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{moodEmojis[getMoodForDate(selectedDate)!]}</span>
                  <span className="font-medium">{moodLabels[getMoodForDate(selectedDate)!]}</span>
                </div>
              </div>
            )}

            {/* Mood selection grid */}
            <div className="grid grid-cols-4 gap-3">
              {(Object.entries(moodEmojis) as [Mood, string][]).map(([mood, emoji]) => (
                <Card
                  key={mood}
                  className={`p-4 cursor-pointer transition-calm hover-lift flex flex-col items-center gap-2 ${
                    selectedDate && getMoodForDate(selectedDate) === mood
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleMoodSelect(mood)}
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-xs font-medium text-center">{moodLabels[mood]}</span>
                </Card>
              ))}
            </div>

            {/* Remove mood button */}
            {selectedDate && getMoodForDate(selectedDate) && (
              <div className="flex justify-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleRemoveMood}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove mood
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoodCalendar;
