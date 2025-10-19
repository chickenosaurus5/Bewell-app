import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Send, User, Settings } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:8000";

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm here to support you. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [chatColor, setChatColor] = useState("#8447FF");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const previousChats = [
    { id: 1, name: "Morning Anxiety Discussion", date: "Today" },
    { id: 2, name: "Sleep Pattern Chat", date: "Yesterday" },
    { id: 3, name: "Work Stress Conversation", date: "2 days ago" },
  ];

  const analysis = {
    mood: "Your mood has been mostly positive this week",
    patterns: "You tend to feel better in the mornings",
    progress: "You've been more consistent with self-care"
  };


  // const getUserId = (): number => {
  //   const v = localStorage.getItem("userId");
  //   const n = v ? Number(v) : NaN;
  //   return Number.isFinite(n) ? n : 1;
  // };

  useEffect(() => {
    // scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const text = input;

    // optimistic UI: add user's message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: localStorage.getItem("loginUserId"), message: text }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply : JSON.stringify(data?.reply ?? "No reply");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      const msg = err?.message ?? "Request failed";
      setError(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-header border-b border-header/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>AI Companion</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Previous Chats */}
                  <div>
                    <h3 className="font-semibold mb-3">Previous Chats</h3>
                    <div className="space-y-2">
                      {previousChats.map(chat => (
                        <div
                          key={chat.id}
                          className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        >
                          <p className="font-medium text-sm">{chat.name}</p>
                          <p className="text-xs text-muted-foreground">{chat.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h3 className="font-semibold mb-3">Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded-lg bg-activities/10 hover:bg-activities transition-colors cursor-pointer">
                        <p className="font-medium">Mood</p>
                        <p className="text-muted-foreground">{analysis.mood}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-books/10 hover:bg-books transition-colors cursor-pointer">
                        <p className="font-medium">Patterns</p>
                        <p className="text-muted-foreground">{analysis.patterns}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-achievements/10 hover:bg-achievements transition-colors cursor-pointer">
                        <p className="font-medium">Progress</p>
                        <p className="text-muted-foreground">{analysis.progress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-white font-heading font-semibold text-lg">AI Companion</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:bg-white/10"
              >
                <User className="w-5 h-5" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Settings className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>AI Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="chat-color">Chat Color</Label>
                      <Input
                        id="chat-color"
                        type="color"
                        value={chatColor}
                        onChange={(e) => setChatColor(e.target.value)}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ka">Georgian</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="container mx-auto max-w-4xl py-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "text-white"
                    : "bg-muted text-foreground"
                }`}
                style={message.role === "user" ? { backgroundColor: chatColor } : {}}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background sticky bottom-0">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), sendMessage())}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              size="icon" 
              className="hover:opacity-90 transition-opacity"
              style={{ backgroundColor: chatColor }}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
