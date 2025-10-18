import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Moon, Sun, Battery, BatteryLow, Heart, Smile, Meh, Frown, Cloud } from "lucide-react";

type EmojiOption = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const sleepOptions: EmojiOption[] = [
  { icon: <Moon className="w-12 h-12" />, label: "Poor Sleep", value: "poor" },
  { icon: <Cloud className="w-12 h-12" />, label: "Okay Sleep", value: "okay" },
  { icon: <Sun className="w-12 h-12" />, label: "Great Sleep", value: "great" },
];

const energyOptions: EmojiOption[] = [
  { icon: <BatteryLow className="w-12 h-12" />, label: "Low Energy", value: "low" },
  { icon: <Battery className="w-12 h-12" />, label: "Moderate", value: "moderate" },
  { icon: <Heart className="w-12 h-12" />, label: "High Energy", value: "high" },
];

const stressOptions: EmojiOption[] = [
  { icon: <Smile className="w-12 h-12" />, label: "Calm", value: "calm" },
  { icon: <Meh className="w-12 h-12" />, label: "Moderate", value: "moderate" },
  { icon: <Frown className="w-12 h-12" />, label: "Stressed", value: "stressed" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({
    sleep: "",
    energy: "",
    stress: "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSelect = (category: keyof typeof responses, value: string) => {
    setResponses({ ...responses, [category]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save responses and navigate to dashboard
      localStorage.setItem("onboarding-complete", "true");
      localStorage.setItem("onboarding-data", JSON.stringify(responses));
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    if (step === 1) return responses.sleep !== "";
    if (step === 2) return responses.energy !== "";
    if (step === 3) return responses.stress !== "";
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-heading font-bold text-foreground">
                How did you sleep last night?
              </h2>
              <p className="text-muted-foreground text-lg">
                Your rest impacts your emotional well-being
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {sleepOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`p-8 cursor-pointer transition-calm hover-lift flex flex-col items-center gap-4 ${
                    responses.sleep === option.value
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSelect("sleep", option.value)}
                >
                  <div className="text-primary">{option.icon}</div>
                  <p className="font-medium text-center">{option.label}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-heading font-bold text-foreground">
                What's your energy level today?
              </h2>
              <p className="text-muted-foreground text-lg">
                Understanding your energy helps us support you better
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {energyOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`p-8 cursor-pointer transition-calm hover-lift flex flex-col items-center gap-4 ${
                    responses.energy === option.value
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSelect("energy", option.value)}
                >
                  <div className="text-activities">{option.icon}</div>
                  <p className="font-medium text-center">{option.label}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-heading font-bold text-foreground">
                How stressed do you feel?
              </h2>
              <p className="text-muted-foreground text-lg">
                It's okay to feel stressed—you're not alone
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {stressOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`p-8 cursor-pointer transition-calm hover-lift flex flex-col items-center gap-4 ${
                    responses.stress === option.value
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSelect("stress", option.value)}
                >
                  <div className="text-secondary">{option.icon}</div>
                  <p className="font-medium text-center">{option.label}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-calm flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-12">{renderStep()}</div>

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="px-12 py-6 text-lg font-semibold rounded-2xl shadow-gentle hover:shadow-lift transition-calm"
            >
              {step === totalSteps ? "Complete" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
