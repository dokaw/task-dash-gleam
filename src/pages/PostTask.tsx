import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, DollarSign, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PostTask = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budgetType: "fixed",
    budgetAmount: "",
    budgetRange: { min: "", max: "" },
    date: undefined as Date | undefined,
    timeFlexible: false,
    skills: [] as string[],
    urgent: false
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    { value: "handyman", label: "Handyman", icon: "🔧" },
    { value: "cleaning", label: "Cleaning", icon: "🧽" },
    { value: "moving", label: "Moving & Delivery", icon: "📦" },
    { value: "tech", label: "Tech Support", icon: "💻" },
    { value: "pet-care", label: "Pet Care", icon: "🐕" },
    { value: "garden", label: "Garden & Outdoor", icon: "🌱" },
    { value: "admin", label: "Admin & Data Entry", icon: "📊" },
    { value: "creative", label: "Creative & Design", icon: "🎨" }
  ];

  const commonSkills = [
    "Assembly", "Plumbing", "Electrical", "Painting", "Carpentry",
    "Cleaning", "Organization", "Pet Sitting", "Dog Walking",
    "Gardening", "Lawn Mowing", "Moving Help", "Delivery"
  ];

  const steps = [
    { number: 1, title: "Task Details", description: "What do you need done?" },
    { number: 2, title: "Budget & Timeline", description: "When and how much?" },
    { number: 3, title: "Review & Post", description: "Confirm your task" }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setTaskData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a task.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare task data for database
      const taskForDB = {
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        location: taskData.location,
        budget_type: taskData.budgetType,
        budget_amount: taskData.budgetType === 'fixed' || taskData.budgetType === 'hourly' 
          ? parseInt(taskData.budgetAmount) || null 
          : null,
        budget_min: taskData.budgetType === 'range' ? parseInt(taskData.budgetRange.min) || null : null,
        budget_max: taskData.budgetType === 'range' ? parseInt(taskData.budgetRange.max) || null : null,
        required_date: taskData.date ? taskData.date.toISOString().split('T')[0] : null,
        time_flexible: taskData.timeFlexible,
        urgent: taskData.urgent,
        skills: taskData.skills,
        status: 'open'
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskForDB])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Task posted successfully!",
        description: "Your task is now live and visible to Taskers.",
      });

      navigate('/browse');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error creating task",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskHub
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={() => navigate('/browse')}>Browse Tasks</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Browse Tasks
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Task</h1>
          <p className="text-gray-600">Tell us what you need done and get offers from trusted Taskers</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm",
                    currentStep >= step.number
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-4",
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Task Title */}
                <div>
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Help me assemble IKEA furniture"
                    value={taskData.title}
                    onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>Category *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-500",
                          taskData.category === category.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        )}
                        onClick={() => setTaskData(prev => ({ ...prev, category: category.value }))}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Task Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need done. Include any specific requirements, tools needed, or important details..."
                    value={taskData.description}
                    onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="Enter your suburb or address"
                      value={taskData.location}
                      onChange={(e) => setTaskData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label>Required Skills (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={taskData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Budget Type */}
                <div>
                  <Label>Budget Type *</Label>
                  <RadioGroup
                    value={taskData.budgetType}
                    onValueChange={(value) => setTaskData(prev => ({ ...prev, budgetType: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Price</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="range" id="range" />
                      <Label htmlFor="range">Price Range</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Budget Amount */}
                {taskData.budgetType === "fixed" && (
                  <div>
                    <Label htmlFor="budget">Budget Amount *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="100"
                        value={taskData.budgetAmount}
                        onChange={(e) => setTaskData(prev => ({ ...prev, budgetAmount: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {taskData.budgetType === "hourly" && (
                  <div>
                    <Label htmlFor="hourly-rate">Hourly Rate *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="hourly-rate"
                        type="number"
                        placeholder="25"
                        value={taskData.budgetAmount}
                        onChange={(e) => setTaskData(prev => ({ ...prev, budgetAmount: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Per hour</p>
                  </div>
                )}

                {taskData.budgetType === "range" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-budget">Minimum Budget *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="min-budget"
                          type="number"
                          placeholder="50"
                          value={taskData.budgetRange.min}
                          onChange={(e) => setTaskData(prev => ({
                            ...prev,
                            budgetRange: { ...prev.budgetRange, min: e.target.value }
                          }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="max-budget">Maximum Budget *</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="max-budget"
                          type="number"
                          placeholder="150"
                          value={taskData.budgetRange.max}
                          onChange={(e) => setTaskData(prev => ({
                            ...prev,
                            budgetRange: { ...prev.budgetRange, max: e.target.value }
                          }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <Label>When do you need this done? *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !taskData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {taskData.date ? format(taskData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={taskData.date}
                        onSelect={(date) => setTaskData(prev => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Flexibility */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flexible"
                    checked={taskData.timeFlexible}
                    onCheckedChange={(checked) => 
                      setTaskData(prev => ({ ...prev, timeFlexible: checked as boolean }))
                    }
                  />
                  <Label htmlFor="flexible">I'm flexible with the timing</Label>
                </div>

                {/* Urgent */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={taskData.urgent}
                    onCheckedChange={(checked) => 
                      setTaskData(prev => ({ ...prev, urgent: checked as boolean }))
                    }
                  />
                  <Label htmlFor="urgent">This is urgent (will be highlighted)</Label>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Task Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Title:</span> {taskData.title}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {
                        categories.find(c => c.value === taskData.category)?.label
                      }
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {taskData.location}
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span> 
                      {taskData.budgetType === "fixed" && ` $${taskData.budgetAmount}`}
                      {taskData.budgetType === "hourly" && ` $${taskData.budgetAmount}/hour`}
                      {taskData.budgetType === "range" && ` $${taskData.budgetRange.min} - $${taskData.budgetRange.max}`}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {
                        taskData.date ? format(taskData.date, "PPP") : "Not specified"
                      }
                    </div>
                    {taskData.skills.length > 0 && (
                      <div>
                        <span className="font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {taskData.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your task will be posted and visible to Taskers</li>
                    <li>• You'll receive offers from qualified Taskers</li>
                    <li>• Review profiles, ratings, and proposals</li>
                    <li>• Choose your preferred Tasker and get started!</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation Buttons */}
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === 3 
                ? (isSubmitting ? "Posting Task..." : "Post Task") 
                : "Next"
              }
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostTask;
