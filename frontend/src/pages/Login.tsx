import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, XCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let parsed = null;
      try {
        parsed = await resp.json();
        localStorage.setItem("loginUserId",parsed["user"]["id"])
      } catch (e) {
        // ignore
      }

      const serverMessage = parsed?.message ?? parsed?.error ?? parsed?.detail ?? null;
      const explicitFailure = parsed && (parsed.success === false || parsed.error || parsed.message || parsed.detail);

      if (!resp.ok || explicitFailure) {
        const message = serverMessage ?? `Login failed: ${resp.status}`;
        setError(message);
        return;
      }

      // Success: navigate to provided next or dashboard
      const data = parsed;
      if (data?.next) {
        navigate(data.next);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = (err && typeof err === "object" && (err as any).message) ? (err as any).message : "Network error. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
            Sign In
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back to your wellness journey
          </p>
        </div>
        
        <Card className="p-8 shadow-gentle">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-0 border-b-2 rounded-none px-0 py-2 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent border-muted-foreground"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 border-b-2 rounded-none px-0 py-2 pr-8 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent border-muted-foreground"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg font-semibold rounded-xl transition-calm"
              style={{ backgroundColor: '#8447FF', color: 'white' }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/30"></div>
              </div>
              <div className="relative inline-block bg-white px-4">
                <button
                  type="button"
                  onClick={() => navigate("/registration")}
                  className="text-muted-foreground hover:text-foreground transition-calm"
                  disabled={isLoading}
                >
                  Don't have an account? Create one
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
