import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Link } from 'react-router-dom';

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  budgetType: string;
  budgetAmount: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  urgent: boolean;
  requiredDate: Date | null;
  skills: string[];
  timeFlexible: boolean;
}

const PostTask = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'handyman',
    location: '',
    budgetType: 'fixed',
    budgetAmount: null,
    budgetMin: null,
    budgetMax: null,
    urgent: false,
    requiredDate: null,
    skills: [],
    timeFlexible: false,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    { value: "handyman", label: "Handyman" },
    { value: "cleaning", label: "Cleaning" },
    { value: "moving", label: "Moving" },
    { value: "tech", label: "Tech Support" },
    { value: "pet-care", label: "Pet Care" },
    { value: "garden", label: "Garden & Outdoor" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : parseFloat(value),
    }));
  };

  const handleBudgetTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, budgetType: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, requiredDate: date || null }));
    setIsDatePickerOpen(false);
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => {
      let newSkills = [...prev.skills];
      if (checked) {
        newSkills.push(skill);
      } else {
        newSkills = newSkills.filter(s => s !== skill);
      }
      return { ...prev, skills: newSkills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be signed in to post a task.');
      return;
    }

    const {
      title,
      description,
      category,
      location,
      budgetType,
      budgetAmount,
      budgetMin,
      budgetMax,
      urgent,
      requiredDate,
      skills,
      timeFlexible
    } = formData;

    if (!title || !description || !category || !location || !budgetType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (budgetType === 'fixed' && !budgetAmount) {
      toast.error('Please enter a budget amount.');
      return;
    }

    if (budgetType === 'range' && (!budgetMin || !budgetMax)) {
      toast.error('Please enter a budget range.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title,
            description,
            category,
            location,
            budget_type: budgetType,
            budget_amount: budgetAmount,
            budget_min: budgetMin,
            budget_max: budgetMax,
            urgent,
            required_date: requiredDate ? requiredDate.toISOString() : null,
            skills,
            time_flexible: timeFlexible,
            user_id: user.id,
            status: 'open'
          },
        ]);

      if (error) {
        console.error('Error creating task:', error);
        toast.error('Failed to post task. Please try again.');
      } else {
        console.log('Task created successfully:', data);
        toast.success('Task posted successfully!');
        navigate('/browse');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Post a Task
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              You must be signed in to post a task.
            </p>
            <div className="mt-8">
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/browse')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse Tasks
        </Button>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Post a New Task</CardTitle>
                <CardDescription>Describe the task you need help with.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Fix leaky faucet"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Task Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the task in detail..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>

                  <div>
                    <Label>Budget</Label>
                    <RadioGroup defaultValue="fixed" className="flex flex-col space-y-1" onValueChange={handleBudgetTypeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Price</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id="range" />
                        <Label htmlFor="range">Price Range</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly">Hourly Rate</Label>
                      </div>
                    </RadioGroup>

                    {formData.budgetType === 'fixed' && (
                      <div className="mt-2">
                        <Label htmlFor="budgetAmount">Fixed Amount</Label>
                        <Input
                          type="number"
                          id="budgetAmount"
                          name="budgetAmount"
                          value={formData.budgetAmount === null ? '' : formData.budgetAmount.toString()}
                          onChange={handleBudgetChange}
                          placeholder="e.g., 50"
                        />
                      </div>
                    )}

                    {formData.budgetType === 'range' && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="budgetMin">Min Amount</Label>
                          <Input
                            type="number"
                            id="budgetMin"
                            name="budgetMin"
                            value={formData.budgetMin === null ? '' : formData.budgetMin.toString()}
                            onChange={handleBudgetChange}
                            placeholder="e.g., 50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="budgetMax">Max Amount</Label>
                          <Input
                            type="number"
                            id="budgetMax"
                            name="budgetMax"
                            value={formData.budgetMax === null ? '' : formData.budgetMax.toString()}
                            onChange={handleBudgetChange}
                            placeholder="e.g., 100"
                          />
                        </div>
                      </div>
                    )}

                    {formData.budgetType === 'hourly' && (
                      <div className="mt-2">
                        <Label htmlFor="budgetAmount">Hourly Rate</Label>
                        <Input
                          type="number"
                          id="budgetAmount"
                          name="budgetAmount"
                          value={formData.budgetAmount === null ? '' : formData.budgetAmount.toString()}
                          onChange={handleBudgetChange}
                          placeholder="e.g., 20"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="urgent" className="flex items-center space-x-2">
                      <Checkbox
                        id="urgent"
                        name="urgent"
                        checked={formData.urgent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, urgent: !!checked }))}
                      />
                      <span>Urgent</span>
                    </Label>
                  </div>

                  <div>
                    <Label>Required Date</Label>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !formData.requiredDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.requiredDate ? (
                            format(formData.requiredDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={formData.requiredDate}
                          onSelect={handleDateChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Skills Required</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="skill-plumbing" className="flex items-center space-x-2">
                          <Checkbox 
                            id="skill-plumbing" 
                            checked={formData.skills.includes('plumbing')} 
                            onCheckedChange={(checked) => handleSkillChange('plumbing', !!checked)} 
                          />
                          <span>Plumbing</span>
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="skill-electrical" className="flex items-center space-x-2">
                          <Checkbox 
                            id="skill-electrical" 
                            checked={formData.skills.includes('electrical')} 
                            onCheckedChange={(checked) => handleSkillChange('electrical', !!checked)} 
                          />
                          <span>Electrical</span>
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="skill-cleaning" className="flex items-center space-x-2">
                          <Checkbox 
                            id="skill-cleaning" 
                            checked={formData.skills.includes('cleaning')} 
                            onCheckedChange={(checked) => handleSkillChange('cleaning', !!checked)} 
                          />
                          <span>Cleaning</span>
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="skill-moving" className="flex items-center space-x-2">
                          <Checkbox 
                            id="skill-moving" 
                            checked={formData.skills.includes('moving')} 
                            onCheckedChange={(checked) => handleSkillChange('moving', !!checked)} 
                          />
                          <span>Moving</span>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeFlexible" className="flex items-center space-x-2">
                      <Checkbox
                        id="timeFlexible"
                        name="timeFlexible"
                        checked={formData.timeFlexible}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, timeFlexible: !!checked }))}
                      />
                      <span>Time Flexible</span>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">Post Task</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Your Posted Tasks</CardTitle>
                <CardDescription>Manage your posted tasks and view offers.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <Plus className="h-6 w-6 text-blue-600 mb-2" />
                      <h3 className="font-semibold">Post New Task</h3>
                      <p className="text-sm text-gray-600">Need help with something else?</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                      <h3 className="font-semibold">View Offers</h3>
                      <p className="text-sm text-gray-600">Check the offers you have received</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTask;
