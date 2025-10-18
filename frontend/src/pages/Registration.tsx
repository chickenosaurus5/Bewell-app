import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    return { isValid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend registration endpoint
      const resp = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          email: formData.email,
        }),
      });

      // Try to parse JSON response (server might return error details even on non-2xx)
      let parsed = null;
      try {
        parsed = await resp.json();
        console.debug("Registration response parsed:", parsed, "status:", resp.status);
      } catch (e) {
        // ignore parse errors; parsed stays null
      }

      // Determine failure conditions:
      // - non-2xx status
      // - parsed JSON explicitly indicates failure (common shapes)
      const serverMessage = parsed?.message ?? parsed?.error ?? parsed?.detail ?? null;
      const explicitFailure = parsed && (parsed.success === false || parsed.error || parsed.message || parsed.detail);

      if (!resp.ok || explicitFailure) {
        const message = serverMessage ?? `Registration failed: ${resp.status}`;
        setErrors(prev => ({ ...prev, email: message }));
        return;
      }

      // Success path: parsed may contain navigation hint
      const data = parsed;

      // Persist user id if present and only after a confirmed success
      const userId = data?.user?.id ?? data?.userId ?? data?.id;
      if (userId !== undefined && userId !== null) {
        try {
          localStorage.setItem("loginUserId", String(userId));
        } catch (e) {
          console.error("Failed to write loginUserId to localStorage:", e);
        }
      }

      if (data?.next) {
        navigate(data.next);
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const message = (error && typeof error === "object" && (error as any).message) ? (error as any).message : "Network error. Please try again.";
      setErrors(prev => ({ ...prev, email: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return { strength: (strength / 5) * 100, label: labels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
            Create Account
          </h1>
          <p className="text-muted-foreground text-lg">
            Join us on your wellness journey
          </p>
        </div>
        
        <Card className="p-8 shadow-gentle">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`mt-1 border-0 border-b-2 rounded-none px-0 py-2 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent ${
                    errors.firstName ? "border-red-500" : "border-muted-foreground"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`mt-1 border-0 border-b-2 rounded-none px-0 py-2 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent ${
                    errors.lastName ? "border-red-500" : "border-muted-foreground"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 border-0 border-b-2 rounded-none px-0 py-2 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent ${
                  errors.email ? "border-red-500" : "border-muted-foreground"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`border-0 border-b-2 rounded-none px-0 py-2 pr-8 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent ${
                    errors.password ? "border-red-500" : "border-muted-foreground"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Password strength</span>
                    <span className="font-medium">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.strength < 40 ? "bg-red-500" :
                        passwordStrength.strength < 70 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`border-0 border-b-2 rounded-none px-0 py-2 pr-8 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground bg-transparent ${
                    errors.confirmPassword ? "border-red-500" : "border-muted-foreground"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </p>
              )}
              
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold rounded-xl transition-calm"
              style={{ backgroundColor: '#8447FF', color: 'white' }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/30"></div>
              </div>
              <div className="relative inline-block bg-white px-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground transition-calm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
