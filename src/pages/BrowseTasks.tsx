
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Star, Users, Clock, Filter, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BrowseTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetRange, setBudgetRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      title: "Assemble IKEA furniture in living room",
      description: "Need help assembling a sofa, coffee table, and TV unit. All tools provided. Looking for someone experienced with furniture assembly.",
      budget: "$80-120",
      location: "Sydney CBD",
      posted: "2 hours ago",
      proposals: 8,
      rating: 4.9,
      category: "handyman",
      urgent: false,
      verified: true
    },
    {
      id: 2,
      title: "Deep clean 3-bedroom apartment",
      description: "Moving out cleaning required. Kitchen, bathrooms, and all rooms need thorough cleaning. Must be completed by weekend.",
      budget: "$150-200",
      location: "Melbourne",
      posted: "4 hours ago",
      proposals: 15,
      rating: 4.8,
      category: "cleaning",
      urgent: true,
      verified: true
    },
    {
      id: 3,
      title: "Fix leaking kitchen tap",
      description: "Kitchen tap has been dripping for a week. Need experienced plumber ASAP. Have photos available.",
      budget: "$60-100",
      location: "Brisbane",
      posted: "1 day ago",
      proposals: 12,
      rating: 4.7,
      category: "handyman",
      urgent: false,
      verified: false
    },
    {
      id: 4,
      title: "Dog walking service needed",
      description: "Looking for reliable person to walk my golden retriever twice daily. Monday to Friday, 7am and 6pm.",
      budget: "$25-35/day",
      location: "Perth",
      posted: "2 days ago",
      proposals: 6,
      rating: 4.9,
      category: "pet-care",
      urgent: false,
      verified: true
    },
    {
      id: 5,
      title: "Help with house moving",
      description: "Moving from 2-bedroom apartment to new house. Need help loading/unloading truck and packing fragile items.",
      budget: "$200-300",
      location: "Adelaide",
      posted: "3 days ago",
      proposals: 20,
      rating: 4.6,
      category: "moving",
      urgent: false,
      verified: true
    },
    {
      id: 6,
      title: "Website design for small business",
      description: "Need a modern, responsive website for my local bakery. Must include online ordering system and photo gallery.",
      budget: "$800-1200",
      location: "Darwin",
      posted: "5 days ago",
      proposals: 25,
      rating: 4.8,
      category: "tech",
      urgent: false,
      verified: true
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "handyman", label: "Handyman" },
    { value: "cleaning", label: "Cleaning" },
    { value: "moving", label: "Moving" },
    { value: "tech", label: "Tech Support" },
    { value: "pet-care", label: "Pet Care" },
    { value: "garden", label: "Garden & Outdoor" }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <Button variant="outline">Sign In</Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Post a Task
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tasks</h1>
          <p className="text-gray-600">Find the perfect task that matches your skills and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Tasks</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                  </label>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={1000}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="budget-high">Highest Budget</SelectItem>
                      <SelectItem value="budget-low">Lowest Budget</SelectItem>
                      <SelectItem value="proposals">Most Proposals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>

            <div className="space-y-6">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-xl">{task.title}</CardTitle>
                          {task.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Verified Client
                            </Badge>
                          )}
                          {task.urgent && <Badge variant="destructive">Urgent</Badge>}
                        </div>
                        <CardDescription className="text-sm leading-relaxed">
                          {task.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-3xl font-bold text-green-600">{task.budget}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{task.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{task.posted}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{task.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
                          <Users className="h-4 w-4" />
                          <span>{task.proposals} proposals received</span>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Make an Offer
                          </Button>
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Tasks
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseTasks;
