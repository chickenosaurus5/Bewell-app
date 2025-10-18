import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Sparkles,
  User,
  Home
} from "lucide-react";
import { format } from "date-fns";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

const Notes = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [userName, setUserName] = useState("Friend");

  // Load saved entries and user data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    const userData = localStorage.getItem("userData");
    
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error loading diary entries:", error);
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

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  const handleCreateEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: newEntry.title.trim(),
      content: newEntry.content.trim(),
      date: format(new Date(), "yyyy-MM-dd"),
      createdAt: new Date().toISOString(),
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: "", content: "" });
    setShowNewEntryModal(false);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setNewEntry({ title: entry.title, content: entry.content });
    setShowNewEntryModal(true);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !newEntry.title.trim() || !newEntry.content.trim()) return;

    const updatedEntry: DiaryEntry = {
      ...editingEntry,
      title: newEntry.title.trim(),
      content: newEntry.content.trim(),
      updatedAt: new Date().toISOString(),
    };

    setEntries(prev => prev.map(entry => 
      entry.id === editingEntry.id ? updatedEntry : entry
    ));
    
    setNewEntry({ title: "", content: "" });
    setEditingEntry(null);
    setShowNewEntryModal(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const handleCloseModal = () => {
    setShowNewEntryModal(false);
    setEditingEntry(null);
    setNewEntry({ title: "", content: "" });
  };

  const getEntryPreview = (content: string): string => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

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
              <Sparkles className="w-5 h-5" />
              My Diary
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
              Welcome to your diary, {userName}
            </h2>
            <p className="text-lg text-muted-foreground">
              Capture your thoughts, feelings, and daily experiences
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => setShowNewEntryModal(true)}
              className="px-8 py-6 text-lg font-semibold rounded-2xl shadow-gentle hover:shadow-lift transition-calm bg-notes text-white hover:bg-notes/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Entries List */}
        <div className="animate-fade-in-slow">
          <h3 className="text-xl font-heading font-semibold mb-6 text-foreground">
            Your Entries ({entries.length})
          </h3>
          
          {entries.length === 0 ? (
            <Card className="p-12 text-center bg-card/50 border-dashed border-2 border-muted-foreground/30">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                No entries yet
              </h4>
              <p className="text-muted-foreground mb-6">
                Start your diary journey by creating your first entry
              </p>
              <Button
                onClick={() => setShowNewEntryModal(true)}
                className="bg-notes text-white hover:bg-notes/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Entry
              </Button>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="p-6 hover-lift transition-calm cursor-pointer bg-card/80 border-border/50"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
                          {entry.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTimeAgo(entry.createdAt)}
                          </div>
                          {entry.updatedAt && (
                            <Badge variant="secondary" className="text-xs">
                              Edited
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEntry(entry);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {getEntryPreview(entry.content)}
                    </p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* New Entry Modal */}
      <Dialog open={showNewEntryModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold">
              {editingEntry ? "Edit Entry" : "New Diary Entry"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title
              </label>
              <Input
                placeholder="Give your entry a title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                className="text-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Content
              </label>
              <Textarea
                placeholder="Write about your day, thoughts, feelings, or anything that's on your mind..."
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[300px] text-base resize-none"
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
                onClick={editingEntry ? handleUpdateEntry : handleCreateEntry}
                disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                className="bg-notes text-white hover:bg-notes/90"
              >
                {editingEntry ? "Update Entry" : "Save Entry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
