
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ShoppingBag, Heart, User } from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Medallion Mart! 🎉",
    description: "You've successfully created your account. Let's get you started with shopping!",
    icon: <CheckCircle className="h-6 w-6 text-green-500" />
  },
  {
    id: 2,
    title: "Browse Premium Products",
    description: "Explore our curated collection of premium products across multiple categories.",
    icon: <ShoppingBag className="h-6 w-6 text-blue-500" />,
    action: "View Products"
  },
  {
    id: 3,
    title: "Create Your Wishlist",
    description: "Save your favorite items for later by adding them to your wishlist.",
    icon: <Heart className="h-6 w-6 text-red-500" />
  },
  {
    id: 4,
    title: "Complete Your Profile",
    description: "Add your delivery address and payment preferences for seamless checkout.",
    icon: <User className="h-6 w-6 text-purple-500" />,
    action: "Setup Profile"
  }
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-center">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip Tour
            </Button>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {currentStep + 1} of {onboardingSteps.length}
              </Badge>
              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 1 ? (
                  "Start Shopping"
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
